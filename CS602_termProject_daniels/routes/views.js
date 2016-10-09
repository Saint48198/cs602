const express = require('express');
const router = express.Router();
const pageView = require('../controllers/page');

// Default page
router.get('/', pageView);

module.exports = router;