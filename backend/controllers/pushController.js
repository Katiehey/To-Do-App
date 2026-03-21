const asyncHandler = require('../middleware/asyncHandler');
const { User } = require('../models');

/**
 * POST /api/push/subscribe
 * Save (or refresh) a push subscription for the authenticated user.
 */
const subscribe = asyncHandler(async (req, res) => {
  const payload = req.body?.subscription || req.body || {};
  const { endpoint, keys } = payload;

  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    res.status(400);
    throw new Error('Invalid push subscription object');
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (!Array.isArray(user.pushSubscriptions)) {
    user.pushSubscriptions = [];
  }

  // Replace existing subscription with same endpoint, or add new one
  const existingIndex = user.pushSubscriptions.findIndex(
    (s) => s.endpoint === endpoint
  );

  if (existingIndex >= 0) {
    user.pushSubscriptions[existingIndex] = { endpoint, keys };
  } else {
    user.pushSubscriptions.push({ endpoint, keys });
  }

  await user.save();

  res.status(201).json({ success: true, message: 'Push subscription saved' });
});

/**
 * DELETE /api/push/unsubscribe
 * Remove a push subscription by endpoint.
 */
const unsubscribe = asyncHandler(async (req, res) => {
  const { endpoint } = req.body;

  if (!endpoint) {
    res.status(400);
    throw new Error('endpoint is required');
  }

  await User.findByIdAndUpdate(req.user._id, {
    $pull: { pushSubscriptions: { endpoint } },
  });

  res.json({ success: true, message: 'Push subscription removed' });
});

module.exports = { subscribe, unsubscribe };
