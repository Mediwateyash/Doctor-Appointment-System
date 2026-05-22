import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(formData.email, formData.password);
        if (res.success) {
            if (res.user.role === 'admin') navigate('/admin-dashboard');
            else if (res.user.role === 'doctor') navigate('/doctor-dashboard');
            else navigate('/patient-dashboard');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '400px', margin: '4rem auto' }}>
            <div className="card">
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>Login</h2>
                {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label>Password</label>
                        <input
                            type="password"
                            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
                    <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                        Don't have an account? <Link to="/register" style={{ color: 'var(--primary)' }}>Register</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
