const { sendResetEmail, sendConfirmEmail } = require('../utils/email');
const { authValidate, resetValidate } = require('../validation/auth');
const checkConfirm = require('../middleware/checkConfirm');
const { handleError } = require('../utils/handleError');
const checkReset = require('../middleware/checkReset');
const ResetRequest = require('../module/password');
const ActiveRequest = require('../module/active');
const User = require('../module/user');
const uuid = require('uuid-random');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.post('/register', (req, res) => {
    const { email, password } = req.body;
    const { error } = authValidate(req.body);    
    if (error) return res.status(400).json({
        message: error.details[0].message
    });

    User.findOne({email: email}, (error, foundUser) => {
        if (error) return handleError(req, res, error);

        if (foundUser) return res.status(409).json({
            message: 'Email exist'
        });

        bcrypt.hash(password, 10, (error, hash) => {
            if (error) return handleError(req, res, error);

            const user = new User({
                email: email,
                password: hash
            });
            user.save();

            const id = uuid();
            const activeRequest = {
                id: id,
                email: email
            };
            ActiveRequest.create(activeRequest, (error, createdRequest) => {
                if (error) return handleError(req, res, error);
                const token = jwt.sign({requestId: id}, process.env.MY_SECRET, {
                    expiresIn: "10m"
                });
                return sendConfirmEmail(req, res, email, token);
            });
        });
    });
});

router.post('/confirm/:token', checkConfirm, (req, res) => {
    ActiveRequest.findOne({id: req.confirmData.requestId}, (error, activeRequest) => {
        if (error) return handleError(req, res, error);
        if (!activeRequest) return res.status(404).json({
            message: 'Confirmed faild'
        });

        User.findOne({email: activeRequest.email}, (error, foundUser) => {
            if (error) return handleError(req, res, error);
            if (!foundUser) return res.status(404).json({
                message: 'Confirmed faild'
            });            
            if (foundUser.confirm) return res.status(409).json({
                message: 'Your account already confirmed'
            });
            foundUser.confirm = true;
            foundUser.save();
            res.status(201).json({
                message: 'Your account confirmed'
            });
        });
    });
});

router.post('/login', (req, res) => {
    
    const { email, password } = req.body;
    const { error } = authValidate(req.body);

    if (error) return res.status(401).json({
        message: 'Email or password worng'
    });
    
    User.findOne({email: email}, (error, foundUser) => {
        if (error) return handleError(req, res, error);
        
        if (!foundUser) return res.status(401).json({
            message: 'Email or password worng'
        });
        
        if (!foundUser.confirm) return res.status(401).json({
            message: 'You need to confirm your account'
        });

        bcrypt.compare(password, foundUser.password, (error, isEqule) => {
            if (error) return handleError(req, res, error);
            
            const token = jwt.sign({userId: foundUser._id}, process.env.MY_SECRET, {
                expiresIn: "1h"
            });
            const decodedToken = jwt.decode(token);            
            if (isEqule) return res.status(201).json({
                token: token,
                expiresIn: decodedToken.exp
            });
            
            res.status(401).json({
                message: 'Email or password worng'
            });
        });
    });
});

router.post('/forgot', (req, res) => {
    const { email } = req.body;    
    const { error } = resetValidate(req.body, 'EMAIL');

    if (error) return res.status(400).json({
        message: error.details[0].message
    });
    
    User.findOne({email: email}, (error, foundUser) => {
        if (error) return handleError(req, res, error);

        if (!foundUser) return res.status(404).json({
            message: 'Email not found'
        });
        
        if (!foundUser.confirm) return res.status(400).json({
            message: 'You need to confirm your account'
        });

        const id = uuid();
        const resetRequest = {
            id: id,
            email: foundUser.email
        };

        ResetRequest.create(resetRequest, (error, createdRequest) => {            
            if (error) return handleError(req, res, error);

            const token = jwt.sign({requestId: id}, process.env.MY_SECRET, {
                expiresIn: "10m"
            });
            return sendResetEmail(req, res, email, token);
        });
    });
});

router.patch('/reset/:token', checkReset, (req, res) => {
    const { password } = req.body;
    const { error } = resetValidate(req.body, 'PASSWORD');

    if (error) return res.status(400).json({
        message: error.details[0].message
    });
    
    ResetRequest.findOne({id: req.resetData.requestId}, (error, userRequest) => {
        if (error) return handleError(req, res, error);
        if (!userRequest) return res.status(404).json({
            message: 'Request faild'
        });

        User.findOne({email: userRequest.email}, (error, foundUser) => {
            if (!foundUser) return res.status(404).json({
                message: 'Request faild'
            });            
            if (userRequest.confirm) return res.status(409).json({
                message: 'Your password already reset'
            });
            bcrypt.hash(password, 10, (error, hash) => {
                if (error) return handleError(req, res, error);
                foundUser.password = hash;
                userRequest.confirm = true;
                foundUser.save();
                userRequest.save();
                res.status(201).json({
                    message: 'Your password was reset'
                });
            });
        });
    });
});

module.exports = router;