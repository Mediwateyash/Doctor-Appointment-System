const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// Get all doctors
router.get('/', async (req, res) => {
    try {
        const doctors = await Doctor.find().populate('userId', 'name email');
        res.json(doctors);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get single doctor
router.get('/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).populate('userId', 'name email');
        if (!doctor) {
            return res.status(404).json({ msg: 'Doctor not found' });
        }
        res.json(doctor);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
