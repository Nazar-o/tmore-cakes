'use client';

import { useState } from 'react';

interface AdminLoginProps {
    onClose: () => void;
}

export default function AdminLogin({ onClose }: AdminLoginProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate authentication
        setTimeout(() => {
            setIsLoading(false);
            // Here you would typically authenticate with your backend
            if (credentials.email === 'admin@tmorescakes.com' && credentials.password === 'admin123') {
                // Redirect to admin dashboard
                window.location.href = '/admin';
            } else {
                alert('Invalid credentials');
            }
        }, 1000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-4xl mb-4">🔐</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {isLogin ? 'Admin Login' : 'Admin Access'}
                    </h2>
                    <p className="text-gray-600">
                        {isLogin ? 'Access your admin dashboard' : 'Manage orders and business'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
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
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                {/* Demo Credentials */}
                <div className="mt-6 p-4 bg-yellow-50 rounded-xl">
                    <p className="text-sm text-gray-600 text-center">
                        <strong>Demo Credentials:</strong><br />
                        Email: admin@tmorescakes.com<br />
                        Password: admin123
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        Need help? Contact{' '}
                        <a href="mailto:Tmore.debby@gmail.com" className="text-yellow-600 hover:text-yellow-700">
                            Tmore.debby@gmail.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
} 