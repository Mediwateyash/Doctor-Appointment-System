const mongoose = require('mongoose');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');
const Slot = require('./models/Slot');

const cleanup = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/doctor_connect');
        console.log('Connected to DB...');

        const namesToDelete = ['Yash Narayan Diwate', 'Nikhil Warke', 'Aryan'];
        
        for (const name of namesToDelete) {
            const users = await User.find({ name });
            for (const user of users) {
                const doc = await Doctor.findOne({ userId: user._id });
                if (doc) {
                    await Slot.deleteMany({ doctorId: doc._id });
                    await Appointment.deleteMany({ doctorId: doc._id });
                    await Doctor.deleteOne({ _id: doc._id });
                }
                await User.deleteOne({ _id: user._id });
                console.log(`Deleted: ${user.name} (${user.email})`);
            }
        }

        console.log('Cleanup completed!');
        mongoose.connection.close();
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

cleanup();
