'use client';

import { useState } from 'react';
import Link from 'next/link';

const galleryCategories = [
    {
        name: 'Birthday Cakes',
        icon: '🎂',
        count: 25,
        description: 'Colorful and fun designs for all ages'
    },
    {
        name: 'Kids Cakes',
        icon: '🧸',
        count: 18,
        description: 'Adorable themes that make kids smile'
    },
    {
        name: 'Wedding Cakes',
        icon: '💒',
        count: 32,
        description: 'Elegant and romantic centerpieces'
    },
    {
        name: 'Specialty Cakes',
        icon: '✨',
        count: 15,
        description: 'Unique sculpted and themed designs'
    }
];

const sampleImages = [
    { id: 1, category: 'Birthday', flavor: 'Red Velvet', event: '25th Birthday' },
    { id: 2, category: 'Wedding', flavor: 'Classic Vanilla', event: 'Beach Wedding' },
    { id: 3, category: 'Kids', flavor: 'Chocolate', event: 'Dinosaur Party' },
    { id: 4, category: 'Specialty', flavor: 'Lemon', event: 'Corporate Event' }
];

export default function GalleryPreview() {
    const [activeCategory, setActiveCategory] = useState('all');

    return (
        <section id="gallery" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Cake <span className="gradient-text">Gallery</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Take a look at some of our recent creations. Each cake tells a unique story!
                    </p>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    <button
                        onClick={() => setActiveCategory('all')}
                        className={`px-6 py-3 rounded-full font-medium transition-all ${activeCategory === 'all'
                            ? 'bg-gradient-to-r from-yellow-500 to-yellow-300 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        All Cakes
                    </button>
                    {galleryCategories.map((category) => (
                        <button
                            key={category.name}
                            onClick={() => setActiveCategory(category.name)}
                            className={`px-6 py-3 rounded-full font-medium transition-all ${activeCategory === category.name
                                ? 'bg-gradient-to-r from-yellow-500 to-yellow-300 text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {category.icon} {category.name}
                        </button>
                    ))}
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
                    {sampleImages.map((image) => (
                        <div key={image.id} className="group cursor-pointer">
                            <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-2xl p-6 h-64 flex flex-col justify-center items-center text-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
                                <div className="text-6xl mb-4">🎂</div>
                                <h3 className="font-semibold text-gray-800 mb-2">{image.category}</h3>
                                <p className="text-sm text-gray-600 mb-1">{image.flavor}</p>
                                <p className="text-xs text-gray-500">{image.event}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Category Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-16">
                    {galleryCategories.map((category) => (
                        <div key={category.name} className="text-center group">
                            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                                {category.icon}
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-gray-800">
                                {category.name}
                            </h3>
                            <div className="text-2xl font-bold text-yellow-600 mb-2">
                                {category.count}+
                            </div>
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
                            <Link href="#order-form" className="btn-secondary">
                                Start Your Order
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
} 