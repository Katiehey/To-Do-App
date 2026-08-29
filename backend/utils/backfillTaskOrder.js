/**
 * One-time backfill for the manual drag-and-drop `order` field.
 *
 * Existing tasks were all created with `order: 0`, so cross-page manual
 * ordering is ambiguous until each task has a distinct value. This script
 * assigns a dense, per-user sequence (newest task first / lowest order),
 * matching the app's default "newest on top" behaviour.
 *
 * Safe to run multiple times — it simply rewrites `order` from the current
 * createdAt sequence.
 *
 *   node utils/backfillTaskOrder.js        # backfill every user
 *   npm run backfill:order
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Task } = require('../models');

dotenv.config();

const backfillTaskOrder = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ MongoDB connected');

  // Distinct user ids that own tasks.
  const userIds = await Task.distinct('user');
  console.log(`Found ${userIds.length} user(s) with tasks`);

  let totalUpdated = 0;

  for (const userId of userIds) {
    // Newest first so the most recent task gets the lowest `order` (top of list).
    const tasks = await Task.find({ user: userId })
      .sort({ createdAt: -1 })
      .select('_id');

    if (tasks.length === 0) continue;

    const operations = tasks.map((task, index) => ({
      updateOne: {
        filter: { _id: task._id },
        update: { $set: { order: index } },
      },
    }));

    const result = await Task.bulkWrite(operations);
    totalUpdated += result.modifiedCount ?? tasks.length;
    console.log(`  user ${userId}: ordered ${tasks.length} task(s)`);
  }

  console.log(`\n✅ Backfill complete — ${totalUpdated} task(s) updated`);
};

backfillTaskOrder()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(`❌ Backfill failed: ${err.message}`);
    process.exit(1);
  });
