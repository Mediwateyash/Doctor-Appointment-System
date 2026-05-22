import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AppointmentSuccess from './pages/AppointmentSuccess';
import ProfilePage from './pages/ProfilePage';
import BookingPage from './pages/BookingPage';
import ChatBot from './components/ChatBot';

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main style={{ minHeight: '80vh', padding: '20px 0' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
              <Route path="/patient-dashboard" element={<PatientDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/appointment-success" element={<AppointmentSuccess />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/book/:doctorId" element={<BookingPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
      <ChatBot />
    </AuthProvider>
  );
}

export default App;
