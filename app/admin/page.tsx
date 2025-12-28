'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/app/lib/supabaseClient';
import PriceModal from '@/app/components/PriceModal';

interface CakeOrder {
    id: string;
    name: string;
    email: string;
    phone?: string;
    cake_type: string;
    size: string;
    occasion?: string;
    description?: string;
    date_needed: string;
    inscription?: string;
    topper?: string;
    flavors?: string;
    frostings?: string;
    delivery_option?: string;
    delivery_address?: string;
    target_budget?: string;
    contact_method?: string;
    contact_time?: string;
    payment_method?: string;
    inspiration_photo_urls?: string[] | null;
    final_price?: number;
    status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
    created_at: string;
    updated_at?: string;
}

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('calendar');
    const [orderFilter, setOrderFilter] = useState('all');
    // Flavor and frosting options (matching CakeForm)
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

    const [calculatorData, setCalculatorData] = useState({
        cakeSize: '',
        flavors: [] as string[],
        frostings: [] as string[],
        laborHours: 0,
        delivery: false,
        setup: false,
        decor: 0
    });

    const [orders, setOrders] = useState<CakeOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingOrder, setEditingOrder] = useState<CakeOrder | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [viewingOrder, setViewingOrder] = useState<CakeOrder | null>(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [orderPrice, setOrderPrice] = useState<{ [key: string]: number }>({});
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [selectedOrderForPrice, setSelectedOrderForPrice] = useState<CakeOrder | null>(null);

    // Password change state
    const [passwordChangeData, setPasswordChangeData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordChangeError, setPasswordChangeError] = useState('');
    const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Gallery state
    const [galleryImages, setGalleryImages] = useState<any[]>([]);
    const [galleryLoading, setGalleryLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [pendingUploadFile, setPendingUploadFile] = useState<File | null>(null);
    const categoryOptions = ['Birthday', 'Kids', 'Wedding', 'Specialty', 'Baby Shower'];

    // Fetch orders from database
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data, error } = await supabase
                    .from('cake_orders')
                    .select('*')
                    .order('date_needed', { ascending: true });

                if (error) {
                    console.error('Error fetching orders:', error);
                } else {
                    // Ensure inspiration_photo_urls is parsed correctly if it's a string
                    const processedData = (data || []).map(order => {
                        let processedPhotoUrls: string[] | null = null;

                        if (order.inspiration_photo_urls) {
                            if (typeof order.inspiration_photo_urls === 'string') {
                                try {
                                    const parsed = JSON.parse(order.inspiration_photo_urls);
                                    processedPhotoUrls = Array.isArray(parsed) ? parsed : [parsed];
                                } catch (e) {
                                    console.error('Error parsing inspiration_photo_urls in fetchOrders:', e);
                                    processedPhotoUrls = [order.inspiration_photo_urls];
                                }
                            } else if (Array.isArray(order.inspiration_photo_urls)) {
                                processedPhotoUrls = order.inspiration_photo_urls.filter((url: string) => url && url.trim() !== '');
                            }
                        }

                        return {
                            ...order,
                            inspiration_photo_urls: processedPhotoUrls
                        };
                    });
                    setOrders(processedData);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
        fetchGalleryImages();
    }, []);

    // Gallery functions
    const fetchGalleryImages = async () => {
        try {
            setGalleryLoading(true);
            const { data, error } = await supabase
                .from('gallery_images')
                .select('*')
                .order('display_order', { ascending: true })
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching gallery images:', error);
            } else {
                setGalleryImages(data || []);
            }
        } catch (error) {
            console.error('Error fetching gallery images:', error);
        } finally {
            setGalleryLoading(false);
        }
    };

    const uploadGalleryImage = async (file: File, category: string) => {
        try {
            setUploading(true);

            // Upload to Supabase storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('gallery-photos')
                .upload(fileName, file);

            if (uploadError) {
                console.error('File upload error:', uploadError);
                alert('Failed to upload image');
                return;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('gallery-photos')
                .getPublicUrl(fileName);

            // Save to database
            const { error: dbError } = await supabase
                .from('gallery_images')
                .insert([{
                    image_url: publicUrl,
                    category: category,
                    is_featured: false,
                    display_order: galleryImages.length
                }]);

            if (dbError) {
                console.error('Database error:', dbError);
                alert('Failed to save image metadata');
                return;
            }

            // Refresh gallery
            fetchGalleryImages();
            alert('Image uploaded successfully!');
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const deleteGalleryImage = async (imageId: string, imageUrl: string) => {
        if (!confirm('Are you sure you want to delete this image?')) {
            return;
        }

        try {
            // Extract filename from URL
            const urlParts = imageUrl.split('/');
            const fileName = urlParts[urlParts.length - 1];

            // Delete from storage
            const { error: storageError } = await supabase.storage
                .from('gallery-photos')
                .remove([fileName]);

            if (storageError) {
                console.error('Storage deletion error:', storageError);
            }

            // Delete from database
            const { error: dbError } = await supabase
                .from('gallery_images')
                .delete()
                .eq('id', imageId);

            if (dbError) {
                console.error('Database deletion error:', dbError);
                alert('Failed to delete image');
                return;
            }

            // Refresh gallery
            fetchGalleryImages();
            alert('Image deleted successfully!');
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('Failed to delete image');
        }
    };

    const toggleFeatured = async (imageId: string, currentFeatured: boolean) => {
        try {
            const { error } = await supabase
                .from('gallery_images')
                .update({ is_featured: !currentFeatured })
                .eq('id', imageId);

            if (error) {
                console.error('Error updating featured status:', error);
                alert('Failed to update featured status');
                return;
            }

            // Refresh gallery
            fetchGalleryImages();
        } catch (error) {
            console.error('Error updating featured status:', error);
            alert('Failed to update featured status');
        }
    };

    // Get max flavors based on size (matching CakeForm logic)
    const getMaxFlavors = () => {
        const size = calculatorData.cakeSize;

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
        if (size.startsWith('2-tier') || size.startsWith('3-tier')) return 3;
        if (size === 'double-barrel-6') return 2;
        return 0;
    };

    // Extract base price from size option text
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

    const calculateCost = () => {
        let baseCost = getBasePriceFromSize(calculatorData.cakeSize);
        let laborCost = calculatorData.laborHours * 25; // $25/hour
        let decorCost = calculatorData.decor;
        let deliveryCost = calculatorData.delivery ? 50 : 0;
        let setupCost = calculatorData.setup ? 75 : 0;

        // Calculate specialty flavor cost (+$15 each)
        const specialtyFlavorCount = calculatorData.flavors.filter(f => specialtyFlavors.includes(f)).length;
        const specialtyFlavorCost = specialtyFlavorCount * 15;

        const totalCost = baseCost + specialtyFlavorCost + laborCost + decorCost + deliveryCost + setupCost;
        const profit = totalCost * 0.3; // 30% profit margin
        const finalPrice = totalCost + profit;

        return { totalCost, profit, finalPrice, baseCost, specialtyFlavorCost };
    };

    const handleCalculatorFlavorChange = (flavor: string, checked: boolean) => {
        const maxFlavors = getMaxFlavors();
        if (checked) {
            if (calculatorData.flavors.length < maxFlavors) {
                setCalculatorData({
                    ...calculatorData,
                    flavors: [...calculatorData.flavors, flavor]
                });
            }
        } else {
            setCalculatorData({
                ...calculatorData,
                flavors: calculatorData.flavors.filter(f => f !== flavor)
            });
        }
    };

    const handleCalculatorFrostingChange = (frosting: string, checked: boolean) => {
        const maxFrostings = 2;
        if (checked) {
            if (calculatorData.frostings.length < maxFrostings) {
                setCalculatorData({
                    ...calculatorData,
                    frostings: [...calculatorData.frostings, frosting]
                });
            }
        } else {
            setCalculatorData({
                ...calculatorData,
                frostings: calculatorData.frostings.filter(f => f !== frosting)
            });
        }
    };

    const handleCalculatorSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCalculatorData({
            ...calculatorData,
            cakeSize: e.target.value,
            flavors: [] // Reset flavors when size changes
        });
    };

    const { totalCost, profit, finalPrice, baseCost, specialtyFlavorCost } = calculateCost();

    // Helper function to format date strings correctly (avoiding timezone issues)
    const formatDate = (dateString: string): string => {
        // Parse date string as local date (YYYY-MM-DD format)
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString();
    };

    // Helper function to create a date object from date string (local timezone)
    const parseDateString = (dateString: string): Date => {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    // Filter orders based on selected filter
    const getFilteredOrders = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        switch (orderFilter) {
            case 'upcoming':
                return orders.filter(order => {
                    const orderDate = parseDateString(order.date_needed);
                    orderDate.setHours(0, 0, 0, 0);
                    return orderDate >= today && ['pending', 'approved', 'in_progress'].includes(order.status);
                });
            case 'unapproved':
                return orders.filter(order => order.status === 'pending');
            case 'completed':
                return orders.filter(order => order.status === 'completed');
            case 'cancelled':
                return orders.filter(order => order.status === 'cancelled');
            default:
                return orders;
        }
    };

    const filteredOrders = getFilteredOrders();

    // Order management functions
    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('cake_orders')
                .update({
                    status: newStatus,
                    updated_at: new Date().toISOString()
                })
                .eq('id', orderId);

            if (error) {
                console.error('Error updating order:', error);
                alert('Failed to update order status');
                return;
            }

            // Update local state
            setOrders(orders.map(order =>
                order.id === orderId
                    ? { ...order, status: newStatus as any, updated_at: new Date().toISOString() }
                    : order
            ));
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Failed to update order status');
        }
    };

    const deleteOrder = async (orderId: string) => {
        if (!confirm('Are you sure you want to delete this order?')) {
            return;
        }

        try {
            const { error } = await supabase
                .from('cake_orders')
                .delete()
                .eq('id', orderId);

            if (error) {
                console.error('Error deleting order:', error);
                alert('Failed to delete order');
                return;
            }

            // Update local state
            setOrders(orders.filter(order => order.id !== orderId));
        } catch (error) {
            console.error('Error deleting order:', error);
            alert('Failed to delete order');
        }
    };

    const editOrder = (order: CakeOrder) => {
        setEditingOrder(order);
        setShowEditModal(true);
    };

    const viewOrder = (order: CakeOrder) => {
        // Ensure inspiration_photo_urls is parsed correctly if it's a string
        let processedPhotoUrls: string[] | null = null;

        if (order.inspiration_photo_urls) {
            if (typeof order.inspiration_photo_urls === 'string') {
                try {
                    const parsed = JSON.parse(order.inspiration_photo_urls);
                    processedPhotoUrls = Array.isArray(parsed) ? parsed : [parsed];
                } catch (e) {
                    console.error('Error parsing inspiration_photo_urls:', e);
                    // If parsing fails, try treating it as a single URL
                    processedPhotoUrls = [order.inspiration_photo_urls];
                }
            } else if (Array.isArray(order.inspiration_photo_urls)) {
                processedPhotoUrls = order.inspiration_photo_urls.filter(url => url && url.trim() !== '');
            }
        }

        const processedOrder = {
            ...order,
            inspiration_photo_urls: processedPhotoUrls
        };

        console.log('View order - Original:', order.inspiration_photo_urls);
        console.log('View order - Processed:', processedPhotoUrls);

        setViewingOrder(processedOrder);
        setShowViewModal(true);
    };

    const openPriceModal = (order: CakeOrder) => {
        setSelectedOrderForPrice(order);
        setShowPriceModal(true);
    };

    const setPrice = async (orderId: string, price: number) => {
        try {
            const { error } = await supabase
                .from('cake_orders')
                .update({
                    final_price: price,
                    updated_at: new Date().toISOString()
                })
                .eq('id', orderId);

            if (error) {
                console.error('Error setting price:', error);
                alert('Failed to set price');
                return;
            }

            // Update local state
            setOrderPrice({ ...orderPrice, [orderId]: price });
            setOrders(orders.map(order =>
                order.id === orderId
                    ? { ...order, final_price: price, updated_at: new Date().toISOString() }
                    : order
            ));
        } catch (error) {
            console.error('Error setting price:', error);
            alert('Failed to set price');
        }
    };

    const handlePriceConfirm = (price: number) => {
        if (selectedOrderForPrice) {
            setPrice(selectedOrderForPrice.id, price);
        }
    };

    const exportToCSV = () => {
        const headers = [
            'ID', 'Name', 'Email', 'Phone', 'Cake Type', 'Size', 'Occasion',
            'Description', 'Date Needed', 'Inscription', 'Topper', 'Flavors', 'Frostings', 'Delivery Option',
            'Delivery Address', 'Target Budget', 'Contact Method', 'Contact Time',
            'Payment Method', 'Status', 'Final Price', 'Created At', 'Updated At'
        ];

        const csvData = orders.map(order => [
            order.id,
            order.name,
            order.email,
            order.phone || '',
            order.cake_type,
            order.size,
            order.occasion || '',
            order.description || '',
            order.date_needed,
            order.inscription || '',
            order.topper || '',
            order.flavors ? (typeof order.flavors === 'string' ? order.flavors : JSON.stringify(order.flavors)) : '',
            order.frostings ? (typeof order.frostings === 'string' ? order.frostings : JSON.stringify(order.frostings)) : '',
            order.delivery_option || '',
            order.delivery_address || '',
            order.target_budget || '',
            order.contact_method || '',
            order.contact_time || '',
            order.payment_method || '',
            order.status,
            order.final_price || '',
            order.created_at,
            order.updated_at || order.created_at
        ]);

        const csvContent = [headers, ...csvData]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cake-orders-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const saveOrder = async (updatedOrder: CakeOrder) => {
        try {
            const { error } = await supabase
                .from('cake_orders')
                .update({
                    ...updatedOrder,
                    updated_at: new Date().toISOString()
                })
                .eq('id', updatedOrder.id);

            if (error) {
                console.error('Error updating order:', error);
                alert('Failed to update order');
                return;
            }

            // Update local state
            setOrders(orders.map(order =>
                order.id === updatedOrder.id ? updatedOrder : order
            ));

            setShowEditModal(false);
            setEditingOrder(null);
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Failed to update order');
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordChangeError('');
        setPasswordChangeSuccess('');

        // Validation
        if (!passwordChangeData.currentPassword || !passwordChangeData.newPassword || !passwordChangeData.confirmPassword) {
            setPasswordChangeError('All fields are required');
            return;
        }

        if (passwordChangeData.newPassword.length < 6) {
            setPasswordChangeError('New password must be at least 6 characters long');
            return;
        }

        if (passwordChangeData.newPassword !== passwordChangeData.confirmPassword) {
            setPasswordChangeError('New passwords do not match');
            return;
        }

        if (passwordChangeData.currentPassword === passwordChangeData.newPassword) {
            setPasswordChangeError('New password must be different from current password');
            return;
        }

        setIsChangingPassword(true);

        try {
            const adminEmail = sessionStorage.getItem('adminEmail') || '';
            const response = await fetch('/api/admin/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: adminEmail,
                    currentPassword: passwordChangeData.currentPassword,
                    newPassword: passwordChangeData.newPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setPasswordChangeError(data.message || 'Failed to change password');
                setIsChangingPassword(false);
                return;
            }

            setPasswordChangeSuccess('Password changed successfully!');
            setPasswordChangeData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

            // Clear success message after 5 seconds
            setTimeout(() => {
                setPasswordChangeSuccess('');
            }, 5000);
        } catch (error) {
            console.error('Password change error:', error);
            setPasswordChangeError('An error occurred. Please try again.');
        } finally {
            setIsChangingPassword(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Admin <span className="gradient-text">Dashboard</span>
                    </h1>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white rounded-full p-2 shadow-lg">
                        <button
                            onClick={() => setActiveTab('calculator')}
                            className={`px-6 py-3 rounded-full font-medium transition-all ${activeTab === 'calculator'
                                ? 'bg-gradient-to-r from-yellow-400 to-pink-400 text-white shadow-md'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Cost Calculator
                        </button>
                        <button
                            onClick={() => setActiveTab('calendar')}
                            className={`px-6 py-3 rounded-full font-medium transition-all ${activeTab === 'calendar'
                                ? 'bg-gradient-to-r from-yellow-400 to-pink-400 text-white shadow-md'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Cake Calendar
                        </button>
                        <button
                            onClick={() => setActiveTab('gallery')}
                            className={`px-6 py-3 rounded-full font-medium transition-all ${activeTab === 'gallery'
                                ? 'bg-gradient-to-r from-yellow-400 to-pink-400 text-white shadow-md'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Gallery
                        </button>
                        <button
                            onClick={() => setActiveTab('documents')}
                            className={`px-6 py-3 rounded-full font-medium transition-all ${activeTab === 'documents'
                                ? 'bg-gradient-to-r from-yellow-400 to-pink-400 text-white shadow-md'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Document Vault
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`px-6 py-3 rounded-full font-medium transition-all ${activeTab === 'settings'
                                ? 'bg-gradient-to-r from-yellow-400 to-pink-400 text-white shadow-md'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Account Settings
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'calculator' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Calculator Form */}
                            <div className="card">
                                <h3 className="text-2xl font-bold mb-6">Cost & Profit Calculator</h3>
                                <form className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Cake Size
                                        </label>
                                        <select
                                            value={calculatorData.cakeSize}
                                            onChange={handleCalculatorSizeChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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

                                    {/* Flavor Selection */}
                                    <div className={`${!calculatorData.cakeSize ? 'opacity-50 pointer-events-none' : ''}`}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Flavors {calculatorData.cakeSize ? `(Up to ${getMaxFlavors()} flavors)` : '(Select size first)'}
                                            {calculatorData.cakeSize === 'other' && (
                                                <span className="text-xs text-yellow-600 font-medium block mt-1">⚠️ Price may vary based on size and complexity</span>
                                            )}
                                        </label>

                                        {/* Standard Flavors */}
                                        <div className="mb-3">
                                            <h4 className="text-xs font-semibold text-gray-700 mb-2">Standard Flavors (Included)</h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                {standardFlavors.map((flavor) => (
                                                    <label key={flavor} className={`flex items-center p-2 rounded text-sm ${!calculatorData.cakeSize ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}>
                                                        <input
                                                            type="checkbox"
                                                            checked={calculatorData.flavors.includes(flavor)}
                                                            onChange={(e) => handleCalculatorFlavorChange(flavor, e.target.checked)}
                                                            disabled={!calculatorData.cakeSize || (!calculatorData.flavors.includes(flavor) && calculatorData.flavors.length >= getMaxFlavors())}
                                                            className="mr-2 w-4 h-4 text-yellow-600 focus:ring-yellow-500 rounded"
                                                        />
                                                        <span className="text-sm text-gray-700">{flavor}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Specialty Flavors */}
                                        <div className="mb-3">
                                            <h4 className="text-xs font-semibold text-gray-700 mb-2">Specialty Flavors (+$15 each)</h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                {specialtyFlavors.map((flavor) => (
                                                    <label key={flavor} className={`flex items-center p-2 rounded text-sm ${!calculatorData.cakeSize || calculatorData.cakeSize === 'other' ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}>
                                                        <input
                                                            type="checkbox"
                                                            checked={calculatorData.flavors.includes(flavor)}
                                                            onChange={(e) => handleCalculatorFlavorChange(flavor, e.target.checked)}
                                                            disabled={!calculatorData.cakeSize || calculatorData.cakeSize === 'other' || (!calculatorData.flavors.includes(flavor) && calculatorData.flavors.length >= getMaxFlavors())}
                                                            className="mr-2 w-4 h-4 text-yellow-600 focus:ring-yellow-500 rounded"
                                                        />
                                                        <span className="text-sm text-gray-700">{flavor}</span>
                                                        <span className="text-xs text-purple-600 ml-1">(+$15)</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Selected Flavors Display */}
                                        {calculatorData.flavors.length > 0 && calculatorData.cakeSize && (
                                            <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-2">
                                                <p className="text-xs font-semibold text-gray-900 mb-1">Selected: {calculatorData.flavors.length}/{getMaxFlavors()}</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {calculatorData.flavors.map((flavor) => (
                                                        <span
                                                            key={flavor}
                                                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800"
                                                        >
                                                            {flavor}
                                                            {specialtyFlavors.includes(flavor) && <span className="ml-1 text-xs">(+$15)</span>}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Frosting Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Frosting/Filling Selection (Up to 2 choices)
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {frostingOptions.map((frosting) => (
                                                <label key={frosting} className="flex items-center p-2 rounded text-sm cursor-pointer hover:bg-gray-50">
                                                    <input
                                                        type="checkbox"
                                                        checked={calculatorData.frostings.includes(frosting)}
                                                        onChange={(e) => handleCalculatorFrostingChange(frosting, e.target.checked)}
                                                        disabled={!calculatorData.frostings.includes(frosting) && calculatorData.frostings.length >= 2}
                                                        className="mr-2 w-4 h-4 text-yellow-600 focus:ring-yellow-500 rounded"
                                                    />
                                                    <span className="text-sm text-gray-700">{frosting}</span>
                                                </label>
                                            ))}
                                        </div>
                                        {calculatorData.frostings.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                {calculatorData.frostings.map((frosting) => (
                                                    <span
                                                        key={frosting}
                                                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800"
                                                    >
                                                        {frosting}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Labor Hours
                                        </label>
                                        <input
                                            type="number"
                                            value={calculatorData.laborHours}
                                            onChange={(e) => setCalculatorData({ ...calculatorData, laborHours: Number(e.target.value) })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                            min="0"
                                            step="0.5"
                                        />
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={calculatorData.delivery}
                                                onChange={(e) => setCalculatorData({ ...calculatorData, delivery: e.target.checked })}
                                                className="mr-2"
                                            />
                                            <span className="text-sm text-gray-700">Delivery</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={calculatorData.setup}
                                                onChange={(e) => setCalculatorData({ ...calculatorData, setup: e.target.checked })}
                                                className="mr-2"
                                            />
                                            <span className="text-sm text-gray-700">Setup</span>
                                        </label>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Decoration Cost
                                        </label>
                                        <input
                                            type="number"
                                            value={calculatorData.decor}
                                            onChange={(e) => setCalculatorData({ ...calculatorData, decor: Number(e.target.value) })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                            min="0"
                                            step="5"
                                        />
                                    </div>
                                </form>
                            </div>

                            {/* Results */}
                            <div className="card">
                                <h3 className="text-2xl font-bold mb-6">Cost Breakdown</h3>
                                <div className="space-y-4">
                                    {calculatorData.cakeSize && calculatorData.cakeSize !== 'other' && (
                                        <>
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="text-gray-600">Base Cost:</span>
                                                <span className="font-semibold">${baseCost.toFixed(2)}</span>
                                            </div>
                                            {specialtyFlavorCost > 0 && (
                                                <div className="flex justify-between py-2 border-b">
                                                    <span className="text-gray-600">Specialty Flavors ({calculatorData.flavors.filter(f => specialtyFlavors.includes(f)).length} × $15):</span>
                                                    <span className="font-semibold">${specialtyFlavorCost.toFixed(2)}</span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Labor ({calculatorData.laborHours} hrs × $25):</span>
                                        <span className="font-semibold">${(calculatorData.laborHours * 25).toFixed(2)}</span>
                                    </div>
                                    {calculatorData.decor > 0 && (
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-gray-600">Decorations:</span>
                                            <span className="font-semibold">${calculatorData.decor.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {((calculatorData.delivery ? 50 : 0) + (calculatorData.setup ? 75 : 0)) > 0 && (
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-gray-600">Delivery & Setup:</span>
                                            <span className="font-semibold">${((calculatorData.delivery ? 50 : 0) + (calculatorData.setup ? 75 : 0)).toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between py-2 border-b border-gray-300">
                                        <span className="text-gray-600">Total Cost:</span>
                                        <span className="font-semibold text-blue-600">${totalCost.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-300">
                                        <span className="text-gray-600">Profit (30%):</span>
                                        <span className="font-semibold text-green-600">${profit.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between py-4">
                                        <span className="text-lg font-bold text-gray-800">Final Price:</span>
                                        <span className="text-2xl font-bold text-yellow-600">${finalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'calendar' && (
                    <div className="max-w-8xl mx-auto">
                        <div className="card">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold">Order Management</h3>
                                <button className="btn-secondary">Add New Order</button>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-blue-50 p-4 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
                                    <div className="text-sm text-gray-600">Total Orders</div>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {orders.filter(order => order.status === 'pending').length}
                                    </div>
                                    <div className="text-sm text-gray-600">Pending</div>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {orders.filter(order => order.status === 'completed').length}
                                    </div>
                                    <div className="text-sm text-gray-600">Completed</div>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {orders.filter(order => {
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0);
                                            const orderDate = parseDateString(order.date_needed);
                                            orderDate.setHours(0, 0, 0, 0);
                                            return orderDate >= today && ['pending', 'approved', 'in_progress'].includes(order.status);
                                        }).length}
                                    </div>
                                    <div className="text-sm text-gray-600">Upcoming</div>
                                </div>
                            </div>

                            {/* Order Filter Tabs */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                <button
                                    onClick={() => setOrderFilter('all')}
                                    className={`px-4 py-2 rounded-full font-medium transition-all ${orderFilter === 'all'
                                        ? 'bg-gradient-to-r from-yellow-400 to-pink-400 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    All Orders ({orders.length})
                                </button>
                                <button
                                    onClick={() => setOrderFilter('upcoming')}
                                    className={`px-4 py-2 rounded-full font-medium transition-all ${orderFilter === 'upcoming'
                                        ? 'bg-gradient-to-r from-yellow-400 to-pink-400 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    Upcoming ({orders.filter(order => {
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        const orderDate = parseDateString(order.date_needed);
                                        orderDate.setHours(0, 0, 0, 0);
                                        return orderDate >= today && ['pending', 'approved', 'in_progress'].includes(order.status);
                                    }).length})
                                </button>
                                <button
                                    onClick={() => setOrderFilter('unapproved')}
                                    className={`px-4 py-2 rounded-full font-medium transition-all ${orderFilter === 'unapproved'
                                        ? 'bg-gradient-to-r from-yellow-400 to-pink-400 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    Unapproved ({orders.filter(order => order.status === 'pending').length})
                                </button>
                                <button
                                    onClick={() => setOrderFilter('completed')}
                                    className={`px-4 py-2 rounded-full font-medium transition-all ${orderFilter === 'completed'
                                        ? 'bg-gradient-to-r from-yellow-400 to-pink-400 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    Completed ({orders.filter(order => order.status === 'completed').length})
                                </button>
                                <button
                                    onClick={() => setOrderFilter('cancelled')}
                                    className={`px-4 py-2 rounded-full font-medium transition-all ${orderFilter === 'cancelled'
                                        ? 'bg-gradient-to-r from-yellow-400 to-pink-400 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    Cancelled ({orders.filter(order => order.status === 'cancelled').length})
                                </button>
                            </div>

                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-500">Loading orders...</div>
                                </div>
                            ) : filteredOrders.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-500">
                                        {orderFilter === 'all' ? 'No orders found' :
                                            orderFilter === 'upcoming' ? 'No upcoming orders' :
                                                orderFilter === 'unapproved' ? 'No unapproved orders' :
                                                    orderFilter === 'completed' ? 'No completed orders' :
                                                        'No cancelled orders'}
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-3 px-4 font-semibold">Customer</th>
                                                <th className="text-left py-3 px-4 font-semibold">Email</th>
                                                <th className="text-left py-3 px-4 font-semibold">Event Date</th>
                                                <th className="text-left py-3 px-4 font-semibold">Cake Type</th>
                                                <th className="text-left py-3 px-4 font-semibold">Size</th>
                                                <th className="text-left py-3 px-4 font-semibold">Budget</th>
                                                <th className="text-left py-3 px-4 font-semibold">Delivery</th>
                                                <th className="text-left py-3 px-4 font-semibold">Status</th>
                                                <th className="text-left py-3 px-4 font-semibold">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredOrders.map((order) => (
                                                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4">
                                                        <div>
                                                            <div className="font-medium">{order.name}</div>
                                                            {order.phone && (
                                                                <div className="text-sm text-gray-500">{order.phone}</div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">{order.email}</td>
                                                    <td className="py-3 px-4">{formatDate(order.date_needed)}</td>
                                                    <td className="py-3 px-4">{order.cake_type}</td>
                                                    <td className="py-3 px-4">{order.size}</td>
                                                    <td className="py-3 px-4">
                                                        {order.target_budget && (
                                                            <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                                                {order.target_budget}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        {order.delivery_option === 'delivery' ? (
                                                            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                                Delivery
                                                            </span>
                                                        ) : (
                                                            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                                                                Pickup
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                            order.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                                order.status === 'approved' ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {order.status.replace('_', ' ')}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex flex-wrap gap-2">
                                                            <button
                                                                onClick={() => viewOrder(order)}
                                                                className="text-purple-600 hover:text-purple-800 text-sm px-2 py-1 rounded border border-purple-300 hover:bg-purple-50"
                                                            >
                                                                View
                                                            </button>
                                                            <button
                                                                onClick={() => editOrder(order)}
                                                                className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 rounded border border-blue-300 hover:bg-blue-50"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => deleteOrder(order.id)}
                                                                className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded border border-red-300 hover:bg-red-50"
                                                            >
                                                                Delete
                                                            </button>
                                                            {order.status === 'pending' && (
                                                                <>
                                                                    <button
                                                                        onClick={() => updateOrderStatus(order.id, 'approved')}
                                                                        className="text-green-600 hover:text-green-800 text-sm px-2 py-1 rounded border border-green-300 hover:bg-green-50"
                                                                    >
                                                                        Accept
                                                                    </button>
                                                                    <button
                                                                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                                                        className="text-orange-600 hover:text-orange-800 text-sm px-2 py-1 rounded border border-orange-300 hover:bg-orange-50"
                                                                    >
                                                                        Deny
                                                                    </button>
                                                                </>
                                                            )}
                                                            {order.status === 'approved' && (
                                                                <>
                                                                    <button
                                                                        onClick={() => openPriceModal(order)}
                                                                        className="text-yellow-600 hover:text-yellow-800 text-sm px-2 py-1 rounded border border-yellow-300 hover:bg-yellow-50"
                                                                    >
                                                                        Set Price
                                                                    </button>
                                                                    <button
                                                                        onClick={() => updateOrderStatus(order.id, 'in_progress')}
                                                                        className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 rounded border border-blue-300 hover:bg-blue-50"
                                                                    >
                                                                        Start
                                                                    </button>
                                                                </>
                                                            )}
                                                            {order.status === 'in_progress' && (
                                                                <button
                                                                    onClick={() => updateOrderStatus(order.id, 'completed')}
                                                                    className="text-green-600 hover:text-green-800 text-sm px-2 py-1 rounded border border-green-300 hover:bg-green-50"
                                                                >
                                                                    Complete
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'gallery' && (
                    <div className="max-w-7xl mx-auto">
                        <div className="card">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold">Gallery Management</h3>
                                <div className="flex gap-4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setPendingUploadFile(file);
                                                setShowCategoryPicker(true);
                                                // reset file input to allow re-selecting the same file later
                                                (e.target as HTMLInputElement).value = '';
                                            }
                                        }}
                                        className="hidden"
                                        id="gallery-upload"
                                    />
                                    <label
                                        htmlFor="gallery-upload"
                                        className="btn-secondary cursor-pointer"
                                        style={{ opacity: uploading ? 0.5 : 1 }}
                                    >
                                        {uploading ? 'Uploading...' : 'Upload Image'}
                                    </label>
                                </div>
                            </div>

                            {galleryLoading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
                                    <p className="mt-4 text-gray-600">Loading gallery...</p>
                                </div>
                            ) : galleryImages.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📸</div>
                                    <h4 className="text-xl font-semibold mb-2">No images uploaded yet</h4>
                                    <p className="text-gray-600">Upload your first cake image to get started!</p>
                                </div>
                            ) : (
                                <div className="admin-gallery-mobile grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {galleryImages.map((image) => (
                                        <div key={image.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
                                            <div className="relative aspect-[4/3]">
                                                <img
                                                    src={image.image_url}
                                                    alt={`${image.category} cake`}
                                                    className="w-full h-full object-cover"
                                                />
                                                {/* Category pill */}
                                                <div className="absolute top-3 left-3">
                                                    <span className="backdrop-blur-sm bg-white/80 text-gray-800 text-xs font-medium px-3 py-1 rounded-full shadow-sm border border-white/70">
                                                        {image.category}
                                                    </span>
                                                </div>
                                                {/* Featured badge */}
                                                {image.is_featured && (
                                                    <div className="absolute top-3 right-3">
                                                        <span className="backdrop-blur-sm bg-yellow-400/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
                                                            Featured
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-gray-500">#{image.display_order}</span>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => toggleFeatured(image.id, image.is_featured)}
                                                            className={`text-xs px-2 py-1 rounded transition-colors ${image.is_featured
                                                                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                                }`}
                                                        >
                                                            {image.is_featured ? 'Unfeature' : 'Feature'}
                                                        </button>
                                                        <button
                                                            onClick={() => deleteGalleryImage(image.id, image.image_url)}
                                                            className="text-xs px-2 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="card">
                            <h3 className="text-2xl font-bold mb-6">Document Vault</h3>

                            <div className="max-w-md mx-auto">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-yellow-400 transition-colors">
                                    <div className="text-4xl mb-4">📊</div>
                                    <h4 className="text-lg font-semibold mb-2">Export Order History</h4>
                                    <p className="text-gray-600 mb-4">Download all orders as CSV file</p>
                                    <button
                                        onClick={exportToCSV}
                                        className="btn-secondary"
                                    >
                                        Export CSV
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h4 className="text-lg font-semibold mb-4">Order Statistics</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
                                        <div className="text-sm text-gray-600">Total Orders</div>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">
                                            {orders.filter(o => o.status === 'completed').length}
                                        </div>
                                        <div className="text-sm text-gray-600">Completed</div>
                                    </div>
                                    <div className="bg-yellow-50 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-yellow-600">
                                            {orders.filter(o => o.status === 'pending').length}
                                        </div>
                                        <div className="text-sm text-gray-600">Pending</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h4 className="text-lg font-semibold mb-4">Recent Documents</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="text-2xl">📄</div>
                                            <div>
                                                <div className="font-medium">Order History Export</div>
                                                <div className="text-sm text-gray-500">CSV file with all order data</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={exportToCSV}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            Download
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="max-w-2xl mx-auto">
                        <div className="card">
                            <h3 className="text-2xl font-bold mb-6">Account Settings</h3>

                            <div className="mb-6">
                                <h4 className="text-lg font-semibold mb-4">Change Password</h4>
                                <p className="text-sm text-gray-600 mb-4">
                                    Update your password to keep your account secure.
                                </p>

                                {passwordChangeError && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                                        {passwordChangeError}
                                    </div>
                                )}

                                {passwordChangeSuccess && (
                                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">
                                        {passwordChangeSuccess}
                                    </div>
                                )}

                                <form onSubmit={handlePasswordChange} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            value={passwordChangeData.currentPassword}
                                            onChange={(e) => setPasswordChangeData({ ...passwordChangeData, currentPassword: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                                            placeholder="Enter your current password"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={passwordChangeData.newPassword}
                                            onChange={(e) => setPasswordChangeData({ ...passwordChangeData, newPassword: e.target.value })}
                                            required
                                            minLength={6}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                                            placeholder="Enter your new password (min. 6 characters)"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={passwordChangeData.confirmPassword}
                                            onChange={(e) => setPasswordChangeData({ ...passwordChangeData, confirmPassword: e.target.value })}
                                            required
                                            minLength={6}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                                            placeholder="Confirm your new password"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isChangingPassword}
                                        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-300 text-white py-3 text-lg rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isChangingPassword ? 'Changing Password...' : 'Change Password'}
                                    </button>
                                </form>
                            </div>

                            <div className="border-t pt-6">
                                <h4 className="text-lg font-semibold mb-4">Account Information</h4>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="mb-2">
                                        <span className="text-sm font-medium text-gray-700">Email:</span>
                                        <span className="ml-2 text-sm text-gray-600">
                                            {sessionStorage.getItem('adminEmail') || 'Not available'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Back to Home */}
                <div className="text-center mt-12">
                    <Link href="/" className="btn-secondary">
                        ← Back to Website
                    </Link>
                </div>
            </div>

            {/* Category Picker Modal */}
            {showCategoryPicker && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-xl font-bold mb-4">Select Category</h3>
                        <p className="text-sm text-gray-600 mb-4">Choose the category for this image.</p>
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {categoryOptions.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => {
                                        if (pendingUploadFile) {
                                            uploadGalleryImage(pendingUploadFile, cat);
                                        }
                                        setPendingUploadFile(null);
                                        setShowCategoryPicker(false);
                                    }}
                                    className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium"
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setPendingUploadFile(null);
                                    setShowCategoryPicker(false);
                                }}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Order Modal */}
            {showEditModal && editingOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative">
                        {/* Back Button */}
                        <button
                            onClick={() => {
                                setShowEditModal(false);
                                setEditingOrder(null);
                            }}
                            className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="text-sm font-medium">Back</span>
                        </button>
                        <h3 className="text-2xl font-bold mb-4 text-center">Edit Order</h3>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const updatedOrder = {
                                ...editingOrder,
                                name: formData.get('name') as string,
                                email: formData.get('email') as string,
                                phone: formData.get('phone') as string,
                                cake_type: formData.get('cake_type') as string,
                                size: formData.get('size') as string,
                                occasion: formData.get('occasion') as string,
                                description: formData.get('description') as string,
                                date_needed: formData.get('date_needed') as string,
                                inscription: formData.get('inscription') as string,
                                topper: formData.get('topper') as string,
                                flavors: formData.get('flavors') as string,
                                frostings: formData.get('frostings') as string,
                                delivery_option: formData.get('delivery_option') as string,
                                delivery_address: formData.get('delivery_address') as string,
                                target_budget: formData.get('target_budget') as string,
                                contact_method: formData.get('contact_method') as string,
                                contact_time: formData.get('contact_time') as string,
                                payment_method: formData.get('payment_method') as string,
                                status: formData.get('status') as 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled',
                            };
                            saveOrder(updatedOrder);
                        }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        defaultValue={editingOrder.name}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        defaultValue={editingOrder.email}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        defaultValue={editingOrder.phone || ''}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cake Type</label>
                                    <select
                                        name="cake_type"
                                        defaultValue={editingOrder.cake_type}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="birthday">Birthday Cake</option>
                                        <option value="wedding">Wedding Cake</option>
                                        <option value="anniversary">Anniversary Cake</option>
                                        <option value="custom">Custom Design</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                                    <select
                                        name="size"
                                        defaultValue={editingOrder.size}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Occasion</label>
                                    <input
                                        type="text"
                                        name="occasion"
                                        defaultValue={editingOrder.occasion || ''}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Needed</label>
                                    <input
                                        type="date"
                                        name="date_needed"
                                        defaultValue={editingOrder.date_needed}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        name="status"
                                        defaultValue={editingOrder.status}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Budget</label>
                                    <select
                                        name="target_budget"
                                        defaultValue={editingOrder.target_budget}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="under-100">Under $100</option>
                                        <option value="100-200">$100 - $200</option>
                                        <option value="200-300">$200 - $300</option>
                                        <option value="300-500">$300 - $500</option>
                                        <option value="500-750">$500 - $750</option>
                                        <option value="750-1000">$750 - $1,000</option>
                                        <option value="over-1000">Over $1,000</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Option</label>
                                    <select
                                        name="delivery_option"
                                        defaultValue={editingOrder.delivery_option}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="pickup">Pickup</option>
                                        <option value="delivery">Delivery</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Method</label>
                                    <select
                                        name="contact_method"
                                        defaultValue={editingOrder.contact_method}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="phone">Phone</option>
                                        <option value="text">Text</option>
                                        <option value="email">Email</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                    <select
                                        name="payment_method"
                                        defaultValue={editingOrder.payment_method}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="credit-card">Credit Card</option>
                                        <option value="cash">Cash</option>
                                        <option value="paypal">PayPal</option>
                                        <option value="venmo">Venmo</option>
                                        <option value="zelle">Zelle</option>
                                        <option value="bank-transfer">Bank Transfer</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    defaultValue={editingOrder.description || ''}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Inscription</label>
                                <textarea
                                    name="inscription"
                                    rows={2}
                                    defaultValue={editingOrder.inscription || ''}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter inscription text, or leave blank if no inscription needed"
                                />
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Topper</label>
                                <select
                                    name="topper"
                                    defaultValue={editingOrder.topper || ''}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Flavors</label>
                                <textarea
                                    name="flavors"
                                    rows={3}
                                    defaultValue={editingOrder.flavors ? (typeof editingOrder.flavors === 'string' ? editingOrder.flavors : JSON.stringify(editingOrder.flavors)) : ''}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter flavors as JSON array or comma-separated list"
                                />
                                <p className="text-xs text-gray-500 mt-1">Format: ["Vanilla", "Chocolate"] or Vanilla, Chocolate</p>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Frostings</label>
                                <textarea
                                    name="frostings"
                                    rows={3}
                                    defaultValue={editingOrder.frostings ? (typeof editingOrder.frostings === 'string' ? editingOrder.frostings : JSON.stringify(editingOrder.frostings)) : ''}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter frostings as JSON array or comma-separated list"
                                />
                                <p className="text-xs text-gray-500 mt-1">Format: ["Chocolate", "Vanilla"] or Chocolate, Vanilla</p>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                                <textarea
                                    name="delivery_address"
                                    rows={2}
                                    defaultValue={editingOrder.delivery_address || ''}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Time</label>
                                <input
                                    type="text"
                                    name="contact_time"
                                    defaultValue={editingOrder.contact_time || ''}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingOrder(null);
                                    }}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Order Modal */}
            {showViewModal && viewingOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-bold mb-4">Order Details</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Information</label>
                                    <div className="bg-gray-50 p-3 rounded-md">
                                        <div><strong>Name:</strong> {viewingOrder.name}</div>
                                        <div><strong>Email:</strong> {viewingOrder.email}</div>
                                        {viewingOrder.phone && <div><strong>Phone:</strong> {viewingOrder.phone}</div>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cake Details</label>
                                    <div className="bg-gray-50 p-3 rounded-md">
                                        <div><strong>Type:</strong> {viewingOrder.cake_type}</div>
                                        <div><strong>Size:</strong> {viewingOrder.size}</div>
                                        {viewingOrder.occasion && <div><strong>Occasion:</strong> {viewingOrder.occasion}</div>}
                                        <div><strong>Date Needed:</strong> {formatDate(viewingOrder.date_needed)}</div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Order Information</label>
                                    <div className="bg-gray-50 p-3 rounded-md">
                                        <div><strong>Status:</strong>
                                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${viewingOrder.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                viewingOrder.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                    viewingOrder.status === 'approved' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {viewingOrder.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div><strong>Target Budget:</strong> {viewingOrder.target_budget}</div>
                                        {viewingOrder.final_price && <div><strong>Final Price:</strong> ${viewingOrder.final_price}</div>}
                                        <div><strong>Created:</strong> {new Date(viewingOrder.created_at).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Information</label>
                                    <div className="bg-gray-50 p-3 rounded-md">
                                        <div><strong>Option:</strong> {viewingOrder.delivery_option}</div>
                                        {viewingOrder.delivery_address && <div><strong>Address:</strong> {viewingOrder.delivery_address}</div>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Preferences</label>
                                    <div className="bg-gray-50 p-3 rounded-md">
                                        <div><strong>Method:</strong> {viewingOrder.contact_method}</div>
                                        {viewingOrder.contact_time && <div><strong>Time:</strong> {viewingOrder.contact_time}</div>}
                                        <div><strong>Payment:</strong> {viewingOrder.payment_method}</div>
                                    </div>
                                </div>

                                {viewingOrder.inscription && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Inscription</label>
                                        <div className="bg-gray-50 p-3 rounded-md">
                                            {viewingOrder.inscription}
                                        </div>
                                    </div>
                                )}

                                {viewingOrder.topper && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Topper</label>
                                        <div className="bg-gray-50 p-3 rounded-md">
                                            {viewingOrder.topper === 'yes' ? 'Yes' : viewingOrder.topper === 'no' ? 'No' : viewingOrder.topper}
                                        </div>
                                    </div>
                                )}

                                {viewingOrder.flavors && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Flavors</label>
                                        <div className="bg-gray-50 p-3 rounded-md">
                                            {(() => {
                                                try {
                                                    const flavors = typeof viewingOrder.flavors === 'string'
                                                        ? JSON.parse(viewingOrder.flavors)
                                                        : viewingOrder.flavors;
                                                    return Array.isArray(flavors)
                                                        ? flavors.join(', ')
                                                        : viewingOrder.flavors;
                                                } catch {
                                                    return viewingOrder.flavors;
                                                }
                                            })()}
                                        </div>
                                    </div>
                                )}

                                {viewingOrder.frostings && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Frostings</label>
                                        <div className="bg-gray-50 p-3 rounded-md">
                                            {(() => {
                                                try {
                                                    const frostings = typeof viewingOrder.frostings === 'string'
                                                        ? JSON.parse(viewingOrder.frostings)
                                                        : viewingOrder.frostings;
                                                    return Array.isArray(frostings)
                                                        ? frostings.join(', ')
                                                        : viewingOrder.frostings;
                                                } catch {
                                                    return viewingOrder.frostings;
                                                }
                                            })()}
                                        </div>
                                    </div>
                                )}

                                {(() => {
                                    // Parse inspiration_photo_urls if it's a string or ensure it's an array
                                    let photoUrls: string[] = [];

                                    // Debug logging
                                    console.log('Viewing order inspiration_photo_urls:', viewingOrder.inspiration_photo_urls);
                                    console.log('Type:', typeof viewingOrder.inspiration_photo_urls);

                                    if (viewingOrder.inspiration_photo_urls) {
                                        if (typeof viewingOrder.inspiration_photo_urls === 'string') {
                                            try {
                                                const parsed = JSON.parse(viewingOrder.inspiration_photo_urls);
                                                photoUrls = Array.isArray(parsed) ? parsed : [parsed];
                                            } catch {
                                                // If parsing fails, try treating it as a single URL
                                                photoUrls = [viewingOrder.inspiration_photo_urls];
                                            }
                                        } else if (Array.isArray(viewingOrder.inspiration_photo_urls)) {
                                            photoUrls = viewingOrder.inspiration_photo_urls.filter((url: string) => url && url.trim() !== '');
                                        }
                                    }

                                    console.log('Processed photoUrls:', photoUrls);

                                    if (photoUrls.length === 0) {
                                        // Show a message if no photos are available
                                        return (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Inspiration Photos
                                                </label>
                                                <div className="bg-gray-50 p-3 rounded-md">
                                                    <p className="text-gray-500 text-sm">No inspiration photos uploaded</p>
                                                </div>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Inspiration Photo{photoUrls.length > 1 ? 's' : ''} ({photoUrls.length})
                                            </label>
                                            <div className="bg-gray-50 p-3 rounded-md">
                                                <div className={`grid gap-3 ${photoUrls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                                    {photoUrls.map((url, index) => (
                                                        <div key={index} className="relative group overflow-hidden rounded border border-gray-200 bg-gray-100" style={{ minHeight: '256px' }}>
                                                            <img
                                                                src={url}
                                                                alt={`Inspiration ${index + 1}`}
                                                                className="w-full h-64 object-contain"
                                                                style={{
                                                                    display: 'block',
                                                                    backgroundColor: '#f9fafb',
                                                                    minHeight: '256px',
                                                                    width: '100%',
                                                                    height: 'auto',
                                                                    maxHeight: '256px'
                                                                }}
                                                                loading="eager"
                                                                crossOrigin="anonymous"
                                                                onError={(e) => {
                                                                    console.error('Failed to load image:', url);
                                                                    const target = e.target as HTMLImageElement;
                                                                    const parent = target.parentElement;
                                                                    if (parent) {
                                                                        parent.innerHTML = `<div class="w-full h-64 flex items-center justify-center bg-red-50 border border-red-200 rounded text-red-600 text-sm p-4 text-center">Failed to load image<br/><span class="text-xs text-gray-500 mt-2 break-all">${url.substring(0, 50)}...</span></div>`;
                                                                    }
                                                                }}
                                                                onLoad={(e) => {
                                                                    console.log('Successfully loaded image:', url);
                                                                    const target = e.target as HTMLImageElement;
                                                                    target.style.opacity = '1';
                                                                    target.style.visibility = 'visible';
                                                                }}
                                                            />
                                                            <a
                                                                href={url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="absolute inset-0 flex items-center justify-center transition-opacity z-10"
                                                                style={{
                                                                    backgroundColor: 'transparent',
                                                                    pointerEvents: 'auto'
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                                }}
                                                                title="Click to view full size"
                                                            >
                                                                <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium bg-black bg-opacity-70 px-3 py-1 rounded transition-opacity">View Full Size</span>
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>

                        {viewingOrder.description && (
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <div className="bg-gray-50 p-3 rounded-md">
                                    {viewingOrder.description}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowViewModal(false);
                                    setViewingOrder(null);
                                }}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    setShowViewModal(false);
                                    setViewingOrder(null);
                                    editOrder(viewingOrder);
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Edit Order
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Price Modal */}
            {selectedOrderForPrice && (
                <PriceModal
                    isOpen={showPriceModal}
                    onClose={() => {
                        setShowPriceModal(false);
                        setSelectedOrderForPrice(null);
                    }}
                    onConfirm={handlePriceConfirm}
                    currentPrice={selectedOrderForPrice.final_price}
                    orderId={selectedOrderForPrice.id}
                    customerName={selectedOrderForPrice.name}
                />
            )}
        </div>
    );
}