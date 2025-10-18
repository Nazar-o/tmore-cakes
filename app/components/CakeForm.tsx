'use client';

import { useState } from 'react';

export default function CakeForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        cakeType: '',
        size: '',
        occasion: '',
        description: '',
        date: '',
        dietaryRestrictions: '',
        inspirationPhoto: null as File | null,
        deliveryOption: '',
        deliveryAddress: '',
        targetBudget: '',
        contactMethod: '',
        contactTime: '',
        paymentMethod: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Create FormData for file upload
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('email', formData.email);
            submitData.append('phone', formData.phone);
            submitData.append('cakeType', formData.cakeType);
            submitData.append('size', formData.size);
            submitData.append('occasion', formData.occasion);
            submitData.append('description', formData.description);
            submitData.append('date', formData.date);
            submitData.append('dietaryRestrictions', formData.dietaryRestrictions);
            submitData.append('deliveryOption', formData.deliveryOption);
            submitData.append('deliveryAddress', formData.deliveryAddress);
            submitData.append('targetBudget', formData.targetBudget);
            submitData.append('contactMethod', formData.contactMethod);
            submitData.append('contactTime', formData.contactTime);
            submitData.append('paymentMethod', formData.paymentMethod);

            if (formData.inspirationPhoto) {
                submitData.append('inspirationPhoto', formData.inspirationPhoto);
            }

            const response = await fetch('/api/submit', {
                method: 'POST',
                body: submitData,
            });

            if (response.ok) {
                const result = await response.json();
                alert('Cake request submitted successfully!');
                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    cakeType: '',
                    size: '',
                    occasion: '',
                    description: '',
                    date: '',
                    dietaryRestrictions: '',
                    inspirationPhoto: null,
                    deliveryOption: '',
                    deliveryAddress: '',
                    targetBudget: '',
                    contactMethod: '',
                    contactTime: '',
                    paymentMethod: ''
                });
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting form. Please try again.');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({
                ...formData,
                inspirationPhoto: e.target.files[0]
            });
        }
    };

    return (
        <form id="order-form" onSubmit={handleSubmit} className="max-w-4xl mx-auto card">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 sm:mb-8 text-center">Request Your Custom Cake</h2>

            {/* Basic Information - Mobile optimized grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                        placeholder="Your full name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                        placeholder="your.email@example.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                        placeholder="(555) 123-4567"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cake Type *</label>
                    <select
                        name="cakeType"
                        required
                        value={formData.cakeType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                    >
                        <option value="">Select cake type</option>
                        <option value="birthday">Birthday Cake</option>
                        <option value="wedding">Wedding Cake</option>
                        <option value="anniversary">Anniversary Cake</option>
                        <option value="custom">Custom Design</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Size *</label>
                    <select
                        name="size"
                        required
                        value={formData.size}
                        onChange={handleChange}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                    >
                        <option value="">Select size</option>
                        <option value="8-inch">8" Round (24-28 servings)</option>
                        <option value="10-inch">10" Round (38-42 servings)</option>
                        <option value="12-inch">12" Round (54-58 servings)</option>
                        <option value="double-barrel-6">Double Barrel 6" (28-30 servings)</option>
                        <option value="2-tier-5-7">2-Tier: 5"+7" (from $350)</option>
                        <option value="2-tier-6-8">2-Tier: 6"+8" (from $350)</option>
                        <option value="2-tier-8-10">2-Tier: 8"+10" (from $350)</option>
                        <option value="3-tier-5-7-9">3-Tier: 5"+7"+9" (from $500)</option>
                        <option value="3-tier-6-8-10">3-Tier: 6"+8"+10" (from $500)</option>
                        <option value="3-tier-8-10-12">3-Tier: 8"+10"+12" (from $500)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Occasion</label>
                    <input
                        type="text"
                        name="occasion"
                        value={formData.occasion}
                        onChange={handleChange}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                        placeholder="Birthday party, wedding, etc."
                    />
                </div>
            </div>

            {/* Dietary Restrictions */}
            <div className="mb-6 sm:mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Restrictions/Allergies</label>
                <input
                    type="text"
                    name="dietaryRestrictions"
                    value={formData.dietaryRestrictions}
                    onChange={handleChange}
                    placeholder="e.g., Gluten-free, Nut allergy, Vegan"
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                />
            </div>

            {/* Inspiration Photo */}
            <div className="mb-6 sm:mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Inspiration Photo</label>
                <input
                    type="file"
                    name="inspirationPhoto"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                />
                <p className="text-sm text-gray-500 mt-2">Upload an image that inspires your cake design</p>
            </div>

            {/* Delivery/Pickup Options */}
            <div className="mb-6 sm:mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">Delivery or Pickup *</label>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-6">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="deliveryOption"
                            value="pickup"
                            checked={formData.deliveryOption === 'pickup'}
                            onChange={handleChange}
                            className="mr-3 w-4 h-4 text-yellow-600 focus:ring-yellow-500"
                        />
                        <span className="text-base">Pickup</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="deliveryOption"
                            value="delivery"
                            checked={formData.deliveryOption === 'delivery'}
                            onChange={handleChange}
                            className="mr-3 w-4 h-4 text-yellow-600 focus:ring-yellow-500"
                        />
                        <span className="text-base">Delivery</span>
                    </label>
                </div>
            </div>

            {/* Delivery Address (conditional) */}
            {formData.deliveryOption === 'delivery' && (
                <div className="mb-6 sm:mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address *</label>
                    <textarea
                        name="deliveryAddress"
                        required={formData.deliveryOption === 'delivery'}
                        value={formData.deliveryAddress}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                        placeholder="Please provide complete delivery address including city, state, and zip code"
                    />
                </div>
            )}

            {/* Target Budget */}
            <div className="mb-6 sm:mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Budget</label>
                <select
                    name="targetBudget"
                    value={formData.targetBudget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                >
                    <option value="">Select budget range</option>
                    <option value="200-300">$200 - $300</option>
                    <option value="300-500">$300 - $500</option>
                    <option value="500-750">$500 - $750</option>
                    <option value="750-1000">$750 - $1,000</option>
                    <option value="over-1000">Over $1,000</option>
                </select>
            </div>

            {/* Contact Preferences */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Best Contact Method</label>
                    <select
                        name="contactMethod"
                        value={formData.contactMethod}
                        onChange={handleChange}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                    >
                        <option value="">Select preferred method</option>
                        <option value="phone">Phone Call</option>
                        <option value="text">Text Message</option>
                        <option value="email">Email</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Best Time to Contact</label>
                    <input
                        type="text"
                        name="contactTime"
                        value={formData.contactTime}
                        onChange={handleChange}
                        placeholder="e.g., After 5 PM, Weekends only"
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                    />
                </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6 sm:mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Payment Method</label>
                <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                >
                    <option value="">Select payment method</option>
                    <option value="credit-card">Credit Card</option>
                    <option value="cash">Zelle</option>
                    <option value="paypal">PayPal</option>
                    <option value="venmo">Venmo</option>
                    <option value="zelle">Zelle</option>
                    <option value="bank-transfer">Bank Transfer</option>
                    <option value="cash">Cash</option>
                </select>
            </div>

            {/* Description */}
            <div className="mb-6 sm:mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Please be as detailed as possible)</label>
                <textarea
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your cake design, flavors, colors, etc."
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                />
            </div>

            {/* Date */}
            <div className="mb-8 sm:mb-10">
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Needed *</label>
                <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                />
            </div>

            <div className="text-center">
                <button
                    type="submit"
                    className="btn-primary"
                >
                    Submit Request
                </button>
            </div>
        </form>
    );
}