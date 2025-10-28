'use client';

import { useState, useEffect } from 'react';

interface GalleryImage {
    id: string;
    image_url: string;
    category: string;
}

interface GalleryLightboxProps {
    isOpen: boolean;
    onClose: () => void;
    images: GalleryImage[];
    currentIndex: number;
    onNavigate: (index: number) => void;
}

export default function GalleryLightbox({
    isOpen,
    onClose,
    images,
    currentIndex,
    onNavigate
}: GalleryLightboxProps) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            switch (e.key) {
                case 'Escape':
                    onClose();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    navigatePrevious();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    navigateNext();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, currentIndex]);

    const navigatePrevious = () => {
        const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
        onNavigate(newIndex);
    };

    const navigateNext = () => {
        const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
        onNavigate(newIndex);
    };

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    if (!isOpen || !images[currentIndex]) return null;

    const currentImage = images[currentIndex];

    return (
        <div className="lightbox-mobile fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
                aria-label="Close lightbox"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Navigation Arrows */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={navigatePrevious}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
                        aria-label="Previous image"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={navigateNext}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
                        aria-label="Next image"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}

            {/* Image Container */}
            <div className="relative max-w-7xl max-h-full flex items-center justify-center">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                )}

                <img
                    src={currentImage.image_url}
                    alt={`Gallery image ${currentIndex + 1}`}
                    className="max-w-full max-h-full object-contain"
                    onLoad={handleImageLoad}
                    style={{ display: isLoading ? 'none' : 'block' }}
                />
            </div>

            {/* Image Info */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
                <div className="bg-black bg-opacity-50 rounded-lg px-4 py-2">
                    <p className="text-sm font-medium">{currentImage.category}</p>
                    {images.length > 1 && (
                        <p className="text-xs text-gray-300">
                            {currentIndex + 1} of {images.length}
                        </p>
                    )}
                </div>
            </div>

            {/* Click outside to close */}
            <div
                className="absolute inset-0 -z-10"
                onClick={onClose}
                aria-label="Close lightbox"
            />
        </div>
    );
}
