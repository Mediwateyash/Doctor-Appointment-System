const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    feesPerConsultation: {
        type: Number,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    website: {
        type: String
    }
});

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
