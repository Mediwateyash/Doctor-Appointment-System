const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    date: {
        type: String, // YYYY-MM-DD
        required: true
    },
    time: {
        type: String, // "10:00 AM"
        required: true
    },
    isBooked: {
        type: Boolean,
        default: false
    }
});

const Slot = mongoose.model('Slot', slotSchema);
module.exports = Slot;
