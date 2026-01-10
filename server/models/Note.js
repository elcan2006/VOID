const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        default: 'Untitled Note'
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    timestamp: {
        type: Number,
        default: Date.now
    },
    duration: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Note', noteSchema);
