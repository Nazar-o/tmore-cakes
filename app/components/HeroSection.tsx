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
        <section className="hero-section relative min-h-[900px] lg:min-h-[900px] md:min-h-[800px] sm:min-h-[600px] flex items-center justify-center overflow-hidden">
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
            <div className="relative z-20 norican-font text-center text-white px-4 max-w-8xl mx-auto top-20">
                {/* <h1>
                    Crafting Sweet Memories,<br />
                    <span className="text-yellow-300 ">One Slice at a Time</span>
                </h1> */}
            </div>

            {/* Call to Action Button - Positioned above arrow */}
            <div className="absolute bottom-25 left-1/2 transform -translate-x-1/2 z-20">
                <Link href="#order-form" className="btn-primary hero-button text-2xl lg:text-2xl md:text-xl sm:text-lg px-8 py-4 inline-block">
                    Order a Custom Cake
                </Link>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                <div className="animate-bounce">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </div>
        </section>
    );
} 