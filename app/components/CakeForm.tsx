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
            <h2 className="text-2xl font-bold mb-6 text-center">Request Your Custom Cake</h2>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cake Type *</label>
                    <select
                        name="cakeType"
                        required
                        value={formData.cakeType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select cake type</option>
                        <option value="birthday">Birthday Cake</option>
                        <option value="wedding">Wedding Cake</option>
                        <option value="anniversary">Anniversary Cake</option>
                        <option value="custom">Custom Design</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Size *</label>
                    <select
                        name="size"
                        required
                        value={formData.size}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Occasion</label>
                    <input
                        type="text"
                        name="occasion"
                        value={formData.occasion}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Dietary Restrictions */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Restrictions/Allergies</label>
                <input
                    type="text"
                    name="dietaryRestrictions"
                    value={formData.dietaryRestrictions}
                    onChange={handleChange}
                    placeholder="e.g., Gluten-free, Nut allergy, Vegan"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Inspiration Photo */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Inspiration Photo</label>
                <input
                    type="file"
                    name="inspirationPhoto"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">Upload an image that inspires your cake design</p>
            </div>

            {/* Delivery/Pickup Options */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery or Pickup *</label>
                <div className="flex space-x-4">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="deliveryOption"
                            value="pickup"
                            checked={formData.deliveryOption === 'pickup'}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <span>Pickup</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="deliveryOption"
                            value="delivery"
                            checked={formData.deliveryOption === 'delivery'}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <span>Delivery</span>
                    </label>
                </div>
            </div>

            {/* Delivery Address (conditional) */}
            {formData.deliveryOption === 'delivery' && (
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
                    <textarea
                        name="deliveryAddress"
                        required={formData.deliveryOption === 'delivery'}
                        value={formData.deliveryAddress}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Please provide complete delivery address including city, state, and zip code"
                    />
                </div>
            )}

            {/* Target Budget */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Budget</label>
                <select
                    name="targetBudget"
                    value={formData.targetBudget}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Best Contact Method</label>
                    <select
                        name="contactMethod"
                        value={formData.contactMethod}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select preferred method</option>
                        <option value="phone">Phone Call</option>
                        <option value="text">Text Message</option>
                        <option value="email">Email</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Best Time to Contact</label>
                    <input
                        type="text"
                        name="contactTime"
                        value={formData.contactTime}
                        onChange={handleChange}
                        placeholder="e.g., After 5 PM, Weekends only"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Payment Method */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Payment Method</label>
                <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Please be as detailed as possible)</label>
                <textarea
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your cake design, flavors, colors, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Date */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Needed *</label>
                <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="text-center">
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Submit Request
                </button>
            </div>
        </form>
    );
}