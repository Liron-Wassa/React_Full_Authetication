const jwt = require('jsonwebtoken');

const checkConfirm = (req, res, next) => {
    try {
        const token = req.params.token;        
        if (!token) return res.status(400).json({
            message: 'Confirmed faild'
        });
        const decoded = jwt.verify(token, process.env.MY_SECRET);
        req.confirmData = decoded;
        next();
    }
    catch {
        return res.status(400).json({
            message: 'Link not available'
        });
    }
};

module.exports = checkConfirm;