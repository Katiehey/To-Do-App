const { test } = require('node:test');
const assert = require('node:assert/strict');
const Task = require('../models/Task');

// The description length limit is duplicated on the frontend
// (frontend/src/utils/constants.js DESCRIPTION_MAX_LENGTH) and in the
// request validator (backend/middleware/validators/taskValidator.js).
// If this value changes, update all three so they stay in sync.
const DESCRIPTION_MAX_LENGTH = 5000;

// validateSync() runs Mongoose validators without needing a DB connection.
const validate = (description) =>
  new Task({ title: 'Test task', description }).validateSync();

test('accepts a description exactly at the max length', () => {
  const err = validate('a'.repeat(DESCRIPTION_MAX_LENGTH));
  assert.equal(err?.errors?.description, undefined, 'should not flag description');
});

test('rejects a description over the max length', () => {
  const err = validate('a'.repeat(DESCRIPTION_MAX_LENGTH + 1));
  assert.ok(err, 'validation should fail');
  assert.ok(err.errors.description, 'description error should be present');
  assert.match(
    err.errors.description.message,
    new RegExp(`${DESCRIPTION_MAX_LENGTH}`),
    'error message should reference the configured limit'
  );
});
