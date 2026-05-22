const express = require('express');
const router = express.Router();
const Slot = require('../models/Slot');
const Doctor = require('../models/Doctor');

// Generate Slots
// Body: { doctorId, date, startTime, endTime, duration }
// Example: startTime: "10:00", endTime: "17:00", duration: 30
router.post('/generate', async (req, res) => {
    try {
        const { doctorId, date, startTime, endTime, duration } = req.body;

        // Function to convert time string to Minutes
        const parseTime = (t) => {
            const [h, m] = t.split(':').map(Number);
            return h * 60 + m;
        };

        // Function to convert minutes back to Time String
        const formatTime = (m) => {
            const h = Math.floor(m / 60);
            const min = m % 60;
            const ampm = h >= 12 ? 'PM' : 'AM';
            const fH = h % 12 || 12;
            const fMin = min < 10 ? '0' + min : min;
            return `${fH}:${fMin} ${ampm}`;
        };

        const startMin = parseTime(startTime);
        const endMin = parseTime(endTime);
        const slots = [];

        for (let time = startMin; time < endMin; time += duration) {
            const timeString = formatTime(time);
            // Check if slot already exists
            const existing = await Slot.findOne({ doctorId, date, time: timeString });
            if (!existing) {
                slots.push({
                    doctorId,
                    date,
                    time: timeString,
                    isBooked: false
                });
            }
        }

        if (slots.length > 0) {
            await Slot.insertMany(slots);
        }

        res.json({ msg: `Generated ${slots.length} slots`, slots });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get Available Slots for a Doctor on a Date
router.get('/:doctorId/:date', async (req, res) => {
    try {
        const slots = await Slot.find({
            doctorId: req.params.doctorId,
            date: req.params.date
            // Removed isBooked: false to return ALL slots for coloring
        });
        res.json(slots);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
