'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/app/lib/supabaseClient';
import GalleryLightbox from '@/app/components/GalleryLightbox';
import Footer from '@/app/components/Footer';
import FadeInSection from '@/app/components/FadeInSection';

interface GalleryImage {
    id: string;
    image_url: string;
    category: string;
    is_featured: boolean;
    display_order: number;
    created_at: string;
}

const categories = ['Birthday', 'Kids', 'Wedding', 'Specialty', 'Baby Shower'];

export default function GalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
    const [activeCategory, setActiveCategory] = useState(categories[0]);
    const [loading, setLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        fetchImages();
    }, []);

    useEffect(() => {
        filterImages();
    }, [images, activeCategory]);

    const fetchImages = async () => {
        try {
            const { data, error } = await supabase
                .from('gallery_images')
                .select('*')
                .order('display_order', { ascending: true })
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching images:', error);
            } else {
                setImages(data || []);
            }
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterImages = () => {
        setFilteredImages(images.filter(img => img.category === activeCategory));
    };

    const openLightbox = (index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    const navigateLightbox = (index: number) => {
        setCurrentImageIndex(index);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C8A2B8] mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading gallery...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* Logo - Top Right */}
            <div className="absolute top-17 right-90">
                <a href="/" className="block">
                    <img
                        src="/images/logo.png"
                        alt="TMore's Cakes"
                        className="h-24 w-auto hover:opacity-80 transition-opacity"
                    />
                </a>
            </div>
            <div className="gallery-page-mobile container mx-auto px-4 py-8">
                {/* Back to Home */}
                <div className="mb-6">
                    <a href="/" className="btn-secondary inline-block">
                        ← Back to Home
                    </a>
                </div>

                {/* Header */}
                <FadeInSection>
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#6B2E5F]">
                            Cake Gallery
                        </h1>
                        <p className="text-xl text-[#2E2E2E] max-w-3xl mx-auto">
                            Explore our collection of custom cakes. Each creation tells a unique story of celebration and joy.
                        </p>
                    </div>
                </FadeInSection>

                {/* Category Filter */}
                <FadeInSection delay={100}>
                    <div className="gallery-filter-mobile flex flex-wrap justify-center gap-4 mb-12">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-6 py-3 rounded-full font-medium transition-all ${activeCategory === category
                                    ? 'bg-[#C8A2B8] text-white shadow-md hover:bg-[#6B2E5F]'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm border border-gray-200'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </FadeInSection>

                {/* Gallery Grid - Masonry Layout */}
                <FadeInSection delay={200}>
                    {filteredImages.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🎂</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">No images found</h3>
                            <p className="text-gray-600">
                                No {activeCategory.toLowerCase()} cakes found.
                            </p>
                        </div>
                    ) : (
                        <div className="gallery-page-mobile grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredImages.map((image, index) => (
                                <button
                                    key={image.id}
                                    className="group cursor-pointer text-left"
                                    onClick={() => openLightbox(index)}
                                >
                                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                                        <div className="relative w-full" style={{ aspectRatio: '4/5' }}>
                                            <Image
                                                src={image.image_url}
                                                alt={`${image.category} cake`}
                                                fill
                                                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                className="object-cover rounded-lg"
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
                                                    <span className="backdrop-blur-sm bg-[#D4AF37]/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
                                                        Featured
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </FadeInSection>
            </div>

            {/* Lightbox */}
            <GalleryLightbox
                isOpen={lightboxOpen}
                onClose={closeLightbox}
                images={filteredImages}
                currentIndex={currentImageIndex}
                onNavigate={navigateLightbox}
            />
            <br />
            <br />
            <Footer />
        </div>
    );
}
