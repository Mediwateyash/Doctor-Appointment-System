import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

export const AuthContext = createContext();

export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for token
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            // Note: Update Base URL as needed
            const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
            setUser(res.data.user);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            return { success: true, user: res.data.user };
        } catch (error) {
            console.error(error);
            return { success: false, message: error.response?.data?.msg || 'Login failed' };
        }
    };

    const register = async (userData) => {
        try {
            await axios.post(`${API_URL}/api/auth/register`, userData);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.msg || 'Registration failed' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
