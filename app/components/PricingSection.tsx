'use client';

import { useState } from 'react';

const cakeSizes = [
    {
        name: '8-inch Round',
        servings: '24–28',
        basePrice: 216,
        description: 'Great for small gatherings',
        type: 'single'
    },
    {
        name: '9-inch Round',
        servings: '32–38',
        basePrice: 288,
        description: 'Perfect for medium gatherings',
        type: 'single'
    },
    {
        name: '10-inch Round',
        servings: '38–42',
        basePrice: 342,
        description: 'Great for medium-sized parties',
        type: 'single'
    },
    {
        name: '12-inch Round',
        servings: '54–58',
        basePrice: 486,
        description: 'Ideal for larger celebrations',
        type: 'single'
    },
    {
        name: 'Double Barrel 6-inch',
        servings: '28–30',
        basePrice: 252,
        description: 'Elegant height, perfect portions',
        type: 'double'
    }
];

const tierSuggestions = [
    {
        name: '2-Tier Cakes',
        tiers: ['5-inch + 7-inch — from $270', '6-inch + 8-inch — from $360', '7-inch + 9-inch — from $468', '8-inch + 10-inch — from $558'],
        startingPrice: 270,
        description: 'Perfect for medium celebrations',
        icon: '🎂'
    },
    {
        name: '3-Tier Cakes',
        tiers: ['4-inch + 6-inch + 8-inch — from $450', '5-inch + 7-inch + 9-inch — from $558', '6-inch + 8-inch + 10-inch — from $702', '8-inch + 10-inch + 12-inch — from $1,044'],
        startingPrice: 450,
        description: 'Grand celebrations and weddings',
        icon: '🏰'
    }
];

const flavors = {
    included: ['White Vanilla', 'Red Velvet', 'Dark Chocolate', 'Zesty Lemon', 'Classic Wedding Cake', 'Almond'],
    premium: ['Carrot', 'Strawberry', 'Cookies & Cream', 'Raspberry', 'Piña Colada', 'Guinness Chocolate Fudge', 'Italian Cream Cake']
};

const frostings = ['Chocolate', 'Mocha', 'Mint Chocolate Chip', 'Strawberry', 'Cookies & Cream', 'Zesty Lemon', 'Almond', 'Cream Cheese'];

export default function PricingSection() {
    const [activeTab, setActiveTab] = useState('sizes');

    return (
        <section id="pricing" className="py-20 gradient-bg">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 ">
                        <span className="gradient-text-dark pricing-section-title">Our Cake Collection</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto pricing-section-text">
                        Explore our variety of cake sizes, flavors, and styles. Each cake is custom-made to perfection for your special occasion.
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white rounded-full p-2 shadow-lg flex">
                        <button
                            onClick={() => setActiveTab('sizes')}
                            className={`px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${activeTab === 'sizes'
                                ? 'bg-gradient-to-r from-yellow-500 to-yellow-300 text-white shadow-md'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Cake Sizes & Styles
                        </button>
                        <button
                            onClick={() => setActiveTab('flavors')}
                            className={`px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${activeTab === 'flavors'
                                ? 'bg-gradient-to-r from-yellow-500 to-yellow-300 text-white shadow-md'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Flavors & Frostings
                        </button>
                    </div>
                </div>



                {activeTab === 'flavors' && (
                    <div className="max-w-6xl mx-auto">
                        <div className="flavors-frosting-grid grid grid-cols-1 lg:grid-cols-2 justify-items-center">
                            {/* Flavors */}
                            <div className="flavors-card-mobile card w-140 justify-items-center">
                                <h3 className="pricing-card-title">Cake Flavors</h3>

                                <div className="mb-8">
                                    <h4 className="text-xl font-semibold mb-4 text-black-600 text-center">Standard Flavors</h4>
                                    <div className="flavors-grid-mobile grid grid-cols-2 gap-3">
                                        {flavors.included.map((flavor, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                                <span className="text-gray-700">{flavor}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xl font-semibold mb-4 text-purple-600 text-center">Premium Flavors (+$15)</h4>
                                    <div className="flavors-grid-mobile grid grid-cols-2 gap-3">
                                        {flavors.premium.map((flavor, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                                <span className="text-gray-700">{flavor}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Frostings */}
                            <div className="flavors-card-mobile card w-140">
                                <h3 className="pricing-card-title">Frostings & Fillings</h3>
                                <p className="text-gray-600 mb-2 text-center font-medium">
                                    Tmore's Signature silk Buttercream/frosting
                                </p>
                                <p className="text-sm text-gray-500 mb-6 text-center italic">
                                    (A smooth, stable Swiss meringue-style buttercream with a hint of white chocolate)
                                </p>
                                <div className="frostings-list-mobile flex flex-col items-center gap-3">
                                    {frostings.map((frosting, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                            <span className="text-gray-700">{frosting}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Add-ons */}
                        <div className="mt-8">
                            <div className="card">
                                <h3 className="pricing-card-title">Additional Services</h3>
                                <div className="additional-services-mobile grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="service-card-mobile text-center">
                                        <div className="text-2xl mb-2">🚚</div>
                                        <h4 className="font-semibold mb-2">Delivery</h4>
                                        <p className="text-gray-600 mb-2">$35 - $85</p>
                                        <p className="text-sm text-gray-500">Delivery fees are calculated based on distance and are recommended for 2-tier cakes or larger.</p>
                                    </div>
                                    <div className="service-card-mobile text-center">
                                        <div className="text-2xl mb-2">🎨</div>
                                        <h4 className="font-semibold mb-2">Setup Fee</h4>
                                        <p className="text-gray-600">$25 - $100</p>
                                    </div>
                                    <div className="service-card-mobile text-center">
                                        <div className="text-2xl mb-2">⭐</div>
                                        <h4 className="font-semibold mb-2">Custom Decorations</h4>
                                        <p className="text-gray-600">Priced by design</p>
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
                        <div className="text-center mb-12">
                            <div className="card max-w-2xl mx-auto mb-8">
                                <h3 className="pricing-card-title">Base Pricing Guide</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                        <span className="text-gray-700">Starting at:</span>
                                        <span className="text-xl font-bold text-yellow-600">$9/serving</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                        <span className="text-gray-700">Minimum order:</span>
                                        <span className="text-md font-semibold text-gray-900">8-inch (24–28 servings)</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-700">Double Barrel 6-inch:</span>
                                        <span className="text-md font-semibold text-gray-900">28–30 servings</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Single Cakes */}
                        <div className="mb-12">
                            <h3 className="pricing-card-title text-center">Single Cakes</h3>
                            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                                {cakeSizes.filter(size => size.type === 'single').map((size, index) => (
                                    <div key={index} className="pricing-card-mobile card text-center group hover:scale-105 transition-transform duration-300 w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(50%-1rem)] max-w-sm">
                                        <h3 className="text-xl font-bold mb-2 text-gray-900">{size.name}</h3>
                                        <div className="text-sm text-gray-500 mb-3">{size.servings} servings</div>
                                        <div className="text-lg font-bold text-yellow-600 mb-3">from ${size.basePrice}</div>
                                        <p className="text-gray-600 text-sm mb-4">{size.description}</p>
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                            <p className="text-sm text-yellow-800 font-medium">{size.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Double Barrel Cakes */}
                        <div className="mb-12">
                            <h3 className="pricing-card-title text-center">Double Barrel Cakes</h3>
                            <p className="text-center text-gray-600 mb-6">5-6 layers of cake (12 to 14 inches tall)</p>
                            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                                {cakeSizes.filter(size => size.type === 'double').map((size, index) => (
                                    <div key={index} className="pricing-card-mobile card text-center group hover:scale-105 transition-transform duration-300 w-full sm:w-80 sm:flex-shrink-0">
                                        <h3 className="text-xl font-bold mb-2 text-gray-900">{size.name}</h3>
                                        <div className="text-sm text-gray-500 mb-3">{size.servings} servings</div>
                                        <div className="text-lg font-bold text-yellow-600 mb-3">from ${size.basePrice}</div>
                                        <p className="text-gray-600 text-sm mb-4">{size.description}</p>
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                            <p className="text-sm text-yellow-800 font-medium">{size.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tiered Cakes */}
                        <div>
                            <h3 className="pricing-card-title text-center">Tiered Cakes</h3>
                            <p className="text-center text-gray-600 mb-6">Tier combinations and sizes vary depending on the number of servings required.</p>
                            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                                {tierSuggestions.map((tier, index) => (
                                    <div key={index} className="pricing-card-mobile card text-center group hover:scale-105 transition-transform duration-300 w-full sm:w-96 sm:flex-shrink-0">
                                        <h3 className="text-xl font-bold mb-2 text-gray-900">{tier.name}</h3>
                                        <p className="text-gray-600 text-sm mb-4">{tier.description}</p>
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-gray-700 text-center">Available Combinations:</h4>
                                            <div className="flex flex-col items-center gap-2">
                                                {tier.tiers.map((combination, idx) => (
                                                    <div key={idx} className="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-full">
                                                        {combination}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
                                            <p className="text-sm text-purple-800 font-medium">Other size combinations available: contact for pricing.</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* CTA */}
                <div className="text-center mt-10">
                    <p className="text-lg text-gray-600 mb-6">
                        Ready to create your perfect custom cake? Get a personalized quote today!
                    </p>
                    <a href="#order-form" className="btn-primary text-lg px-8 py-4">
                        Get Your Custom Quote
                    </a>
                </div>
            </div>
        </section>
    );
} 