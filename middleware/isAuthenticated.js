const jwt = require('jsonwebtoken')
const isAuthenticated = async (req, res, next) => {
    if (!req.headers.authorization) res.status(401).json({ message: 'Please login to access conversations' });
    else {
        const token = req.headers.authorization.split(' ')[1];
        console.log(`token in isAuthenticated`, token);
        jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
            if (!err) {
                console.log(data);
                next();
            }
            else {
                res.status(403).json({ message: "Invalid Token" });
            }
        })
    }
}
module.exports = isAuthenticated;