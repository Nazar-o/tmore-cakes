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
    dietary_restrictions?: string;
    delivery_option?: string;
    delivery_address?: string;
    target_budget?: string;
    contact_method?: string;
    contact_time?: string;
    payment_method?: string;
    inspiration_photo_url?: string;
    final_price?: number;
    status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
    created_at: string;
    updated_at?: string;
}

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('calendar');
    const [orderFilter, setOrderFilter] = useState('all');
    const [calculatorData, setCalculatorData] = useState({
        cakeSize: '',
        flavorType: 'standard',
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

    // Gallery state
    const [galleryImages, setGalleryImages] = useState<any[]>([]);
    const [galleryLoading, setGalleryLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [pendingUploadFile, setPendingUploadFile] = useState<File | null>(null);
    const categoryOptions = ['Birthday', 'Kids', 'Wedding', 'Specialty'];

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
                    setOrders(data || []);
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

    const calculateCost = () => {
        let baseCost = 0;
        let laborCost = calculatorData.laborHours * 25; // $25/hour
        let decorCost = calculatorData.decor;
        let deliveryCost = calculatorData.delivery ? 50 : 0;
        let setupCost = calculatorData.setup ? 75 : 0;

        // Base cake cost based on size
        switch (calculatorData.cakeSize) {
            case '8':
                baseCost = 216;
                break;
            case '10':
                baseCost = 342;
                break;
            case '12':
                baseCost = 486;
                break;
            case 'double':
                baseCost = 270;
                break;
            default:
                baseCost = 200;
        }

        // Premium flavor cost
        if (calculatorData.flavorType === 'premium') {
            baseCost += 15;
        }

        const totalCost = baseCost + laborCost + decorCost + deliveryCost + setupCost;
        const profit = totalCost * 0.3; // 30% profit margin
        const finalPrice = totalCost + profit;

        return { totalCost, profit, finalPrice };
    };

    const { totalCost, profit, finalPrice } = calculateCost();

    // Filter orders based on selected filter
    const getFilteredOrders = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        switch (orderFilter) {
            case 'upcoming':
                return orders.filter(order => {
                    const orderDate = new Date(order.date_needed);
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
        setViewingOrder(order);
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
            'Description', 'Date Needed', 'Dietary Restrictions', 'Delivery Option',
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
            order.dietary_restrictions || '',
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
                                            onChange={(e) => setCalculatorData({ ...calculatorData, cakeSize: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                        >
                                            <option value="">Select size</option>
                                            <option value="8">8" Round</option>
                                            <option value="10">10" Round</option>
                                            <option value="12">12" Round</option>
                                            <option value="double">Double Barrel 6"</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Flavor Type
                                        </label>
                                        <select
                                            value={calculatorData.flavorType}
                                            onChange={(e) => setCalculatorData({ ...calculatorData, flavorType: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                        >
                                            <option value="standard">Standard</option>
                                            <option value="premium">Premium (+$15)</option>
                                        </select>
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
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Base Cost:</span>
                                        <span className="font-semibold">${totalCost.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Labor:</span>
                                        <span className="font-semibold">${(calculatorData.laborHours * 25).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Decorations:</span>
                                        <span className="font-semibold">${calculatorData.decor.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Delivery & Setup:</span>
                                        <span className="font-semibold">${((calculatorData.delivery ? 50 : 0) + (calculatorData.setup ? 75 : 0)).toFixed(2)}</span>
                                    </div>
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
                                            const orderDate = new Date(order.date_needed);
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
                                        const orderDate = new Date(order.date_needed);
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
                                                    <td className="py-3 px-4">{new Date(order.date_needed).toLocaleDateString()}</td>
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
                    <div className="max-w-6xl mx-auto">
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-yellow-400 transition-colors">
                                    <div className="text-4xl mb-4">📤</div>
                                    <h4 className="text-lg font-semibold mb-2">Upload Expenses</h4>
                                    <p className="text-gray-600 mb-4">Upload expense reports and receipts</p>
                                    <button className="btn-secondary">Upload Files</button>
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
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-bold mb-4">Edit Order</h3>

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
                                dietary_restrictions: formData.get('dietary_restrictions') as string,
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
                                        <option value="small">Small (6-8 servings)</option>
                                        <option value="medium">Medium (10-12 servings)</option>
                                        <option value="large">Large (15-20 servings)</option>
                                        <option value="extra-large">Extra Large (25+ servings)</option>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Restrictions</label>
                                <input
                                    type="text"
                                    name="dietary_restrictions"
                                    defaultValue={editingOrder.dietary_restrictions || ''}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
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
                    <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
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
                                        <div><strong>Date Needed:</strong> {new Date(viewingOrder.date_needed).toLocaleDateString()}</div>
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

                                {viewingOrder.dietary_restrictions && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Restrictions</label>
                                        <div className="bg-gray-50 p-3 rounded-md">
                                            {viewingOrder.dietary_restrictions}
                                        </div>
                                    </div>
                                )}

                                {viewingOrder.inspiration_photo_url && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Inspiration Photo</label>
                                        <div className="bg-gray-50 p-3 rounded-md">
                                            <img
                                                src={viewingOrder.inspiration_photo_url}
                                                alt="Inspiration"
                                                className="max-w-full h-32 object-cover rounded"
                                            />
                                        </div>
                                    </div>
                                )}
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