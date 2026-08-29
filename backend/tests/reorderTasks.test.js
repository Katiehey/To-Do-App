const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');

const { Task } = require('../models');
const { reorderTasks } = require('../controllers/taskController');

// --- Test doubles -----------------------------------------------------------

// Drive an asyncHandler-wrapped controller and resolve with whatever it does
// first: send a JSON response, or forward an error to next().
const runController = (handler, req) =>
  new Promise((resolve) => {
    const res = {
      statusCode: 200,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        resolve({ type: 'json', statusCode: this.statusCode, payload });
      },
    };
    const next = (error) => resolve({ type: 'next', statusCode: res.statusCode, error });
    handler(req, res, next);
  });

const makeReq = (body) => ({ body, user: { _id: 'user-1' } });

// Preserve/restore the real Mongoose statics we stub out.
let originalCountDocuments;
let originalBulkWrite;
let bulkWriteCalls;

beforeEach(() => {
  originalCountDocuments = Task.countDocuments;
  originalBulkWrite = Task.bulkWrite;
  bulkWriteCalls = [];
  Task.bulkWrite = async (operations) => {
    bulkWriteCalls.push(operations);
    return { modifiedCount: operations.length };
  };
});

afterEach(() => {
  Task.countDocuments = originalCountDocuments;
  Task.bulkWrite = originalBulkWrite;
});

// --- Tests ------------------------------------------------------------------

test('persists order for each id, offset by startIndex', async () => {
  Task.countDocuments = async () => 3; // all ids owned by the user

  const result = await runController(
    reorderTasks,
    makeReq({ orderedIds: ['a', 'b', 'c'], startIndex: 20 })
  );

  assert.equal(result.type, 'json');
  assert.equal(result.statusCode, 200);
  assert.equal(result.payload.success, true);

  assert.equal(bulkWriteCalls.length, 1);
  const ops = bulkWriteCalls[0];
  assert.deepEqual(
    ops.map((op) => op.updateOne.update.$set.order),
    [20, 21, 22],
    'order values should start at startIndex and increment'
  );
  // Every write is scoped to the requesting user.
  assert.ok(ops.every((op) => op.updateOne.filter.user === 'user-1'));
  assert.deepEqual(
    ops.map((op) => op.updateOne.filter._id),
    ['a', 'b', 'c']
  );
});

test('defaults startIndex to 0 when omitted', async () => {
  Task.countDocuments = async () => 2;

  await runController(reorderTasks, makeReq({ orderedIds: ['x', 'y'] }));

  const ops = bulkWriteCalls[0];
  assert.deepEqual(
    ops.map((op) => op.updateOne.update.$set.order),
    [0, 1]
  );
});

test('rejects with 403 when an id is not owned by the user', async () => {
  Task.countDocuments = async () => 2; // only 2 of the 3 ids belong to the user

  const result = await runController(
    reorderTasks,
    makeReq({ orderedIds: ['a', 'b', 'somebody-elses'], startIndex: 0 })
  );

  assert.equal(result.type, 'next');
  assert.equal(result.statusCode, 403);
  assert.match(result.error.message, /not found or unauthorized/i);
  assert.equal(bulkWriteCalls.length, 0, 'must not write anything on an ownership failure');
});

test('rejects with 400 when orderedIds is empty or missing', async () => {
  let countCalled = false;
  Task.countDocuments = async () => {
    countCalled = true;
    return 0;
  };

  for (const body of [{ orderedIds: [] }, {}, { orderedIds: 'nope' }]) {
    const result = await runController(reorderTasks, makeReq(body));
    assert.equal(result.type, 'next');
    assert.equal(result.statusCode, 400);
    assert.match(result.error.message, /non-empty array/i);
  }

  assert.equal(countCalled, false, 'should bail before touching the database');
  assert.equal(bulkWriteCalls.length, 0);
});
