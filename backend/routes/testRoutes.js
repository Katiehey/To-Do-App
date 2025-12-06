const express = require('express');
const router = express.Router();

// Test route to verify routing works
router.get('/ping', (req, res) => {
  res.json({ 
    message: 'pong',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;