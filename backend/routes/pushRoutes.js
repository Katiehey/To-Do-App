const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { subscribe, unsubscribe } = require('../controllers/pushController');

router.post('/subscribe',   protect, subscribe);
router.delete('/unsubscribe', protect, unsubscribe);

module.exports = router;
