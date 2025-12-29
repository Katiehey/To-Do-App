const cron = require('node-cron');
const { Task } = require('../models');
const { shouldGenerateNextOccurrence, createNextOccurrence } = require('../utils/recurringTasks');

/**
 * Check and create next occurrences for completed recurring tasks
 */
const checkRecurringTasks = async () => {
  try {
    console.log('🔄 Checking recurring tasks...');

    // ✅ Fix: Changed 'completed: true' to 'taskStatus: "completed"' 
    // to match your controller logic
    const completedRecurringTasks = await Task.find({
      'recurring.enabled': true,
      taskStatus: 'completed',
    });

    let created = 0;

    for (const task of completedRecurringTasks) {
      try {
        // Double-check if the next occurrence already exists to prevent duplicates
        if (shouldGenerateNextOccurrence(task)) {
          const nextTask = await createNextOccurrence(Task, task);
          if (nextTask) {
            created++;
            console.log(`✅ Created next occurrence for: "${task.title}"`);
          }
        }
      } catch (taskError) {
        // Log individual task errors but continue the loop
        console.error(`❌ Error processing task ${task._id}:`, taskError.message);
      }
    }

    console.log(`✅ Recurring tasks check complete. Created ${created} new occurrences.`);
  } catch (error) {
    console.error('❌ Critical Error in checkRecurringTasks:', error);
  }
};

/**
 * Initialize cron jobs
 */
const initializeCronJobs = () => {
  // 1. Run every day at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('⏰ Running daily recurring tasks check...');
    await checkRecurringTasks();
  });

  // 2. Run every hour (optional, provides redundancy)
  cron.schedule('0 * * * *', async () => {
    console.log('⏰ Running hourly recurring tasks check...');
    await checkRecurringTasks();
  });

  console.log('✅ Cron jobs initialized');
  console.log('📅 Daily check: Midnight | ⏱️ Hourly check: Top of the hour');
};

module.exports = {
  initializeCronJobs,
  checkRecurringTasks,
};