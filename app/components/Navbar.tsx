'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdminLogin from './AdminLogin';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showAdminLogin, setShowAdminLogin] = useState(false);

    return (
        <>
            <nav className="bg-white/95 backdrop-blur-md shadow-lg fixed w-full top-0 z-50 ">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center h-33">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                                <img src="/images/logo.png" alt="TMore's Cakes" width={175} height={150} />
                            </div>
                            <div>
                                {/* place a logo here */}

                                {/* <div className="text-2xl font-bold gradient-text">TMore's Cakes</div>
                                <div className="text-xs text-gray-500 -mt-1">Sweet Memories</div> */}
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="/" className="nav-link">
                                Home
                            </Link>
                            <Link href="/about" className="nav-link">
                                About
                            </Link>
                            <Link href="#pricing" className="nav-link">
                                Pricing
                            </Link>
                            <Link href="#gallery" className="nav-link">
                                Gallery
                            </Link>
                            <Link href="#order-form" className="btn-primary">
                                Order Now
                            </Link>
                            <button
                                onClick={() => setShowAdminLogin(true)}
                                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                            >
                                Admin
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className="md:hidden pb-6 border-t border-gray-200">
                            <div className="flex flex-col space-y-4 pt-4">
                                <Link href="/" className="nav-link">
                                    Home
                                </Link>
                                <Link href="/about" className="nav-link">
                                    About
                                </Link>
                                <Link href="#pricing" className="nav-link">
                                    Pricing
                                </Link>
                                <Link href="#gallery" className="nav-link">
                                    Gallery
                                </Link>
                                <Link href="#order-form" className="btn-primary text-center">
                                    Order Now
                                </Link>
                                <button
                                    onClick={() => {
                                        setShowAdminLogin(true);
                                        setIsMenuOpen(false);
                                    }}
                                    className="text-gray-600 hover:text-gray-900 transition-colors font-medium text-left"
                                >
                                    Admin
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Admin Login Modal */}
            {showAdminLogin && (
                <AdminLogin onClose={() => setShowAdminLogin(false)} />
            )}
        </>
    );
} 