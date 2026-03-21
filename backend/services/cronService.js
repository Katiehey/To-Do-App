const cron = require('node-cron');
const webpush = require('web-push');
const { Task, User } = require('../models');
const { shouldGenerateNextOccurrence, createNextOccurrence } = require('../utils/recurringTasks');

let pushConfigured = false;

const configureWebPush = () => {
  if (pushConfigured) return true;

  const subject = process.env.VAPID_SUBJECT;
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!subject || !publicKey || !privateKey) {
    console.warn('⚠️ Push notifications disabled: missing VAPID env variables');
    return false;
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  pushConfigured = true;
  return true;
};

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
 * Send push notifications for due/overdue tasks to all users.
 */
const sendPushNotifications = async () => {
  try {
    if (!configureWebPush()) return;

    const now = new Date();
    const in30 = new Date(now.getTime() + 30 * 60 * 1000);
    const ago24 = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const tasks = await Task.find({
      taskStatus: { $nin: ['completed', 'archived'] },
      dueDate: { $gte: ago24, $lte: in30 },
    }).populate('user', 'pushSubscriptions preferences');

    if (!tasks.length) return;

    const byUser = {};
    for (const task of tasks) {
      if (!task.user || !task.user.pushSubscriptions?.length) continue;
      if (!task.user.preferences?.notifications?.push) continue;
      const uid = task.user._id.toString();
      if (!byUser[uid]) byUser[uid] = { user: task.user, tasks: [] };
      byUser[uid].tasks.push(task);
    }

    for (const { user, tasks: userTasks } of Object.values(byUser)) {
      for (const task of userTasks) {
        const dueDate = new Date(task.dueDate);
        const diffMins = Math.round((dueDate - now) / 60000);
        const isOverdue = diffMins < 0;

        const payload = JSON.stringify({
          title: isOverdue ? `⚠️ Overdue: ${task.title}` : `⏰ Due soon: ${task.title}`,
          body: isOverdue
            ? `This task was due ${Math.abs(diffMins)} minute(s) ago.`
            : `Due in ${diffMins} minute(s).`,
          tag: `task-${task._id}-${isOverdue ? 'overdue' : 'due-soon'}`,
          url: '/tasks',
        });

        const staleEndpoints = [];
        await Promise.allSettled(
          user.pushSubscriptions.map(async (sub) => {
            try {
              await webpush.sendNotification(sub, payload);
            } catch (err) {
              if (err.statusCode === 410 || err.statusCode === 404) {
                staleEndpoints.push(sub.endpoint);
              } else {
                console.error('Push send error:', err.message);
              }
            }
          })
        );

        if (staleEndpoints.length) {
          await User.findByIdAndUpdate(user._id, {
            $pull: { pushSubscriptions: { endpoint: { $in: staleEndpoints } } },
          });
        }
      }
    }
  } catch (error) {
    console.error('❌ Error in sendPushNotifications:', error);
  }
};

/**
 * Initialize cron jobs
 */
const initializeCronJobs = () => {

  // 3. Run every minute — push notifications for due/overdue tasks
  cron.schedule('* * * * *', async () => {
    await sendPushNotifications();
  });

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
  console.log('📅 Daily check: Midnight | ⏱️ Hourly check: Top of the hour | 🔔 Push: Every minute');
};

module.exports = {
  initializeCronJobs,
  checkRecurringTasks,
};