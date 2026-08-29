const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');

const { Task } = require('../models');
const { moveTask } = require('../controllers/taskController');

// Resolve when the controller either responds or forwards an error to next().
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

const makeReq = (id, position) => ({
  params: { id },
  body: { position },
  user: { _id: 'user-1' },
});

// A fake task document with a spy-able save()/populate().
const makeTaskDoc = (order) => ({
  _id: 'task-1',
  user: { toString: () => 'user-1' },
  order,
  saved: false,
  async save() { this.saved = true; },
  async populate() { return this; },
});

let originalFindById;
let originalFindOne;

beforeEach(() => {
  originalFindById = Task.findById;
  originalFindOne = Task.findOne;
});

afterEach(() => {
  Task.findById = originalFindById;
  Task.findOne = originalFindOne;
});

// Helper to stub Task.findOne().sort().select() returning the edge task.
const stubEdge = (edgeOrder) => {
  Task.findOne = () => ({
    sort() { return this; },
    select() { return Promise.resolve(edgeOrder === null ? null : { order: edgeOrder }); },
  });
};

test("'top' sets order below the current minimum", async () => {
  const doc = makeTaskDoc(5);
  Task.findById = async () => doc;
  stubEdge(0); // lowest existing order is 0

  const result = await runController(moveTask, makeReq('task-1', 'top'));

  assert.equal(result.type, 'json');
  assert.equal(result.statusCode, 200);
  assert.equal(doc.order, -1, 'should be placed just above the current top');
  assert.equal(doc.saved, true);
});

test("'bottom' sets order above the current maximum", async () => {
  const doc = makeTaskDoc(5);
  Task.findById = async () => doc;
  stubEdge(42); // highest existing order is 42

  const result = await runController(moveTask, makeReq('task-1', 'bottom'));

  assert.equal(result.statusCode, 200);
  assert.equal(doc.order, 43, 'should be placed just below the current bottom');
});

test('rejects an invalid position with 400', async () => {
  let findByIdCalled = false;
  Task.findById = async () => { findByIdCalled = true; return makeTaskDoc(0); };

  const result = await runController(moveTask, makeReq('task-1', 'sideways'));

  assert.equal(result.type, 'next');
  assert.equal(result.statusCode, 400);
  assert.match(result.error.message, /top.*bottom/i);
  assert.equal(findByIdCalled, false, 'should validate before hitting the database');
});

test('rejects a task owned by another user with 404', async () => {
  Task.findById = async () => ({
    _id: 'task-1',
    user: { toString: () => 'someone-else' },
    order: 0,
    async save() {},
    async populate() { return this; },
  });

  const result = await runController(moveTask, makeReq('task-1', 'top'));

  assert.equal(result.type, 'next');
  assert.equal(result.statusCode, 404);
  assert.match(result.error.message, /not found or unauthorized/i);
});
