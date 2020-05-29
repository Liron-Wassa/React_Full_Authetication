const joi = require('@hapi/joi');

const registerSchemaValidation = joi.object({
    email: joi.string().required().min(6).max(200),
    password: joi.string().min(6)
});

const emailResetSchemaValidation = joi.object({
    email: joi.string().required().min(6).max(200),
});

const passwordResetSchemaValidation = joi.object({
    password: joi.string().min(6)
});

const authValidate = (data) => {
    return registerSchemaValidation.validate(data);
};

const resetValidate = (data, type) => {
    if (type === 'EMAIL') return emailResetSchemaValidation.validate(data);
    else if (type === 'PASSWORD') return passwordResetSchemaValidation.validate(data);
};

module.exports.authValidate = authValidate;
module.exports.resetValidate = resetValidate;