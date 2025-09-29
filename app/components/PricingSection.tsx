'use client';

import { useState } from 'react';

const cakeSizes = [
    {
        name: '8" Round',
        servings: '24-28',
        basePrice: 216,
        description: 'Perfect for intimate gatherings',
        type: 'single'
    },
    {
        name: '10" Round',
        servings: '38-42',
        basePrice: 342,
        description: 'Great for medium-sized parties',
        type: 'single'
    },
    {
        name: '12" Round',
        servings: '54-58',
        basePrice: 486,
        description: 'Ideal for larger celebrations',
        type: 'single'
    },
    {
        name: 'Double Barrel 6"',
        servings: '28-30',
        basePrice: 270,
        description: 'Elegant height, perfect portions',
        type: 'double'
    }
];

const tierSuggestions = [
    {
        name: '2-Tier Cakes',
        tiers: ['5"+7"', '6"+8"', '8"+10"'],
        startingPrice: 350,
        description: 'Perfect for medium celebrations',
        icon: '🎂'
    },
    {
        name: '3-Tier Cakes',
        tiers: ['5"+7"+9"', '6"+8"+10"', '8"+10"+12"'],
        startingPrice: 500,
        description: 'Grand celebrations and weddings',
        icon: '🏰'
    }
];

const flavors = {
    included: [
        'Vanilla', 'Chocolate', 'Strawberry', 'Lemon',
        'Red Velvet', 'Carrot', 'Banana', 'Coconut'
    ],
    premium: [
        'Salted Caramel', 'Cookies & Cream', 'Tiramisu',
        'Chocolate Raspberry', 'Lavender', 'Pistachio'
    ]
};

const frostings = [
    'Vanilla Swiss Meringue Buttercream',
    'Chocolate Swiss Meringue Buttercream',
    'Cream Cheese Frosting',
    'Chocolate Ganache',
    'Whipped Cream',
    'Italian Meringue'
];

export default function PricingSection() {
    const [activeTab, setActiveTab] = useState('sizes');

    return (
        <section id="pricing" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                        Our <span className="gradient-text">Pricing</span>
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                        Transparent pricing for every celebration. All cakes are custom-made with premium ingredients.
                    </p>
                </div>

                {/* Tab Navigation - Mobile optimized */}
                <div className="flex flex-col sm:flex-row justify-center mb-8 sm:mb-12">
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                        <button
                            onClick={() => setActiveTab('sizes')}
                            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 ${activeTab === 'sizes'
                                ? 'bg-yellow-500 text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-yellow-50 border border-gray-300'
                                }`}
                        >
                            Cake Sizes
                        </button>
                        <button
                            onClick={() => setActiveTab('flavors')}
                            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 ${activeTab === 'flavors'
                                ? 'bg-yellow-500 text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-yellow-50 border border-gray-300'
                                }`}
                        >
                            Flavors & Frostings
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'flavors' && (
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                            {/* Flavors */}
                            <div className="card">
                                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Cake Flavors</h3>

                                <div className="mb-6 sm:mb-8">
                                    <h4 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 text-center">Standard Flavors</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                        {flavors.included.map((flavor, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                                                <span className="text-gray-700 text-sm sm:text-base">{flavor}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-purple-600 text-center">Premium Flavors (+$15)</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                        {flavors.premium.map((flavor, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
                                                <span className="text-gray-700 text-sm sm:text-base">{flavor}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Frostings */}
                            <div className="card">
                                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Frostings & Fillings</h3>
                                <p className="text-gray-600 mb-4 sm:mb-6 text-center text-sm sm:text-base">
                                    All frostings are Swiss Meringue Buttercream based
                                </p>
                                <div className="space-y-2 sm:space-y-3">
                                    {frostings.map((frosting, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0"></div>
                                            <span className="text-gray-700 text-sm sm:text-base">{frosting}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Add-ons */}
                        <div className="mt-6 sm:mt-8">
                            <div className="card">
                                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Additional Services</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className="text-2xl sm:text-3xl mb-2">🚚</div>
                                        <h4 className="font-semibold mb-2 text-sm sm:text-base">Delivery</h4>
                                        <p className="text-gray-600 text-sm sm:text-base">$35 - $85</p>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className="text-2xl sm:text-3xl mb-2">🎨</div>
                                        <h4 className="font-semibold mb-2 text-sm sm:text-base">Setup Fee</h4>
                                        <p className="text-gray-600 text-sm sm:text-base">$25 - $100</p>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className="text-2xl sm:text-3xl mb-2">⭐</div>
                                        <h4 className="font-semibold mb-2 text-sm sm:text-base">Custom Decorations</h4>
                                        <p className="text-gray-600 text-sm sm:text-base">Priced by design</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Content */}
                {activeTab === 'sizes' && (
                    <div className="max-w-6xl mx-auto">
                        {/* Base Pricing Info */}
                        <div className="text-center mb-8 sm:mb-12">
                            <div className="card max-w-2xl mx-auto mb-6 sm:mb-8">
                                <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 text-center">Base Pricing Guide</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                        <span className="text-gray-700 text-sm sm:text-base">Starting at:</span>
                                        <span className="text-xl sm:text-2xl font-bold text-yellow-600">$9/serving</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                        <span className="text-gray-700 text-sm sm:text-base">Minimum order:</span>
                                        <span className="text-base sm:text-lg font-semibold text-gray-900">8-inch (24-28 servings)</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-700 text-sm sm:text-base">Double Barrel 6":</span>
                                        <span className="text-base sm:text-lg font-semibold text-gray-900">28-30 servings</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Single Cakes - Mobile optimized grid */}
                        <div className="mb-8 sm:mb-12">
                            <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 text-gray-900">Single Cakes</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                                {cakeSizes.filter(size => size.type === 'single').map((size, index) => (
                                    <div key={index} className="card text-center group hover:scale-105 transition-transform duration-300">
                                        <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎂</div>
                                        <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900">{size.name}</h3>
                                        <div className="text-2xl sm:text-3xl font-bold text-yellow-600 mb-2">
                                            ${size.basePrice}
                                        </div>
                                        <div className="text-sm text-gray-500 mb-3">{size.servings} servings</div>
                                        <p className="text-gray-600 text-sm">{size.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tiered Cakes - Mobile optimized */}
                        <div className="mb-8 sm:mb-12">
                            <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 text-gray-900">Tiered Cakes</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                                {tierSuggestions.map((tier, index) => (
                                    <div key={index} className="card text-center group hover:scale-105 transition-transform duration-300">
                                        <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{tier.icon}</div>
                                        <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900">{tier.name}</h3>
                                        <div className="text-2xl sm:text-3xl font-bold text-yellow-600 mb-2">
                                            From ${tier.startingPrice}
                                        </div>
                                        <p className="text-gray-600 text-sm sm:text-base mb-4">{tier.description}</p>
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-gray-700 text-center text-sm sm:text-base">Available Combinations:</h4>
                                            <div className="flex flex-wrap justify-center gap-2">
                                                {tier.tiers.map((combination, idx) => (
                                                    <div key={idx} className="text-xs sm:text-sm text-gray-600 bg-gray-50 px-2 sm:px-3 py-1 rounded-full">
                                                        {combination}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* CTA - Mobile optimized */}
                <div className="text-center mt-8 sm:mt-10">
                    <p className="text-base sm:text-lg text-gray-600 mb-2 sm:mb-6">
                        Ready to start your custom cake journey?
                    </p>
                    <a
                        href="#order-form"
                        className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 inline-block"
                    >
                        Get Started Today
                    </a>
                </div>
            </div>
        </section>
    );
}