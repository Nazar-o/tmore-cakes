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
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
            <div className="relative z-20 text-center text-white px-4 max-w-8xl mx-auto top-20">
                <h1 className="sacrifice-font">
                    Crafting Sweet Memories,<br />
                    <span className="text-yellow-300 sacrifice-font">One Slice at a Time</span>
                </h1>


                {/* Call to Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-10">
                    <Link href="#order-form" className="btn-primary text-lg px-8 py-4 ">
                        Order a Custom Cake
                    </Link>
                    <Link href="#tasting" className="btn-secondary text-lg px-8 py-4">
                        Book a Tasting
                    </Link>
                </div>

                
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
                <div className="animate-bounce">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </div>
        </section>
    );
} 