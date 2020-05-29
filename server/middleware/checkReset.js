const jwt = require('jsonwebtoken');

const checkReset = (req, res, next) => {
    try {
        const token = req.params.token;
        if (!token) return res.status(400).json({
            message: 'Reset faild'
        });
        const decoded = jwt.verify(token, process.env.MY_SECRET);
        req.resetData = decoded;
        next();
    }
    catch {
        return res.status(400).json({
            message: 'Link no available'
        });
    }
};

module.exports = checkReset;