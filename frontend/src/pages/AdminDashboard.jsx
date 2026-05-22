import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { Users, UserCheck, Calendar, TrendingUp, Trash2, Mail, Phone, Calendar as CalendarIcon } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ appointments: 0, doctors: 0, patients: 0 });
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [statsRes, doctorsRes, patientsRes] = await Promise.all([
                axios.get(`${API_URL}/api/appointments/admin/stats`),
                axios.get(`${API_URL}/api/doctors`),
                axios.get(`${API_URL}/api/auth/patients`)
            ]);
            setStats(statsRes.data);
            setDoctors(doctorsRes.data);
            setPatients(patientsRes.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId, name) => {
        if (window.confirm(`Are you sure you want to delete ${name}? This will remove all associated data and is IRREVERSIBLE.`)) {
            try {
                await axios.delete(`${API_URL}/api/auth/users/${userId}`);
                alert('User deleted successfully');
                fetchAllData(); // Refresh all lists
            } catch (err) {
                console.error(err);
                alert('Failed to delete user');
            }
        }
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', padding: '5rem' }}>Loading Admin Panel...</div>;

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="card" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '20px', 
            padding: '25px',
            borderLeft: `5px solid ${color}` 
        }}>
            <div style={{ 
                background: color + '20', 
                padding: '15px', 
                borderRadius: '12px',
                color: color 
            }}>
                <Icon size={28} />
            </div>
            <div>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '5px', fontWeight: '500' }}>{title}</p>
                <h3 style={{ fontSize: '1.8rem', margin: 0 }}>{value}</h3>
            </div>
        </div>
    );

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--dark)', marginBottom: '0.5rem' }}>Admin Dashboard</h1>
                <p style={{ color: '#666' }}>Welcome back! Manage your healthcare network here.</p>
            </div>

            {/* Tabs */}
            <div style={{ 
                display: 'flex', 
                gap: '10px', 
                marginBottom: '2rem',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '10px'
            }}>
                {['overview', 'doctors', 'patients'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '10px 25px',
                            borderRadius: '8px',
                            border: 'none',
                            background: activeTab === tab ? 'var(--primary)' : 'transparent',
                            color: activeTab === tab ? '#fff' : '#64748b',
                            fontWeight: '600',
                            textTransform: 'capitalize',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                    gap: '25px',
                    marginBottom: '3rem'
                }}>
                    <StatCard title="Total Doctors" value={stats.doctors} icon={UserCheck} color="#3b82f6" />
                    <StatCard title="Total Patients" value={stats.patients} icon={Users} color="#10b981" />
                    <StatCard title="Total Appointments" value={stats.appointments} icon={CalendarIcon} color="#f59e0b" />
                    <StatCard title="System Growth" value="+12%" icon={TrendingUp} color="#8b5cf6" />
                </div>
            )}

            {activeTab === 'doctors' && (
                <div className="card" style={{ overflowX: 'auto' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Doctors Management</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '0.9rem' }}>
                                <th style={{ padding: '15px' }}>Name</th>
                                <th style={{ padding: '15px' }}>Specialization</th>
                                <th style={{ padding: '15px' }}>Contact</th>
                                <th style={{ padding: '15px' }}>Fee</th>
                                <th style={{ padding: '15px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map(doc => (
                                <tr key={doc._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ fontWeight: '600' }}>Dr. {doc.userId?.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>ID: {doc._id}</div>
                                    </td>
                                    <td style={{ padding: '15px' }}>{doc.specialization}</td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem' }}>
                                            <Mail size={14} /> {doc.userId?.email}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', marginTop: '5px' }}>
                                            <Phone size={14} /> {doc.phone}
                                        </div>
                                    </td>
                                    <td style={{ padding: '15px', fontWeight: 'bold', color: 'var(--secondary)' }}>₹{doc.feesPerConsultation}</td>
                                    <td style={{ padding: '15px' }}>
                                        <button 
                                            onClick={() => handleDeleteUser(doc.userId?._id, doc.userId?.name)}
                                            style={{ 
                                                background: '#fee2e2', 
                                                color: '#ef4444', 
                                                border: 'none', 
                                                padding: '8px', 
                                                borderRadius: '6px',
                                                cursor: 'pointer'
                                            }}
                                            title="Delete Doctor"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'patients' && (
                <div className="card" style={{ overflowX: 'auto' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Patients Management</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '0.9rem' }}>
                                <th style={{ padding: '15px' }}>Name</th>
                                <th style={{ padding: '15px' }}>Email</th>
                                <th style={{ padding: '15px' }}>Join Date</th>
                                <th style={{ padding: '15px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map(pat => (
                                <tr key={pat._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '15px', fontWeight: '600' }}>{pat.name}</td>
                                    <td style={{ padding: '15px' }}>{pat.email}</td>
                                    <td style={{ padding: '15px', color: '#666' }}>{new Date().toLocaleDateString()}</td>
                                    <td style={{ padding: '15px' }}>
                                        <button 
                                            onClick={() => handleDeleteUser(pat._id, pat.name)}
                                            style={{ 
                                                background: '#fee2e2', 
                                                color: '#ef4444', 
                                                border: 'none', 
                                                padding: '8px', 
                                                borderRadius: '6px',
                                                cursor: 'pointer'
                                            }}
                                            title="Delete Patient"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
