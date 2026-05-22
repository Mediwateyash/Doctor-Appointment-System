import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const AppointmentSuccess = () => {
    const location = useLocation();
    const { appointment } = location.state || {};

    if (!appointment) {
        return (
            <div className="container" style={{ textAlign: 'center', marginTop: '3rem' }}>
                <h2>No appointment details found.</h2>
                <Link to="/" className="btn btn-primary">Go Home</Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ maxWidth: '600px', margin: '3rem auto', textAlign: 'center' }}>
            <div className="card" style={{ padding: '2rem', borderTop: '5px solid var(--primary)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>Appointment Confirmed!</h2>

                <div style={{ textAlign: 'left', background: '#f8f9fa', padding: '1.5rem', borderRadius: '10px', marginBottom: '2rem' }}>
                    <h4 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Appointment Letter</h4>
                    <p><strong>Appointment ID:</strong> {appointment._id}</p>
                    <p><strong>Doctor:</strong> {appointment.doctorInfo?.name || 'Dr. Specialist'}</p>
                    <p><strong>Date:</strong> {appointment.date}</p>
                    <p><strong>Time:</strong> {appointment.timeSlot}</p>
                    <p><strong>Patient Name:</strong> {appointment.patientName}</p>
                    <p><strong>Status:</strong> <span style={{ color: 'green', fontWeight: 'bold' }}>Confirmed</span></p>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button className="btn btn-outline" onClick={() => window.print()}>Print Receipt</button>
                    <Link to="/profile" className="btn btn-primary">My Appointments</Link>
                </div>
            </div>
        </div>
    );
};

export default AppointmentSuccess;
