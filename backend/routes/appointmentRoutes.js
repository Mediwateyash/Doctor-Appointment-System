const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// Admin Stats
router.get('/admin/stats', async (req, res) => {
    try {
        const totalAppointments = await Appointment.countDocuments();
        const totalDoctors = await Doctor.countDocuments();
        const totalPatients = await User.countDocuments({ role: 'patient' });
        
        res.json({
            appointments: totalAppointments,
            doctors: totalDoctors,
            patients: totalPatients
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
router.post('/', async (req, res) => {
    try {
        const { userId, doctorId, patientName, patientAge, date, timeSlot, problem } = req.body;

        // Check availability
        const Slot = require('../models/Slot');
        const slot = await Slot.findOne({ doctorId, date, time: timeSlot });

        if (slot) {
            if (slot.isBooked) {
                return res.status(400).json({ msg: 'Slot already booked' });
            }
            // Mark slot as booked
            slot.isBooked = true;
            await slot.save();
        } else {
            // If slot document doesn't exist (legacy/manual), we might want to fail or proceed.
            // For this system, let's assume if it doesn't exist in generated slots, we can't book it,
            // OR we create it on the fly? Better to enforce it exists if we used the generator.
            // But for robustness if user manually inputs:
            const newSlot = new Slot({
                doctorId,
                date,
                time: timeSlot,
                isBooked: true
            });
            await newSlot.save();
        }

        const doctor = await Doctor.findById(doctorId).populate('userId', 'name');

        const newAppointment = new Appointment({
            userId,
            doctorId,
            doctorInfo: {
                name: doctor.userId.name,
                specialization: doctor.specialization
            },
            patientName,
            patientAge,
            date,
            timeSlot,
            problem,
            status: 'confirmed' // Auto confirm for simulation as per req "Button: Pay & Confirm -> Appointment status becomes confirmed"
        });

        const appointment = await newAppointment.save();
        res.json(appointment);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get User Appointments
router.get('/my-appointments/:userId', async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.params.userId }).sort({ date: -1 });
        res.json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get Doctor Appointments
router.get('/doctor-appointments/:doctorId', async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctorId: req.params.doctorId }).sort({ date: -1 });
        res.json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
