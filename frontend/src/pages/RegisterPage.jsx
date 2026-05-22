import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'patient',
        specialization: '', experience: '', feesPerConsultation: '', phone: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await register(formData);
        if (res.success) {
            navigate('/login');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '500px', margin: '2rem auto' }}>
            <div className="card">
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>Create Account</h2>
                {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div style={{ margin: '10px 0' }}>
                        <label>Role</label>
                        <select name="role" value={formData.role} onChange={handleChange} style={{ width: '100%', padding: '10px' }}>
                            <option value="patient">Patient</option>
                            <option value="doctor">Doctor</option>
                        </select>
                    </div>
                    <div style={{ margin: '10px 0' }}>
                        <input name="name" placeholder="Full Name" onChange={handleChange} required style={{ width: '100%', padding: '10px' }} />
                    </div>
                    <div style={{ margin: '10px 0' }}>
                        <input name="email" type="email" placeholder="Email" onChange={handleChange} required style={{ width: '100%', padding: '10px' }} />
                    </div>
                    <div style={{ margin: '10px 0' }}>
                        <input name="password" type="password" placeholder="Password" onChange={handleChange} required style={{ width: '100%', padding: '10px' }} />
                    </div>

                    {formData.role === 'doctor' && (
                        <>
                            <div style={{ margin: '10px 0' }}>
                                <input name="specialization" placeholder="Specialization (e.g. Cardiologist)" onChange={handleChange} required style={{ width: '100%', padding: '10px' }} />
                            </div>
                            <div style={{ margin: '10px 0' }}>
                                <input name="experience" type="number" placeholder="Experience (Years)" onChange={handleChange} required style={{ width: '100%', padding: '10px' }} />
                            </div>
                            <div style={{ margin: '10px 0' }}>
                                <input name="feesPerConsultation" type="number" placeholder="Fees (₹)" onChange={handleChange} required style={{ width: '100%', padding: '10px' }} />
                            </div>
                            <div style={{ margin: '10px 0' }}>
                                <input name="phone" placeholder="Contact Number" onChange={handleChange} required style={{ width: '100%', padding: '10px' }} />
                            </div>
                        </>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Register</button>
                    <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
