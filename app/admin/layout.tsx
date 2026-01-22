'use client';

import { useState, useEffect } from 'react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    useEffect(() => {
        // Check if user is authenticated
        const authStatus = sessionStorage.getItem('adminAuthenticated');
        const adminEmail = sessionStorage.getItem('adminEmail');
        if (authStatus === 'true' && adminEmail) {
            setIsAuthenticated(true);
            setCredentials({ ...credentials, email: adminEmail });
        }
        setIsLoading(false);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoggingIn(true);

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Invalid credentials. Please try again.');
                setIsLoggingIn(false);
                return;
            }

            // Store authentication status and email
            sessionStorage.setItem('adminAuthenticated', 'true');
            sessionStorage.setItem('adminEmail', credentials.email);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Login error:', error);
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('adminAuthenticated');
        sessionStorage.removeItem('adminEmail');
        setIsAuthenticated(false);
        setCredentials({ email: '', password: '' });
    };

    if (isLoading) {
        return (
            <html lang="en">
                <body className="antialiased">
                    <div className="min-h-screen flex items-center justify-center bg-gray-50">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C8A2B8]"></div>
                    </div>
                </body>
            </html>
        );
    }

    if (!isAuthenticated) {
        return (
            <html lang="en">
                <body className="antialiased bg-gray-50">
                    <div className="min-h-screen flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
                            <div className="text-center mb-8">
                                <div className="text-4xl mb-4">🔐</div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Admin Login Required
                                </h2>
                                <p className="text-gray-600">
                                    Please enter your credentials to access the admin dashboard
                                </p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-6">
                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={credentials.email}
                                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C8A2B8] focus:border-transparent transition-all"
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={credentials.password}
                                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C8A2B8] focus:border-transparent transition-all"
                                        placeholder="Enter your password"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoggingIn}
                                    className="w-full bg-[#C8A2B8] text-white py-3 text-lg rounded-xl font-semibold hover:bg-[#6B2E5F] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoggingIn ? 'Signing In...' : 'Sign In'}
                                </button>
                            </form>
                        </div>
                    </div>
                </body>
            </html>
        );
    }

    return (
        <html lang="en">
            <body className="antialiased">
                <div className="relative">
                    {children}
                    {/* Logout button */}
                    <button
                        onClick={handleLogout}
                        className="fixed top-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </body>
        </html>
    );
}
