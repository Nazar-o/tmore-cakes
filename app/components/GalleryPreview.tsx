'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/app/lib/supabaseClient';

const galleryCategories = [
    {
        name: 'Birthday Cakes',
        icon: '🎂',
        description: 'Colorful and fun designs for all ages'
    },
    {
        name: 'Kids Cakes',
        icon: '🧸',
        description: 'Adorable themes that make kids smile'
    },
    {
        name: 'Wedding Cakes',
        icon: '💒',
        description: 'Elegant and romantic centerpieces'
    },
    {
        name: 'Specialty Cakes',
        icon: '✨',
        description: 'Unique sculpted and themed designs'
    }
];

interface GalleryImage {
    id: string;
    image_url: string;
    category: string;
    is_featured: boolean;
    display_order: number;
    created_at: string;
}

export default function GalleryPreview() {
    const [featuredImages, setFeaturedImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imagesPerView, setImagesPerView] = useState(4);
    const autoRotateIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        fetchFeaturedImages();
    }, []);

    useEffect(() => {
        // Update images per view based on screen size
        const updateImagesPerView = () => {
            if (window.innerWidth < 768) {
                setImagesPerView(2); // Phones
            } else if (window.innerWidth < 1024) {
                setImagesPerView(3); // Tablets
            } else {
                setImagesPerView(4); // Desktop
            }
        };

        updateImagesPerView();
        window.addEventListener('resize', updateImagesPerView);
        return () => window.removeEventListener('resize', updateImagesPerView);
    }, []);

    useEffect(() => {
        // Reset index when imagesPerView changes to prevent out of bounds
        if (currentIndex > Math.max(0, featuredImages.length - imagesPerView)) {
            setCurrentIndex(0);
        }
    }, [imagesPerView, featuredImages.length]);

    useEffect(() => {
        // Auto-rotate carousel every 3.5 seconds
        if (featuredImages.length > imagesPerView) {
            autoRotateIntervalRef.current = setInterval(() => {
                setCurrentIndex((prev) => {
                    const maxIndex = featuredImages.length - imagesPerView;
                    return prev >= maxIndex ? 0 : prev + 1;
                });
            }, 3500);
        }

        return () => {
            if (autoRotateIntervalRef.current) {
                clearInterval(autoRotateIntervalRef.current);
            }
        };
    }, [featuredImages.length, imagesPerView]);

    const fetchFeaturedImages = async () => {
        try {
            const { data, error } = await supabase
                .from('gallery_images')
                .select('*')
                .eq('is_featured', true)
                .order('display_order', { ascending: true })
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching featured images:', error);
            } else {
                setFeaturedImages(data || []);
            }
        } catch (error) {
            console.error('Error fetching featured images:', error);
        } finally {
            setLoading(false);
        }
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => {
            const maxIndex = featuredImages.length - imagesPerView;
            return prev >= maxIndex ? 0 : prev + 1;
        });
        // Reset auto-rotate timer
        if (autoRotateIntervalRef.current) {
            clearInterval(autoRotateIntervalRef.current);
        }
        autoRotateIntervalRef.current = setInterval(() => {
            setCurrentIndex((prev) => {
                const maxIndex = featuredImages.length - imagesPerView;
                return prev >= maxIndex ? 0 : prev + 1;
            });
        }, 3500);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => {
            return prev === 0 ? Math.max(0, featuredImages.length - imagesPerView) : prev - 1;
        });
        // Reset auto-rotate timer
        if (autoRotateIntervalRef.current) {
            clearInterval(autoRotateIntervalRef.current);
        }
        autoRotateIntervalRef.current = setInterval(() => {
            setCurrentIndex((prev) => {
                const maxIndex = featuredImages.length - imagesPerView;
                return prev >= maxIndex ? 0 : prev + 1;
            });
        }, 3500);
    };

    return (
        <section id="gallery" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="gradient-text-dark">Cake Gallery</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Take a look at some of our recent creations. Each cake tells a unique story!
                    </p>
                </div>

                {/* Featured Images Carousel */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading gallery...</p>
                    </div>
                ) : featuredImages.length > 0 ? (
                    <div className="relative max-w-7xl mx-auto mb-10 px-8 md:px-12">
                        {/* Carousel Container */}
                        <div className="relative overflow-hidden rounded-2xl">
                            <div
                                className="flex transition-transform duration-500 ease-in-out"
                                style={{
                                    transform: `translateX(-${currentIndex * (100 / imagesPerView)}%)`
                                }}
                            >
                                {featuredImages.map((image) => (
                                    <div
                                        key={image.id}
                                        className="flex-shrink-0 px-3"
                                        style={{ width: `${100 / imagesPerView}%` }}
                                    >
                                        <div className="group cursor-pointer">
                                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                                                <div className="relative aspect-[3/4] w-full">
                                                    <Image
                                                        src={image.image_url}
                                                        alt={`${image.category} cake`}
                                                        fill
                                                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                        className="object-cover"
                                                        loading="lazy"
                                                        quality={85}
                                                    />
                                                    {/* Hover veil */}
                                                    <div className="pointer-events-none absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors duration-300" />

                                                    {/* Category pill (top-left) */}
                                                    <div className="absolute top-3 left-3">
                                                        <span className="backdrop-blur-sm bg-white/80 text-gray-800 text-xs font-medium px-3 py-1 rounded-full shadow-sm border border-white/70">
                                                            {image.category}
                                                        </span>
                                                    </div>

                                                    {/* Featured badge (top-right) */}
                                                    {image.is_featured && (
                                                        <div className="absolute top-3 right-3">
                                                            <span className="backdrop-blur-sm bg-yellow-400/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
                                                                Featured
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Arrows */}
                        {featuredImages.length > imagesPerView && (
                            <>
                                {/* Left Arrow */}
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 z-10 bg-white rounded-full p-2 md:p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
                                    aria-label="Previous images"
                                >
                                    <svg
                                        className="w-6 h-6 text-gray-700 group-hover:text-yellow-500 transition-colors"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                {/* Right Arrow */}
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 z-10 bg-white rounded-full p-2 md:p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
                                    aria-label="Next images"
                                >
                                    <svg
                                        className="w-6 h-6 text-gray-700 group-hover:text-yellow-500 transition-colors"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🎂</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Gallery Coming Soon</h3>
                        <p className="text-gray-600">We're working on adding our beautiful cake creations to the gallery.</p>
                    </div>
                )}

                {/* Category Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-16">
                    {galleryCategories.map((category) => (
                        <div key={category.name} className="text-center group">
                            <h3 className="text-lg font-semibold mb-2 text-gray-800">
                                {category.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {category.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center">
                    <div className="bg-gradient-to-r from-yellow-50 to-white rounded-3xl p-12 max-w-4xl mx-auto">
                        <h3 className="text-3xl font-bold mb-4 text-gray-800">
                            Want to See More?
                        </h3>
                        <p className="text-lg text-gray-600 mb-8">
                            Browse our full gallery of custom cakes and get inspired for your next celebration!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/gallery" className="btn-primary">
                                View Full Gallery
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
} 