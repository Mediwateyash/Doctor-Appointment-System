import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import API_URL from '../config';

const DoctorDashboard = () => {
    const { user } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);
    const [slots, setSlots] = useState([]);
    // Slot Form State
    const [slotForm, setSlotForm] = useState({ date: '', startTime: '', endTime: '', duration: 30 });
    const [message, setMessage] = useState('');

    // Fetch Doctor's ID (which is in user usually, or we need to fetch doctor profile by user ID)
    // IMPORTANT: user._id is the User ID. The Doctor Model has userId matching this.
    // However, for appointments we need Doctor ID.
    // We should probably fetch the Doctor Profile first.
    const [doctorProfile, setDoctorProfile] = useState(null);

    useEffect(() => {
        // Fetch Doctor Profile using the logged in User ID
        // Since we didn't make a specific endpoint for "me", we can filter or specific endpoint.
        // Let's assume we can find it. Or we can store doctorId in local storage on login if we modified auth.
        // For now, let's fetch all doctors and filter (inefficient but works for small app) or update backend.
        // BETTER: Update Auth to return doctorId if role is doctor.
        // Workaround: We'll assume the user object includes what we need or we fetch it.
        const fetchDoctor = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/doctors`);
                const myProfile = res.data.find(d => d.userId._id === user._id);
                setDoctorProfile(myProfile);
                if (myProfile) {
                    fetchAppointments(myProfile._id);
                    // fetchSlots(myProfile._id);
                }
            } catch (err) {
                console.error(err);
            }
        };
        if (user) fetchDoctor();
    }, [user]);

    const fetchAppointments = async (id) => {
        try {
            if (id) {
                const res = await axios.get(`${API_URL}/api/appointments/doctor-appointments/${id}`);
                setAppointments(res.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleGenerateSlots = async (e) => {
        e.preventDefault();
        if (!doctorProfile) return;
        try {
            await axios.post(`${API_URL}/api/slots/generate`, {
                doctorId: doctorProfile._id,
                ...slotForm
            });
            setMessage('Slots generated successfully!');
        } catch (err) {
            setMessage('Error generating slots');
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <h2>Doctor Dashboard</h2>
            <p>Welcome, Dr. {user.name}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '20px' }}>

                {/* Booked Appointments */}
                <div>
                    <h3>Appointments</h3>
                    {appointments.length === 0 ? <p>No appointments yet.</p> : (
                        <div style={{ display: 'grid', gap: '15px' }}>
                            {appointments.map(app => (
                                <div key={app._id} className="card">
                                    <h4>{app.patientName}</h4>
                                    <p><strong>Age:</strong> {app.patientAge}</p>
                                    <p><strong>Problem:</strong> {app.problem}</p>
                                    <p><strong>Date:</strong> {app.date} at {app.timeSlot}</p>
                                    <span style={{
                                        padding: '5px 10px', borderRadius: '15px',
                                        background: app.status === 'confirmed' ? 'var(--secondary)' : '#ccc',
                                        color: 'white', fontSize: '0.8rem'
                                    }}>
                                        {app.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Manage Slots */}
                <div>
                    <h3>Manage Slots</h3>
                    <div className="card">
                        <h4>Add Availability</h4>
                        {message && <p style={{ color: 'green' }}>{message}</p>}
                        <form onSubmit={handleGenerateSlots}>
                            <div style={{ margin: '10px 0' }}>
                                <label>Date</label>
                                <input
                                    type="date"
                                    value={slotForm.date}
                                    onChange={e => setSlotForm({ ...slotForm, date: e.target.value })}
                                    style={{ width: '100%', padding: '8px' }}
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div style={{ flex: 1 }}>
                                    <label>Start Time</label>
                                    <input
                                        type="time"
                                        value={slotForm.startTime}
                                        onChange={e => setSlotForm({ ...slotForm, startTime: e.target.value })}
                                        style={{ width: '100%', padding: '8px' }}
                                        required
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label>End Time</label>
                                    <input
                                        type="time"
                                        value={slotForm.endTime}
                                        onChange={e => setSlotForm({ ...slotForm, endTime: e.target.value })}
                                        style={{ width: '100%', padding: '8px' }}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ marginTop: '15px', width: '100%' }}>
                                Generate Slots
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
