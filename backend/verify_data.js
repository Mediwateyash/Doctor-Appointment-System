const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/doctor_appointment')
    .then(async () => {
        const users = await User.find({}, '_id name role email');
        const doctors = await Doctor.find({}, '_id userId specialization');
        const appointments = await Appointment.find({}, '_id doctorId userId patientName date');

        const output = JSON.stringify({ users, doctors, appointments }, null, 2);
        fs.writeFileSync('verify_output.json', output);
        console.log('Data written to verify_output.json');

        mongoose.connection.close();
    })
    .catch(err => console.error(err));
