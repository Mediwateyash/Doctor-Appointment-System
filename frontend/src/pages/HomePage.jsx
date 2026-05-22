import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';
import API_URL from '../config';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
    const { user } = useContext(AuthContext);
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/doctors`);
                setDoctors(res.data.slice(0, 6)); // Show top 6 for a full grid 
            } catch (err) {
                console.error(err);
            }
        };
        fetchDoctors();
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
                padding: '4rem 0',
                borderRadius: '20px',
                marginBottom: '3rem',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                        Doctor Connect
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                        Your seamless connection to healthcare excellence. Book appointments with top doctors instantly.
                    </p>
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        {user ? (
                            <Link to={user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard'} className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '12px 30px' }}>
                                {user.role === 'doctor' ? 'Manage Slots' : 'Book Appointment'}
                            </Link>
                        ) : (
                            <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '12px 30px' }}>
                                Book Appointment
                            </Link>
                        )}
                        <a href="#doctors" className="btn btn-outline" style={{ fontSize: '1.1rem', padding: '12px 30px' }}>
                            View Doctors
                        </a>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="container" style={{ marginBottom: '4rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--dark)' }}>Why Choose Us?</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--secondary)' }}>👨‍⚕️</div>
                        <h3>Expert Doctors</h3>
                        <p style={{ color: '#777' }}>Highly qualified and experienced professionals.</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--primary)' }}>📅</div>
                        <h3>Easy Booking</h3>
                        <p style={{ color: '#777' }}>Book your slot in just 2 minutes.</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--secondary)' }}>🛡️</div>
                        <h3>Secure Data</h3>
                        <p style={{ color: '#777' }}>Your medical history is safe with us.</p>
                    </div>
                </div>
            </section>

            {/* Doctors Preview */}
            <section id="doctors" className="container" style={{ marginBottom: '4rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--dark)' }}>Meet Our Specialists</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
                    {doctors.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#777', gridColumn: '1/-1' }}>
                            Loading top doctors...
                        </div>
                    ) : (
                        doctors.map(doc => (
                            <div key={doc._id} className="card" style={{ textAlign: 'center' }}>
                                <h3 style={{ color: 'var(--primary)' }}>Dr. {doc.userId?.name}</h3>
                                <p style={{ fontWeight: 'bold' }}>{doc.specialization}</p>
                                <p>{doc.experience} Years Exp.</p>
                                <p style={{ color: 'var(--secondary)' }}>Fees: ₹{doc.feesPerConsultation}</p>
                                <div style={{ marginTop: '1.5rem' }}>
                                    <Link to={`/book/${doc._id}`} className="btn btn-outline" style={{ width: '100%', padding: '8px' }}>
                                        Book Now
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
