const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor', // or User if doctor is just a role, but linking to Doctor profile is better
        required: true
    },
    doctorInfo: {
        type: mongoose.Schema.Types.Mixed // Optional: Snapshot of doctor details
    },
    patientName: {
        type: String,
        required: true
    },
    patientAge: {
        type: Number,
        required: true
    },
    date: {
        type: String, // YYYY-MM-DD
        required: true
    },
    timeSlot: {
        type: String, // "10:00 - 10:30"
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    problem: {
        type: String
    }
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
