const checkAuth = require('../middleware/checkAuth');
const express = require('express');
const router = express.Router();

router.get('/profile', checkAuth, (req, res) => {
    res.status(200).json({
        message: 'This is my secret',
        image: "https://cdn.pixabay.com/photo/2020/01/07/13/36/sea-4747601__340.jpg"
    });
});

module.exports = router;