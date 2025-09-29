'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdminLogin from './AdminLogin';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showAdminLogin, setShowAdminLogin] = useState(false);

    return (
        <>
            <nav className="bg-white/95 backdrop-blur-md shadow-lg fixed w-full top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 sm:h-20">
                        {/* Logo - Mobile optimized */}
                        <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
                            <div className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300">
                                <img
                                    src="/images/logo.png"
                                    alt="TMore's Cakes"
                                    width={120}
                                    height={100}
                                    className="sm:w-[150px] sm:h-[125px] w-[120px] h-[100px] object-contain"
                                />
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-base xl:text-lg">
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
                            <Link href="#order-form" className="btn-primary text-sm xl:text-base px-4 xl:px-6 py-2 xl:py-3">
                                Order Now
                            </Link>
                            <button
                                onClick={() => setShowAdminLogin(true)}
                                className="text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm xl:text-base"
                            >
                                Admin
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                            aria-label="Toggle menu"
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

                    {/* Mobile Menu - Improved styling */}
                    {isMenuOpen && (
                        <div className="lg:hidden pb-4 border-t border-gray-200 bg-white/95 backdrop-blur-md">
                            <div className="flex flex-col space-y-3 pt-4">
                                <Link
                                    href="/"
                                    className="nav-link text-base py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/about"
                                    className="nav-link text-base py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    About
                                </Link>
                                <Link
                                    href="#pricing"
                                    className="nav-link text-base py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Pricing
                                </Link>
                                <Link
                                    href="#gallery"
                                    className="nav-link text-base py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Gallery
                                </Link>
                                <Link
                                    href="#order-form"
                                    className="btn-primary text-center text-base py-3 px-4 mx-4 rounded-lg"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Order Now
                                </Link>
                                <button
                                    onClick={() => {
                                        setShowAdminLogin(true);
                                        setIsMenuOpen(false);
                                    }}
                                    className="text-gray-600 hover:text-gray-900 transition-colors font-medium text-base py-2 px-4 text-left rounded-lg hover:bg-gray-50"
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