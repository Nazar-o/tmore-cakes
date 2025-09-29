'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const heroImages = [
    '/images/hero-1.JPG',
    '/images/hero-2.JPG',
    '/images/hero-3.JPG',
];

const heroPositions = [
    'center',
    '50% 45%',
    '50% 90%',
];

export default function HeroSection() {
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % heroImages.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative min-h-[100vh] sm:min-h-[900px] flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30 z-10" />
                {heroImages.map((src, idx) => (
                    <div
                        key={src}
                        className="absolute inset-0 bg-cover transition-opacity duration-700 ease-in-out"
                        style={{
                            backgroundImage: `url(${src})`,
                            backgroundPosition: heroPositions[idx],
                            opacity: idx === currentImage ? 1.0 : 0,
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-20 text-center text-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Main Heading - Responsive sizing */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal leading-tight">
                    <span className="sacrifice-font block">
                        Crafting Sweet Memories,
                    </span>
                    <span className="text-yellow-300 sacrifice-font block mt-2 sm:mt-4">
                        One Slice at a Time
                    </span>
                </h1>

                {/* Subtitle - Hidden on very small screens, shown on mobile+ */}
                <p className="text-lg sm:text-xl md:text-2xl text-yellow-100 mt-6 sm:mt-8 max-w-3xl mx-auto px-4">
                    Custom cakes for every special moment
                </p>

                {/* Call to Action Buttons - Mobile optimized */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mt-8 sm:mt-12 px-4">
                    <Link
                        href="#order-form"
                        className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto text-center"
                    >
                        Order a Custom Cake
                    </Link>
                    <Link
                        href="#tasting"
                        className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto text-center"
                    >
                        Book a Tasting
                    </Link>
                </div>

                {/* Additional mobile-friendly content */}
                <div className="mt-8 sm:mt-12 text-sm sm:text-base text-yellow-100 max-w-2xl mx-auto px-4">
                    <p>From birthdays to weddings, we create the perfect cake for your celebration</p>
                </div>
            </div>

            {/* Scroll Indicator - Mobile optimized */}
            <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20">
                <div className="animate-bounce">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </div>
        </section>
    );
}