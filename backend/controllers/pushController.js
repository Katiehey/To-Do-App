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

  // Use atomic updates so unrelated user validation cannot break push registration.
  await User.updateOne(
    { _id: req.user._id },
    {
      $pull: { pushSubscriptions: { endpoint } },
    }
  );

  await User.updateOne(
    { _id: req.user._id },
    {
      $push: { pushSubscriptions: { endpoint, keys } },
    }
  );

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
