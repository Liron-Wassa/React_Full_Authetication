const mongoose = require('mongoose');

const resetRequestSchema = new mongoose.Schema({
    id: { type: String, required: true },
    email: { type: String, required: true },
    confirm: { type: Boolean, default: false }
});

const ResetRequest = mongoose.model('resetRequestSchema', resetRequestSchema);

module.exports = ResetRequest;