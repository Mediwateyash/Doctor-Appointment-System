import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import { AuthContext } from '../context/AuthContext';
import { Calendar as CalendarIcon, Clock, ChevronRight, User, Hash } from 'lucide-react';

const BookingPage = () => {
    const { doctorId } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [doctor, setDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);

    const [formData, setFormData] = useState({
        patientName: user?.name || '',
        patientAge: '',
        problem: ''
    });

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/doctors/${doctorId}`);
                setDoctor(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchDoctor();
    }, [doctorId]);

    useEffect(() => {
        const fetchSlots = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_URL}/api/slots/${doctorId}/${selectedDate}`);
                setSlots(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        if (selectedDate) fetchSlots();
    }, [doctorId, selectedDate]);

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!selectedSlot) return alert('Please select a time slot');

        setBookingLoading(true);
        try {
            await axios.post(`${API_URL}/api/appointments`, {
                userId: user?._id,
                doctorId,
                ...formData,
                date: selectedDate,
                timeSlot: selectedSlot
            });
            navigate('/appointment-success');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || 'Booking failed');
        } finally {
            setBookingLoading(false);
        }
    };

    if (!doctor) return <div className="container" style={{ padding: '5rem', textAlign: 'center' }}>Loading doctor details...</div>;

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px', alignItems: 'start' }}>
                
                {/* Left Side: Doctor Info */}
                <div className="card" style={{ position: 'sticky', top: '20px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ 
                            width: '100px', 
                            height: '100px', 
                            background: '#e3f2fd', 
                            borderRadius: '50%', 
                            margin: '0 auto 1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem'
                        }}>👨‍⚕️</div>
                        <h2 style={{ color: 'var(--primary)' }}>Dr. {doctor.userId?.name}</h2>
                        <p style={{ fontWeight: '600', color: '#666' }}>{doctor.specialization}</p>
                    </div>

                    <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ color: '#777' }}>Experience</span>
                            <span style={{ fontWeight: '500' }}>{doctor.experience} Years</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ color: '#777' }}>Consultation Fee</span>
                            <span style={{ fontWeight: '500', color: 'var(--secondary)' }}>₹{doctor.feesPerConsultation}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#777' }}>Phone</span>
                            <span style={{ fontWeight: '500' }}>{doctor.phone}</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Booking Form */}
                <div>
                    <div className="card" style={{ marginBottom: '20px' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                            <CalendarIcon size={20} color="var(--primary)" /> 
                            Select Appointment Date
                        </h3>
                        <input 
                            type="date" 
                            className="form-control"
                            min={new Date().toISOString().split('T')[0]}
                            value={selectedDate}
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                                setSelectedSlot('');
                            }}
                            style={{ width: '100%', maxWidth: '300px' }}
                        />
                    </div>

                    <div className="card" style={{ marginBottom: '20px' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                            <Clock size={20} color="var(--primary)" /> 
                            Available Time Slots
                        </h3>
                        
                        {loading ? (
                            <p>Fetching slots...</p>
                        ) : slots.length === 0 ? (
                            <div style={{ padding: '20px', background: '#fff9f0', borderRadius: '8px', color: '#b45309' }}>
                                No slots generated for this date. Ask doctor to manage slots.
                            </div>
                        ) : (
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
                                gap: '12px' 
                            }}>
                                {slots.map(slot => (
                                    <button
                                        key={slot._id}
                                        onClick={() => !slot.isBooked && setSelectedSlot(slot.time)}
                                        disabled={slot.isBooked}
                                        style={{
                                            padding: '10px',
                                            borderRadius: '8px',
                                            border: '2px solid',
                                            borderColor: slot.isBooked ? '#eee' : (selectedSlot === slot.time ? 'var(--primary)' : '#e2e8f0'),
                                            background: slot.isBooked ? '#f1f5f9' : (selectedSlot === slot.time ? 'var(--primary)' : '#fff'),
                                            color: slot.isBooked ? '#94a3b8' : (selectedSlot === slot.time ? '#fff' : '#1e293b'),
                                            cursor: slot.isBooked ? 'not-allowed' : 'pointer',
                                            transition: 'all 0.2s ease',
                                            fontSize: '0.85rem',
                                            fontWeight: '600'
                                        }}
                                    >
                                        {slot.time}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="card">
                        <h3 style={{ marginBottom: '1.5rem' }}>Patient Details</h3>
                        <form onSubmit={handleBooking}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Full Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="form-control"
                                        placeholder="e.g. John Doe"
                                        value={formData.patientName}
                                        onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Age</label>
                                    <input 
                                        type="number" 
                                        required
                                        className="form-control"
                                        placeholder="e.g. 25"
                                        value={formData.patientAge}
                                        onChange={(e) => setFormData({...formData, patientAge: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Health Problem (Description)</label>
                                <textarea 
                                    className="form-control" 
                                    rows="3"
                                    required
                                    placeholder="Briefly describe your health concern..."
                                    value={formData.problem}
                                    onChange={(e) => setFormData({...formData, problem: e.target.value})}
                                ></textarea>
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={bookingLoading || !selectedSlot}
                                className="btn btn-primary" 
                                style={{ width: '100%', py: '15px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                            >
                                {bookingLoading ? 'Processing...' : (
                                    <>Confirm & Pay ₹{doctor.feesPerConsultation} <ChevronRight size={20} /></>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
