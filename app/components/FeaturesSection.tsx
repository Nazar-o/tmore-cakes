'use client';

import { useState } from 'react';
import Link from 'next/link';

const features = [
    {
        icon: '🎂',
        title: 'Custom Designs',
        description: 'Every cake is uniquely designed to match your vision and theme perfectly.'
    },
    {
        icon: '🌟',
        title: 'Premium Quality',
        description: 'We use only the finest ingredients to ensure exceptional taste and texture.'
    },
    {
        icon: '💝',
        title: 'Made with Love',
        description: 'Each cake is crafted with passion and attention to every detail.'
    },
    {
        icon: '🎨',
        title: 'Artistic Flair',
        description: 'From simple elegance to complex designs, we bring your ideas to life.'
    }
];

const funFacts = [
    'Specializes in wedding and celebration cakes',
    'Most popular flavor: Red Velvet with Cream Cheese',
    'Over 500 cakes baked and delivered',
    'Favorites: sculpted cakes and themed designs'
];

export default function FeaturesSection() {
    const [activeTab, setActiveTab] = useState('features');

    return (
        <section id="about" className="py-10 bg-white">
            <div className="container mx-auto px-4">
                {/* Tab Navigation */}
                <div className="flex justify-center mb-12">
                    <div className="bg-gray-100 rounded-full p-2">
                        <button
                            onClick={() => setActiveTab('features')}
                            className={`px-6 py-3 rounded-full font-medium transition-all ${activeTab === 'features'
                                ? 'bg-white text-gray-900 shadow-md'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            What I Do
                        </button>
                        <button
                            onClick={() => setActiveTab('facts')}
                            className={`px-6 py-3 rounded-full font-medium transition-all ${activeTab === 'facts'
                                ? 'bg-white text-gray-900 shadow-md'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Fun Facts
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'features' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {features.map((feature, index) => (
                            <div key={index} className="card text-center group">
                                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'facts' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {funFacts.map((fact, index) => (
                                <div key={index} className="card flex items-center space-x-4">
                                    <div className="text-3xl text-yellow-500">✨</div>
                                    <p className="text-lg text-gray-700">{fact}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Photo Carousel Placeholder */}
                <div className="mt-16 text-center">
                    <div className="bg-gradient-to-r from-yellow-100 to-white rounded-3xl p-12 max-w-4xl mx-auto">
                        <div className="text-6xl mb-4">📸</div>
                        <h3 className="text-2xl font-bold mb-4 text-gray-800">
                            Behind the Scenes
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Watch the magic happen! Real photos of the baking process will be displayed here.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <div className="w-24 h-24 bg-white rounded-lg shadow-md"></div>
                            <div className="w-24 h-24 bg-white rounded-lg shadow-md"></div>
                            <div className="w-24 h-24 bg-white rounded-lg shadow-md"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
} 