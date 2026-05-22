import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{ background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '1rem 0' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                    Doctor<span style={{ color: 'var(--secondary)' }}>Connect</span>
                </Link>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <Link to="/" style={{ fontWeight: '500' }}>Home</Link>
                    <Link to="/#doctors" style={{ fontWeight: '500' }}>Doctors</Link>
                    {user ? (
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Hello, {user.name}</span>
                            <Link to="/profile" style={{ textDecoration: 'none', color: '#333' }}>Profile</Link>
                            <Link to={user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard'} style={{ textDecoration: 'none', color: '#333' }}>
                                {user.role === 'doctor' ? 'Manage Slots' : 'My Appointments'}
                            </Link>
                            <button onClick={logout} className="btn-outline" style={{ padding: '5px 10px', fontSize: '0.9rem' }}>Logout</button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" style={{ fontWeight: '500' }}>Login</Link>
                            <Link to="/register" className="btn btn-primary">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav >
    );
};

export default Navbar;
