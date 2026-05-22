import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import './ChatBot.css'; // We'll create this file for styles
import API_URL from '../config';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (user && isOpen && messages.length === 0) {
            fetchHistory();
        }
    }, [user, isOpen]);

    const fetchHistory = async () => {
        try {
            if (!user?._id) return;
            const response = await fetch(`${API_URL}/api/chat/history/${user._id}`);
            const data = await response.json();
            if (data.success) {
                setMessages(data.data.map(msg => ([
                    { type: 'user', text: msg.message, timestamp: msg.timestamp },
                    { type: 'bot', text: msg.response, timestamp: msg.timestamp }
                ])).flat());
            }
        } catch (error) {
            console.error('Failed to load history', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { type: 'user', text: input, timestamp: new Date() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage.text,
                    userId: user?._id // Optional if guest
                }),
            });

            const data = await response.json();

            if (data.success) {
                const botMessage = { type: 'bot', text: data.response, timestamp: new Date() };
                setMessages(prev => [...prev, botMessage]);
            } else {
                setMessages(prev => [...prev, { type: 'bot', text: "Sorry, I encountered an error: " + (data.message || "Unknown error"), error: true }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { type: 'bot', text: "Sorry, I can't connect to the server right now.", error: true }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            {!isOpen && (
                <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
                    💬 Medical Assistant
                </button>
            )}

            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <h3>Healthcare Assistant</h3>
                        <button onClick={() => setIsOpen(false)}>✖</button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.length === 0 && <p className="chatbot-welcome">Hello! I can answer your health-related questions. How can I help you today?</p>}
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.type}`}>
                                <div className="message-content">{msg.text}</div>
                                <div className="message-time">
                                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                </div>                            </div>
                        ))}
                        {isLoading && <div className="message bot"><div className="typing-indicator">typing...</div></div>}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chatbot-input-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a health question..."
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !input.trim()}>➤</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
