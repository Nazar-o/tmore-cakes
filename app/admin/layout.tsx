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

    useEffect(() => {
        // Check if user is authenticated
        const authStatus = sessionStorage.getItem('adminAuthenticated');
        if (authStatus === 'true') {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Check credentials
        if (credentials.email === 'admin@tmorescakes.com' && credentials.password === 'admin123') {
            sessionStorage.setItem('adminAuthenticated', 'true');
            setIsAuthenticated(true);
        } else {
            setError('Invalid credentials. Please try again.');
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('adminAuthenticated');
        setIsAuthenticated(false);
        setCredentials({ email: '', password: '' });
    };

    if (isLoading) {
        return (
            <html lang="en">
                <body className="antialiased">
                    <div className="min-h-screen flex items-center justify-center bg-gray-50">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                                        placeholder="admin@tmorescakes.com"
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                                        placeholder="Enter your password"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-300 text-white py-3 text-lg rounded-xl font-semibold hover:shadow-lg transition-all"
                                >
                                    Sign In
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
