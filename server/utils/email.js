const ResetRequest = require('../module/password');
const ActiveRequest = require('../module/active');
const nodemailer = require('nodemailer');
const User = require('../module/user');
const jwt = require('jsonwebtoken');

const checkConfirmationTimeout = (req, res, email, time) => {
    setTimeout(() => {
        User.findOne({email: email}, (error, foundUser) => {
            if (error) return handleError(req, res, error);
            if (!foundUser.confirm) {
                User.deleteOne({email: email}, (error, deletedUser) => {
                    if (error) return handleError(req, res, error);
                    return;
                });
            };
        });
        ActiveRequest.deleteOne({email: email}, (error, deletedRequest) => {
            if (error) return handleError(req, res, error);
            return;
        });
    }, time * 1000 - new Date().getTime());
};

const checkResetRequestTimeout = (req, res, email, time) => {
    setTimeout(() => {
        User.findOne({email: email}, (error, foundUser) => {
            if (error) return handleError(req, res, error);
            if (!foundUser.confirm) {
                User.deleteOne({email: email}, (error, deletedUser) => {
                    if (error) return handleError(req, res, error);
                    return;
                });
            };
        });
        ResetRequest.deleteOne({email: email}, (error, deletedRequest) => {
            if (error) return handleError(req, res, error);
            return;
        });
    }, time * 1000 - new Date().getTime());
};

const sendResetEmail = (req, res, email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MY_EMAIL,
            pass: process.env.MY_PASSWORD
        }
    });
    const mailOption = {
        from: process.env.MY_EMAIL,
        to: email,
        subject: 'Reset password',
        text: `This link will be active 10 minutes.
        To reset your password click on this link: http://localhost:3000/reset/${token}`
    };
    transporter.sendMail(mailOption, (error, info) => {
        if (error) return handleError(req, res, error);
        const decodedToken = jwt.decode(token);
        const time = decodedToken.exp;
        checkResetRequestTimeout(req, res, email, time);
        return res.status(201).json({
            message: 'Email was sent'
        });
    });
};

const sendConfirmEmail = (req, res, email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MY_EMAIL,
            pass: process.env.MY_PASSWORD
        }
    });
    const mailOption = {
        from: process.env.MY_EMAIL,
        to: email,
        subject: 'Confirm account',
        text: `This link will be active 10 minutes.
        Click to confirm your account: http://localhost:3000/confirm/${token}`
    };

    transporter.sendMail(mailOption, (error, info) => {        
        if (error) return handleError(req, res, error);
        const decodedToken = jwt.decode(token);
        const time = decodedToken.exp;
        checkConfirmationTimeout(req, res, email, time);
        return res.status(201).json({
            message: 'Check your email'
        });
    });
};

module.exports.sendConfirmEmail = sendConfirmEmail;
module.exports.sendResetEmail = sendResetEmail;