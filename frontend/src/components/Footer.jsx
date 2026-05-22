import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    // GitHub SVG Icon
    const GithubIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
    );

    // LinkedIn SVG Icon
    const LinkedinIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect width="4" height="12" x="2" y="9" />
            <circle cx="4" cy="4" r="2" />
        </svg>
    );

    return (
        <footer style={{
            background: '#1a1a1a',
            color: '#f8f9fa',
            padding: '3rem 0 1.5rem',
            marginTop: 'auto',
            borderTop: '1px solid #333'
        }}>
            <div className="container">
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.5rem',
                    textAlign: 'center'
                }}>
                    {/* Branding */}
                    <div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                            Doctor<span style={{ color: '#3b82f6' }}>Connect</span>
                        </h2>
                        <p style={{ color: '#9ca3af', fontSize: '0.95rem' }}>Your seamless connection to healthcare excellence.</p>
                    </div>

                    {/* Developer Credit */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '1rem',
                        background: 'rgba(255,255,255,0.05)',
                        padding: '8px 20px',
                        borderRadius: '30px',
                        color: '#e5e7eb'
                    }}>
                        Design and Developed by
                        <span style={{ fontWeight: '600', color: '#fff' }}>Diwate yash</span>
                    </div>

                    {/* Social Links */}
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <a
                            href="https://github.com/Mediwateyash"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: '#9ca3af',
                                transition: 'color 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
                            onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
                            title="GitHub Profile"
                        >
                            <GithubIcon />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/diwateyash2004/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: '#9ca3af',
                                transition: 'color 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.color = '#0077b5'}
                            onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
                            title="LinkedIn Profile"
                        >
                            <LinkedinIcon />
                        </a>
                    </div>

                    {/* Copyright */}
                    <div style={{
                        marginTop: '1rem',
                        paddingTop: '1.5rem',
                        borderTop: '1px solid #333',
                        width: '100%',
                        fontSize: '0.85rem',
                        color: '#6b7280'
                    }}>
                        &copy; {currentYear} Doctor Connect. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
