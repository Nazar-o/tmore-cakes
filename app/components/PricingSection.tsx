'use client';

import { useState } from 'react';

const cakeSizes = [
    {
        name: '8" Round',
        servings: '24-28',
        basePrice: 216,
        description: 'Perfect for intimate gatherings'
    },
    {
        name: '10" Round',
        servings: '38-42',
        basePrice: 342,
        description: 'Great for medium-sized parties'
    },
    {
        name: '12" Round',
        servings: '54-58',
        basePrice: 486,
        description: 'Ideal for larger celebrations'
    },
    {
        name: 'Double Barrel 6"',
        servings: '28-30',
        basePrice: 270,
        description: 'Elegant height, perfect portions'
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
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="gradient-text">Flavors</span> & Pricing
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Starting at $9 per serving with an 8" minimum. Premium flavors available for an additional $15.
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white rounded-full p-2 shadow-lg">
                        <button
                            onClick={() => setActiveTab('sizes')}
                            className={`px-6 py-3 rounded-full font-medium transition-all ${activeTab === 'sizes'
                                ? 'bg-gradient-to-r from-yellow-500 to-yellow-300 text-white shadow-md'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Cake Sizes
                        </button>
                        <button
                            onClick={() => setActiveTab('flavors')}
                            className={`px-6 py-3 rounded-full font-medium transition-all ${activeTab === 'flavors'
                                ? 'bg-gradient-to-r from-yellow-500 to-yellow-300 text-white shadow-md'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Flavors & Frostings
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'sizes' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {cakeSizes.map((size, index) => (
                            <div key={index} className="card text-center group hover:scale-105 transition-transform duration-300">
                                <div className="text-4xl mb-4">🎂</div>
                                <h3 className="text-xl font-bold mb-2 text-gray-900">{size.name}</h3>
                                <div className="text-3xl font-bold text-yellow-600 mb-2">
                                    ${size.basePrice}
                                </div>
                                <div className="text-sm text-gray-500 mb-3">{size.servings} servings</div>
                                <p className="text-gray-600 text-sm">{size.description}</p>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'flavors' && (
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Flavors */}
                            <div className="card">
                                <h3 className="text-2xl font-bold mb-6 text-center">Cake Flavors</h3>

                                <div className="mb-8">
                                    <h4 className="text-lg font-semibold mb-4 text-green-600">Included Flavors</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {flavors.included.map((flavor, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                <span className="text-gray-700">{flavor}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-semibold mb-4 text-purple-600">Premium Flavors (+$15)</h4>
                                    <div className="grid grid-cols-2 gap-3">
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
                            <div className="card">
                                <h3 className="text-2xl font-bold mb-6 text-center">Frostings & Fillings</h3>
                                <p className="text-gray-600 mb-6 text-center">
                                    All frostings are Swiss Meringue Buttercream based
                                </p>
                                <div className="grid grid-cols-2 gap-3">
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
                        <div className="mt-12">
                            <div className="card">
                                <h3 className="text-2xl font-bold mb-6 text-center">Additional Services</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <div className="text-2xl mb-2">🚚</div>
                                        <h4 className="font-semibold mb-2">Delivery</h4>
                                        <p className="text-gray-600">$35 - $85</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl mb-2">🎨</div>
                                        <h4 className="font-semibold mb-2">Setup Fee</h4>
                                        <p className="text-gray-600">$25 - $100</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl mb-2">⭐</div>
                                        <h4 className="font-semibold mb-2">Custom Decorations</h4>
                                        <p className="text-gray-600">Priced by design</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* CTA */}
                <div className="text-center mt-16">
                    <p className="text-lg text-gray-600 mb-6">
                        Ready to start your custom cake journey?
                    </p>
                    <a href="#order-form" className="btn-primary text-lg px-8 py-4">
                        Get Started Today
                    </a>
                </div>
            </div>
        </section>
    );
} 