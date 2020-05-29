const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) return status(401).json({
            message: 'Access Denied'
        });
        const decoded = jwt.verify(token, process.env.MY_SECRET);
        req.userData = decoded;
        next();
    } catch(error) {
        return res.status(401).json({
            message: 'You need to be logged in'
        });
    }
};

module.exports = checkAuth;