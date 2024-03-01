const express = require('express');
const router = express.Router();
const { login, signup } = require('../controllers/auth.controller');
// Require controller modules.
router.post('/signup', signup)

router.get('/login', login)

module.exports = router;