const express = require('express');
const protectRoute = require('../middleware/protectRoute');
const getUsersForSideBar = require('../controllers/user.controller');
const isAuthenticated = require('../middleware/isAuthenticated');
const router = express.Router();

router.get('/', isAuthenticated, protectRoute, getUsersForSideBar);
module.exports = router;