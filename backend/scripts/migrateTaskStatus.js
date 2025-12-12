const mongoose = require('mongoose');
require('dotenv').config(); 
const connectDB = require('../config/db');
const Task = require('../models/Task');

(async () => {
  try {
    await connectDB();
    const result = await Task.updateMany(
      { taskStatus: { $exists: false } },
      { $set: { taskStatus: "pending" } }
    );
    console.log(`✅ Migration complete. Updated ${result.modifiedCount} tasks.`);
    process.exit();
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
})();
