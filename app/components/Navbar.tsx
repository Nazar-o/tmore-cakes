'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav className={`navbar ${(isScrolled || isMenuOpen) ? 'navbar-solid' : 'navbar-transparent'} mobile-navbar-solid`}>
                <div className="navbar-container">
                    <div className="navbar-content">
                        {/* Left - Desktop Navigation (Home, About) */}
                        <div className="navbar-links-desktop xl:navbar-links-xl">
                            <Link href="/" className="navbar-link">Home</Link>
                            <Link href="/about" className="navbar-link">About</Link>
                        </div>

                        {/* Center - Logo with shaped background */}
                        <Link href="/" className="navbar-logo">
                            <div className="navbar-logo-bg"></div>
                            <img
                                src="/images/logo.png"
                                alt="TMore's Cakes"
                                className="navbar-logo-img"
                            />
                        </Link>

                        {/* Right - Desktop Navigation (Pricing, Gallery, Order) */}
                        <div className="navbar-links-desktop royalty-font xl:navbar-links-xl">
                            <Link href="#pricing" className="navbar-link">Pricing</Link>
                            <Link href="/gallery" className="navbar-link">Gallery</Link>
                            {/* <Link href="#order-form" className="btn-primary text-sm xl:text-base px-4 xl:px-6 py-2 xl:py-3">Order Now</Link> */}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="navbar-mobile-button"
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

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className="navbar-mobile-menu">
                            <div className="navbar-mobile-links">
                                <Link
                                    href="/"
                                    className="navbar-mobile-link"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/about"
                                    className="navbar-mobile-link"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    About
                                </Link>
                                <Link
                                    href="#pricing"
                                    className="navbar-mobile-link"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Pricing
                                </Link>
                                <Link
                                    href="/gallery"
                                    className="navbar-mobile-link"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Gallery
                                </Link>
                                {/* <Link
                                    href="#order-form"
                                    className="btn-primary text-center text-base py-3 px-4 mx-4 rounded-lg"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Order Now
                                </Link> */}
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
}