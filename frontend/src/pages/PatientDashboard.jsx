import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PatientDashboard = () => {
    const { user } = useAuth();
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);

    // Booking Form
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingData, setBookingData] = useState({
        patientName: '',
        age: '',
        problem: '',
        slot: null // { time, date, etc }
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/doctors`);
            setDoctors(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSelectDoctor = async (doctor) => {
        setSelectedDoctor(doctor);
        // Fetch slots for today or let user pick date. For simplicity, fetching for a specific hardcoded or today's date?
        // Let's assume user picks a date.
        // For simulation, let's just fetch all unbooked slots for this doctor for next 7 days? 
        // Or simpler: User Selects Date.
    };

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if (selectedDoctor && selectedDate) {
            fetchSlots(selectedDoctor._id, selectedDate);
        }
    }, [selectedDoctor, selectedDate]);

    const fetchSlots = async (doctorId, date) => {
        try {
            const res = await axios.get(`${API_URL}/api/slots/${doctorId}/${date}`);
            setAvailableSlots(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const initiateBooking = (slot) => {
        setBookingData({ ...bookingData, slot });
        setShowBookingModal(true);
        // Pre-fill user data if booking for self
        if (user) {
            // Maybe default to self
        }
    };

    const navigate = useNavigate();

    const handleBook = async (e) => {
        e.preventDefault();
        try {
            // Payment Simulation
            // On click Pay & Confirm
            const appointmentPayload = {
                userId: user._id,
                doctorId: selectedDoctor._id,
                patientName: bookingData.patientName,
                patientAge: bookingData.age,
                date: bookingData.slot.date,
                timeSlot: bookingData.slot.time,
                problem: bookingData.problem
            };

            const res = await axios.post(`${API_URL}/api/appointments`, appointmentPayload);
            alert('Appointment Booked Successfully!');
            setMessage('Booking Confirmed! Receipt generated.');
            setShowBookingModal(false);

            // Redirect to success page with appointment details
            navigate('/appointment-success', { state: { appointment: res.data } });

        } catch (err) {
            console.error(err);
            setMessage('Booking Failed: ' + (err.response?.data?.msg || err.message));
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <h2>Patient Dashboard</h2>
            {message && <div style={{ padding: '10px', background: '#d4edda', color: '#155724' }}>{message}</div>}

            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                {/* Doctors List */}
                <div style={{ flex: 1 }}>
                    <h3>Find a Doctor</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                        {doctors.map(doc => (
                            <div key={doc._id} className="card" onClick={() => handleSelectDoctor(doc)} style={{ cursor: 'pointer', border: selectedDoctor?._id === doc._id ? '2px solid var(--primary)' : 'none' }}>
                                <h4>Dr. {doc.userId.name}</h4>
                                <p style={{ color: '#666' }}>{doc.specialization}</p>
                                <p>Exp: {doc.experience} years</p>
                                <p>Fees: ₹{doc.feesPerConsultation}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Slots Section */}
                <div style={{ flex: 1, padding: '20px', background: 'white', borderRadius: '10px' }}>
                    {selectedDoctor ? (
                        <>
                            <h3>Book Appointment with Dr. {selectedDoctor.userId.name}</h3>
                            <label>Select Date: </label>
                            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />

                            <div style={{ marginTop: '15px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {availableSlots.length === 0 ? <p>No slots generated for this date.</p> : availableSlots.map(slot => (
                                    <button
                                        key={slot._id}
                                        className={`btn ${slot.isBooked ? 'btn-danger' : 'btn-outline'}`}
                                        disabled={slot.isBooked}
                                        style={{
                                            backgroundColor: slot.isBooked ? '#ffebee' : 'transparent',
                                            borderColor: slot.isBooked ? '#ffcdd2' : 'var(--primary)',
                                            color: slot.isBooked ? '#c62828' : 'var(--primary)',
                                            cursor: slot.isBooked ? 'not-allowed' : 'pointer',
                                            opacity: slot.isBooked ? 0.7 : 1
                                        }}
                                        onClick={() => !slot.isBooked && initiateBooking(slot)}
                                    >
                                        {slot.time}
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p>Select a doctor to view availability</p>
                    )}
                </div>
            </div>

            {/* Booking Modal */}
            {showBookingModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="card" style={{ width: '400px', maxWidth: '90%' }}>
                        <h3>Confirm Booking</h3>
                        <p>Fee: ₹100</p> {/* Hardcoded simulation */}
                        <form onSubmit={handleBook}>
                            <div style={{ margin: '10px 0' }}>
                                <label>Patient Name</label>
                                <input
                                    value={bookingData.patientName}
                                    onChange={e => setBookingData({ ...bookingData, patientName: e.target.value })}
                                    style={{ width: '100%', padding: '8px' }}
                                    required
                                />
                            </div>
                            <div style={{ margin: '10px 0' }}>
                                <label>Age</label>
                                <input
                                    type="number"
                                    value={bookingData.age}
                                    onChange={e => setBookingData({ ...bookingData, age: e.target.value })}
                                    style={{ width: '100%', padding: '8px' }}
                                    required
                                />
                            </div>
                            <div style={{ margin: '10px 0' }}>
                                <label>Problem Description</label>
                                <textarea
                                    rows="3"
                                    value={bookingData.problem}
                                    onChange={e => setBookingData({ ...bookingData, problem: e.target.value })}
                                    style={{ width: '100%', padding: '8px' }}
                                ></textarea>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowBookingModal(false)} style={{ flex: 1 }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Pay & Confirm</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientDashboard;
