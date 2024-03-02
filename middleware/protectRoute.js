const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) return res.status(401).json({ error: 'Unauthorized - No Token Provided' });
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedToken) return res.status(401).json({ error: 'Unauthorized - Invalid Token' });
        const user = await User.findById(decodedToken.userId).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        req.user = user;
        next();
    }
    catch (error) {
        console.log("Error in protectRoute Middleware", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
module.exports = protectRoute;