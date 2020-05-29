const mongoose = require('mongoose');

const activeRequestSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    confirm: { type: Boolean, default: false }
});

const ActiveRequest = mongoose.model('ActiveRequest', activeRequestSchema);

module.exports = ActiveRequest;