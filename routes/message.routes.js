const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/isAuthenticated')
const { sendMessage, getMessage } = require('../controllers/message.controller');
const protectRoute = require('../middleware/protectRoute');
router.post('/send/:id', isAuthenticated, protectRoute, sendMessage);
router.get('/:id', isAuthenticated, protectRoute, getMessage);
module.exports = router;