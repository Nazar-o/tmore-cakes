'use client';

import { useState, useRef } from 'react';

const standardFlavors = [
    'Vanilla',
    'Red Velvet',
    'Dark Chocolate',
    'Zesty Lemon',
    'Classic Wedding Cake',
    'Almond'
];

const specialtyFlavors = [
    'Carrot',
    'Strawberry',
    'Cookies & Cream',
    'Raspberry',
    'Piña Colada',
    'Guinness Chocolate Fudge',
    'Italian Cream Cake'
];

const frostingOptions = [
    'Chocolate',
    'Mocha',
    'Mint Chocolate Chip',
    'Strawberry',
    'Cookies & Cream',
    'Zesty Lemon',
    'Almond',
    'Vanilla',
    'Cream Cheese'
];

export default function CakeForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        size: '',
        occasion: '',
        occasionOther: '', // For "other" option
        description: '',
        date: '',
        inspirationPhotos: [] as File[],
        deliveryOption: '',
        deliveryAddress: '',
        targetBudget: '',
        contactMethod: '',
        contactTime: '',
        paymentMethod: '',
        inscription: '',
        topper: '',
        flavors: [] as string[],
        frostings: [] as string[]
    });

    const [fileSizeErrors, setFileSizeErrors] = useState<string[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Create FormData for file upload
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('email', formData.email);
            submitData.append('phone', formData.phone);
            submitData.append('size', formData.size);
            submitData.append('occasion', formData.occasion);
            if (formData.occasion === 'other' && formData.occasionOther) {
                submitData.append('occasionOther', formData.occasionOther);
            }
            submitData.append('description', formData.description);
            submitData.append('date', formData.date);
            submitData.append('deliveryOption', formData.deliveryOption);
            submitData.append('deliveryAddress', formData.deliveryAddress);
            submitData.append('targetBudget', formData.targetBudget);
            submitData.append('contactMethod', formData.contactMethod);
            submitData.append('contactTime', formData.contactTime);
            submitData.append('paymentMethod', formData.paymentMethod);
            submitData.append('inscription', formData.inscription);
            submitData.append('topper', formData.topper);
            submitData.append('flavors', JSON.stringify(formData.flavors));
            submitData.append('frostings', JSON.stringify(formData.frostings));

            // Append multiple inspiration photos
            console.log('Submitting form with inspiration photos:', formData.inspirationPhotos.length);
            formData.inspirationPhotos.forEach((photo, index) => {
                console.log(`Appending photo ${index}:`, photo.name, photo.size, photo.type);
                submitData.append(`inspirationPhoto_${index}`, photo);
            });
            submitData.append('inspirationPhotoCount', formData.inspirationPhotos.length.toString());
            console.log('FormData entries:', Array.from(submitData.entries()).map(([key, value]) =>
                [key, value instanceof File ? `${value.name} (${value.size} bytes)` : value]
            ));

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
                    size: '',
                    occasion: '',
                    occasionOther: '',
                    description: '',
                    date: '',
                    inspirationPhotos: [],
                    deliveryOption: '',
                    deliveryAddress: '',
                    targetBudget: '',
                    contactMethod: '',
                    contactTime: '',
                    paymentMethod: '',
                    inscription: '',
                    topper: '',
                    flavors: [],
                    frostings: []
                });
            } else {
                // Handle both JSON and non-JSON error responses
                let errorMessage = 'An error occurred while submitting your request.';

                // Clone the response so we can read it multiple times if needed
                const responseClone = response.clone();

                try {
                    // Try to parse as JSON first
                    const error = await response.json();
                    errorMessage = error.message || errorMessage;
                } catch (e) {
                    // If JSON parsing fails, try to get text from the clone
                    try {
                        const text = await responseClone.text();
                        if (text) {
                            errorMessage = `Server error (${response.status}): ${text.substring(0, 100)}`;
                        } else {
                            errorMessage = `Server error (${response.status}): ${response.statusText}`;
                        }
                    } catch (textError) {
                        // If both fail, use status text
                        errorMessage = `Server error (${response.status}): ${response.statusText || 'Unknown error'}`;
                    }
                }
                alert(`Error: ${errorMessage}`);
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

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
            const validFiles: File[] = [];
            const errors: string[] = [];

            files.forEach((file) => {
                if (file.size > MAX_FILE_SIZE) {
                    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
                    errors.push(`${file.name} (${fileSizeMB} MB) exceeds the 50MB limit`);
                } else {
                    validFiles.push(file);
                }
            });

            if (errors.length > 0) {
                setFileSizeErrors([...fileSizeErrors, ...errors]);
                // Show alert for files that are too large
                alert(`The following image(s) are too large (over 50MB) and cannot be uploaded:\n\n${errors.join('\n')}\n\nPlease compress or resize these images and try again.`);
            } else {
                // Clear errors if all new files are valid
                if (errors.length === 0 && fileSizeErrors.length > 0) {
                    setFileSizeErrors([]);
                }
            }

            if (validFiles.length > 0) {
                setFormData({
                    ...formData,
                    inspirationPhotos: [...formData.inspirationPhotos, ...validFiles]
                });
            }

            // Reset the input so the same file can be selected again if needed
            if (e.target) {
                e.target.value = '';
            }
        }
    };

    const handleAddMorePhotos = () => {
        fileInputRef.current?.click();
    };

    // Get base price from size
    const getBasePriceFromSize = (size: string): number => {
        const priceMap: { [key: string]: number } = {
            '8-inch': 216,
            '9-inch': 288,
            '10-inch': 342,
            '12-inch': 486,
            'double-barrel-6': 252,
            '2-tier-5-7': 270,
            '2-tier-6-8': 360,
            '2-tier-7-9': 468,
            '2-tier-8-10': 558,
            '3-tier-4-6-8': 450,
            '3-tier-5-7-9': 558,
            '3-tier-6-8-10': 702,
            '3-tier-8-10-12': 1044
        };
        return priceMap[size] || 0;
    };

    const getMaxFlavors = () => {
        const size = formData.size;

        // "Other" size allows up to 5 flavors
        if (size === 'other') {
            return 5;
        }

        const basePrice = getBasePriceFromSize(size);

        // Orders over $400 allow 4-5 flavors
        if (basePrice >= 400) {
            return 5;
        }

        // Standard limits based on size
        if (size === '8-inch' || size === '9-inch') return 2;
        if (size === '10-inch') return 3;
        if (size === '12-inch') return 3;
        if (size.startsWith('2-tier') || size.startsWith('3-tier')) return 3; // Tiered cakes: 1 per tier OR 2-3 total
        if (size === 'double-barrel-6') return 2;
        return 0;
    };

    const handleFlavorChange = (flavor: string, checked: boolean) => {
        const maxFlavors = getMaxFlavors();
        if (checked) {
            if (formData.flavors.length < maxFlavors) {
                setFormData({
                    ...formData,
                    flavors: [...formData.flavors, flavor]
                });
            }
        } else {
            setFormData({
                ...formData,
                flavors: formData.flavors.filter(f => f !== flavor)
            });
        }
    };

    const handleFrostingChange = (frosting: string, checked: boolean) => {
        const maxFrostings = 2;
        if (checked) {
            if (formData.frostings.length < maxFrostings) {
                setFormData({
                    ...formData,
                    frostings: [...formData.frostings, frosting]
                });
            }
        } else {
            setFormData({
                ...formData,
                frostings: formData.frostings.filter(f => f !== frosting)
            });
        }
    };

    // Reset flavors when size changes
    const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({
            ...formData,
            size: e.target.value,
            flavors: [] // Reset flavors when size changes
        });
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                    <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                        placeholder="(555) 123-4567"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Size *</label>
                    <select
                        name="size"
                        required
                        value={formData.size}
                        onChange={handleSizeChange}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                    >
                        <option value="">Select size</option>
                        <optgroup label="Single Tier (Round)">
                            <option value="8-inch">8-inch (24–28 servings) — from $216</option>
                            <option value="9-inch">9-inch (32–38 servings) — from $288</option>
                            <option value="10-inch">10-inch (38–42 servings) — from $342</option>
                            <option value="12-inch">12-inch (54–58 servings) — from $486</option>
                        </optgroup>
                        <optgroup label="Double Barrel">
                            <option value="double-barrel-6">Double Barrel 6-inch (28–30 servings) — from $252</option>
                        </optgroup>
                        <optgroup label="2-Tier Cakes">
                            <option value="2-tier-5-7">2-Tier: 5-inch + 7-inch — from $270</option>
                            <option value="2-tier-6-8">2-Tier: 6-inch + 8-inch — from $360</option>
                            <option value="2-tier-7-9">2-Tier: 7-inch + 9-inch — from $468</option>
                            <option value="2-tier-8-10">2-Tier: 8-inch + 10-inch — from $558</option>
                        </optgroup>
                        <optgroup label="3-Tier Cakes">
                            <option value="3-tier-4-6-8">3-Tier: 4-inch + 6-inch + 8-inch — from $450</option>
                            <option value="3-tier-5-7-9">3-Tier: 5-inch + 7-inch + 9-inch — from $558</option>
                            <option value="3-tier-6-8-10">3-Tier: 6-inch + 8-inch + 10-inch — from $702</option>
                            <option value="3-tier-8-10-12">3-Tier: 8-inch + 10-inch + 12-inch — from $1,044</option>
                        </optgroup>
                        <option value="other">Other size combinations available: contact for pricing.</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Occasion *</label>
                    <select
                        name="occasion"
                        required
                        value={formData.occasion}
                        onChange={handleChange}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                    >
                        <option value="">Select occasion</option>
                        <option value="birthday">Birthday</option>
                        <option value="wedding">Wedding</option>
                        <option value="anniversary">Anniversary</option>
                        <option value="custom">Custom Design</option>
                        <option value="other">Other</option>
                    </select>
                    {formData.occasion === 'other' && (
                        <input
                            type="text"
                            name="occasionOther"
                            required
                            value={formData.occasionOther}
                            onChange={handleChange}
                            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors mt-2"
                            placeholder="Please specify the occasion"
                        />
                    )}
                </div>
            </div>

            {/* Flavor Selection */}
            <div className={`mb-6 sm:mb-8 ${!formData.size ? 'opacity-50 pointer-events-none' : ''}`}>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Flavors * {formData.size ? `(Up to ${getMaxFlavors()} flavors)` : '(Select size first)'}
                    {formData.size && (formData.size.startsWith('2-tier') || formData.size.startsWith('3-tier')) && (
                        <span className="text-xs text-gray-500 block mt-1">1 flavor per tier OR 2-3 total (your choice)</span>
                    )}
                    {formData.size === 'other' && (
                        <span className="text-xs text-yellow-600 font-medium block mt-1">⚠️ Price may vary based on size and complexity</span>
                    )}
                </label>

                {/* Standard Flavors */}
                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Standard Flavors (Included)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {standardFlavors.map((flavor) => (
                            <label key={flavor} className={`flex items-center p-2 rounded ${!formData.size ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}>
                                <input
                                    type="checkbox"
                                    checked={formData.flavors.includes(flavor)}
                                    onChange={(e) => handleFlavorChange(flavor, e.target.checked)}
                                    disabled={!formData.size || (!formData.flavors.includes(flavor) && formData.flavors.length >= getMaxFlavors())}
                                    className="mr-3 w-4 h-4 text-yellow-600 focus:ring-yellow-500 rounded"
                                />
                                <span className="text-sm text-gray-700">{flavor}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Specialty Flavors */}
                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Specialty Flavors (+$15 each)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {specialtyFlavors.map((flavor) => (
                            <label key={flavor} className={`flex items-center p-2 rounded ${!formData.size || formData.size === 'other' ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}>
                                <input
                                    type="checkbox"
                                    checked={formData.flavors.includes(flavor)}
                                    onChange={(e) => handleFlavorChange(flavor, e.target.checked)}
                                    disabled={!formData.size || formData.size === 'other' || (!formData.flavors.includes(flavor) && formData.flavors.length >= getMaxFlavors())}
                                    className="mr-3 w-4 h-4 text-yellow-600 focus:ring-yellow-500 rounded"
                                />
                                <span className="text-sm text-gray-700">{flavor}</span>
                                <span className="text-xs text-purple-600 ml-2">(+$15)</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Selected Flavors Display */}
                {formData.flavors.length > 0 && formData.size && (
                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm font-semibold text-gray-900 mb-2">Selected Flavors ({formData.flavors.length}/{getMaxFlavors()}):</p>
                        <div className="flex flex-wrap gap-2">
                            {formData.flavors.map((flavor) => (
                                <span
                                    key={flavor}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800"
                                >
                                    {flavor}
                                    {specialtyFlavors.includes(flavor) && (
                                        <span className="ml-1 text-xs">(+$15)</span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleFlavorChange(flavor, false)}
                                        className="ml-2 text-yellow-600 hover:text-yellow-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Frosting/Filling Selection */}
            <div className="mb-6 sm:mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frosting/Filling Selection * (Up to 2 choices)
                </label>
                <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm font-semibold text-gray-900 mb-1">Tmore's Signature Silk Buttercream/Frosting</p>
                    <p className="text-xs text-gray-600 italic">(A smooth, stable Swiss meringue–style buttercream with a hint of white chocolate ganache.)</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {frostingOptions.map((frosting) => (
                        <label key={frosting} className="flex items-center cursor-pointer p-2 rounded hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={formData.frostings.includes(frosting)}
                                onChange={(e) => handleFrostingChange(frosting, e.target.checked)}
                                disabled={!formData.frostings.includes(frosting) && formData.frostings.length >= 2}
                                className="mr-3 w-4 h-4 text-yellow-600 focus:ring-yellow-500 rounded"
                            />
                            <span className="text-sm text-gray-700">{frosting}</span>
                        </label>
                    ))}
                </div>

                {/* Selected Frostings Display */}
                {formData.frostings.length > 0 && (
                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm font-semibold text-gray-900 mb-2">Selected Frostings ({formData.frostings.length}/2):</p>
                        <div className="flex flex-wrap gap-2">
                            {formData.frostings.map((frosting) => (
                                <span
                                    key={frosting}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800"
                                >
                                    {frosting}
                                    <button
                                        type="button"
                                        onClick={() => handleFrostingChange(frosting, false)}
                                        className="ml-2 text-yellow-600 hover:text-yellow-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Inspiration Photos */}
            <div className="mb-6 sm:mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Inspiration Photos</label>
                <input
                    ref={fileInputRef}
                    type="file"
                    name="inspirationPhotos"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-3 text-base border-2 border-dashed border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors hover:border-yellow-400 hover:bg-yellow-50 text-gray-700 font-medium"
                >
                    {formData.inspirationPhotos.length === 0 ? 'Choose Images' : 'Add More Images'}
                </button>
                <p className="text-sm text-gray-500 mt-2">Upload one or more images that inspire your cake design (max 50MB per image)</p>
                {fileSizeErrors.length > 0 && (
                    <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm font-semibold text-red-800 mb-2">⚠️ Files Too Large:</p>
                        <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                            {fileSizeErrors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                        <p className="text-xs text-red-600 mt-2">Please compress or resize these images to under 50MB each.</p>
                    </div>
                )}
                {formData.inspirationPhotos.length > 0 && (
                    <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                            Selected: {formData.inspirationPhotos.length} {formData.inspirationPhotos.length === 1 ? 'image' : 'images'}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {formData.inspirationPhotos.map((photo, index) => {
                                const fileSizeMB = (photo.size / (1024 * 1024)).toFixed(2);
                                const isOverLimit = photo.size > 50 * 1024 * 1024;
                                return (
                                    <div key={index} className="relative">
                                        <img
                                            src={URL.createObjectURL(photo)}
                                            alt={`Preview ${index + 1}`}
                                            className={`w-20 h-20 object-cover rounded border ${isOverLimit ? 'border-red-500 border-2' : 'border-gray-300'}`}
                                        />
                                        <div className={`absolute bottom-0 left-0 right-0 text-white text-xs px-1 py-0.5 rounded-b text-center ${isOverLimit ? 'bg-red-600' : 'bg-black bg-opacity-60'}`}>
                                            {fileSizeMB} MB
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newPhotos = formData.inspirationPhotos.filter((_, i) => i !== index);
                                                setFormData({ ...formData, inspirationPhotos: newPhotos });
                                                // Clear errors if all files are removed
                                                if (newPhotos.length === 0) {
                                                    setFileSizeErrors([]);
                                                } else {
                                                    // Remove error for this file if it exists
                                                    setFileSizeErrors(fileSizeErrors.filter(err => !err.includes(photo.name)));
                                                }
                                            }}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                        >
                                            ×
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                        <button
                            type="button"
                            onClick={handleAddMorePhotos}
                            className="mt-3 px-4 py-2 text-sm font-medium text-yellow-600 hover:text-yellow-700 border border-yellow-300 rounded-lg hover:bg-yellow-50 transition-colors"
                        >
                            + Add More Photos
                        </button>
                    </div>
                )}
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
                <p className="text-sm text-gray-500 mt-2">Delivery fees are calculated based on distance and are recommended for 2-tier cakes or larger.</p>
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
                    <option value="credit-debit-card">Credit/Debit Card</option>
                    <option value="zelle">Zelle</option>
                    <option value="apple-pay">Apple Pay</option>
                    <option value="google-pay">Google Pay</option>
                </select>
            </div>

            {/* Inscription */}
            <div className="mb-6 sm:mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Inscription needed?</label>
                <textarea
                    name="inscription"
                    rows={2}
                    value={formData.inscription}
                    onChange={handleChange}
                    placeholder="Enter inscription details (name, age, short message) or leave blank if no inscription is needed."
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                />
            </div>

            {/* Topper */}
            <div className="mb-6 sm:mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">Topper?</label>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-6">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="topper"
                            value="yes"
                            checked={formData.topper === 'yes'}
                            onChange={handleChange}
                            className="mr-3 w-4 h-4 text-yellow-600 focus:ring-yellow-500"
                        />
                        <span className="text-base">Yes</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="topper"
                            value="no"
                            checked={formData.topper === 'no'}
                            onChange={handleChange}
                            className="mr-3 w-4 h-4 text-yellow-600 focus:ring-yellow-500"
                        />
                        <span className="text-base">No</span>
                    </label>
                </div>
            </div>

            {/* Description */}
            <div className="mb-6 sm:mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Please be as detailed as possible)</label>
                <textarea
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your cake design, colors, decorations, etc."
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
                <p className="text-sm text-gray-600 mb-4">
                    By submitting this form, you agree to our{' '}
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-yellow-600 hover:text-yellow-700 underline">
                        Terms & Conditions
                    </a>
                    .
                </p>
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