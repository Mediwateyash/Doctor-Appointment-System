import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API_URL from '../config';
import axios from 'axios';

const ProfilePage = () => {
    const { user } = useContext(AuthContext);
    const [doctorAppointments, setDoctorAppointments] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchAppointments();
            if (user.role === 'doctor') {
                fetchDoctorAppointments();
            }
        }
    }, [user]);

    const fetchAppointments = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/appointments/my-appointments/${user._id}`);
            setAppointments(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const fetchDoctorAppointments = async () => {
        try {
            // First get doctor ID
            const docRes = await axios.get(`${API_URL}/api/doctors`);
            if (Array.isArray(docRes.data)) {
                const myProfile = docRes.data.find(d => {
                    if (!d.userId) return false;
                    const dbUserId = d.userId._id || d.userId; // Handle populated or raw ID
                    return dbUserId === user._id;
                });

                if (myProfile) {
                    const res = await axios.get(`${API_URL}/api/appointments/doctor-appointments/${myProfile._id}`);
                    setDoctorAppointments(Array.isArray(res.data) ? res.data : []);
                }
            }
        } catch (err) {
            console.error("Error fetching doctor appointments:", err);
            setDoctorAppointments([]);
        }
    };

    if (!user) return <div className="container">Please login to view profile.</div>;

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>

                {/* Profile Card */}
                <div style={{ flex: '1', minWidth: '300px' }}>
                    <div className="card">
                        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                            <div style={{ width: '80px', height: '80px', background: '#e3f2fd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: '2rem' }}>
                                👤
                            </div>
                        </div>
                        <h3 style={{ textAlign: 'center' }}>{user.name}</h3>
                        <p style={{ textAlign: 'center', color: '#666' }}>{user.email}</p>
                        <hr />
                        <p><strong>Role:</strong> {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
                    </div>
                </div>

                {/* Appointments History */}
                <div style={{ flex: '2', minWidth: '300px' }}>

                    {/* Patient Appointments */}
                    <h3>My Bookings (As Patient)</h3>
                    {loading ? (
                        <p>Loading...</p>
                    ) : appointments.length === 0 ? (
                        <div className="card">No bookings found.</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {appointments.map(apt => (
                                <div key={apt._id} className="card" style={{ borderLeft: '5px solid var(--secondary)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                        <div>
                                            <h4>{apt.doctorInfo?.name || 'Doctor'}</h4>
                                            <p style={{ color: '#666' }}>{apt.doctorInfo?.specialization}</p>
                                            <p><strong>Patient:</strong> {apt.patientName}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                                {apt.date}
                                            </div>
                                            <div style={{ color: '#666' }}>{apt.timeSlot}</div>
                                            <div style={{
                                                marginTop: '5px',
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                background: '#d4edda',
                                                color: '#155724',
                                                display: 'inline-block',
                                                fontSize: '0.9rem'
                                            }}>
                                                {apt.status}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Doctor Appointments (if doctor) */}
                    {user.role === 'doctor' && (
                        <div style={{ marginTop: '30px' }}>
                            <h3>My Patient Appointments (As Doctor)</h3>
                            {(!doctorAppointments || doctorAppointments.length === 0) ? (
                                <div className="card">No appointments scheduled for you.</div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {doctorAppointments.map(apt => (
                                        <div key={apt._id} className="card" style={{ borderLeft: '5px solid var(--primary)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                <div>
                                                    <h4>Patient: {apt.patientName || 'Unknown'}</h4>
                                                    <p><strong>Age:</strong> {apt.patientAge || 'N/A'}</p>
                                                    <p><strong>Problem:</strong> {apt.problem || 'None'}</p>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                                        {apt.date}
                                                    </div>
                                                    <div style={{ color: '#666' }}>{apt.timeSlot}</div>
                                                    <span style={{
                                                        marginTop: '5px',
                                                        padding: '2px 8px',
                                                        borderRadius: '4px',
                                                        background: apt.status === 'confirmed' ? 'var(--secondary)' : '#ccc',
                                                        color: 'white',
                                                        display: 'inline-block',
                                                        fontSize: '0.9rem'
                                                    }}>
                                                        {apt.status || 'Pending'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
