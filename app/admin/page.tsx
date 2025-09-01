'use client';

import { useState } from 'react';
import Link from 'next/link';

interface CakeOrder {
    id: string;
    customerName: string;
    eventDate: string;
    pickupTime: string;
    cakeType: string;
    status: 'pending' | 'approved' | 'in_progress' | 'completed';
}

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('calculator');
    const [calculatorData, setCalculatorData] = useState({
        cakeSize: '',
        flavorType: 'standard',
        laborHours: 0,
        delivery: false,
        setup: false,
        decor: 0
    });

    const [orders] = useState<CakeOrder[]>([
        {
            id: '1',
            customerName: 'Sarah Johnson',
            eventDate: '2024-02-15',
            pickupTime: '2:00 PM',
            cakeType: 'Wedding Cake',
            status: 'in_progress'
        },
        {
            id: '2',
            customerName: 'Mike Chen',
            eventDate: '2024-02-18',
            pickupTime: '10:00 AM',
            cakeType: 'Birthday Cake',
            status: 'pending'
        }
    ]);

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

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Admin <span className="gradient-text">Dashboard</span>
                    </h1>
                    <p className="text-xl text-gray-600">
                        Manage your cake business efficiently
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white rounded-full p-2 shadow-lg">
                        <button
                            onClick={() => setActiveTab('calculator')}
                            className={`px-6 py-3 rounded-full font-medium transition-all ${activeTab === 'calculator'
                                ? 'bg-gradient-to-r from-yellow-500 to-yellow-300 text-white shadow-md'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Cost Calculator
                        </button>
                        <button
                            onClick={() => setActiveTab('calendar')}
                            className={`px-6 py-3 rounded-full font-medium transition-all ${activeTab === 'calendar'
                                ? 'bg-gradient-to-r from-yellow-500 to-yellow-300 text-white shadow-md'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Cake Calendar
                        </button>
                        <button
                            onClick={() => setActiveTab('documents')}
                            className={`px-6 py-3 rounded-full font-medium transition-all ${activeTab === 'documents'
                                ? 'bg-gradient-to-r from-yellow-500 to-yellow-300 text-white shadow-md'
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
                    <div className="max-w-6xl mx-auto">
                        <div className="card">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold">Upcoming Orders</h3>
                                <button className="btn-primary">Add New Order</button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 font-semibold">Customer</th>
                                            <th className="text-left py-3 px-4 font-semibold">Event Date</th>
                                            <th className="text-left py-3 px-4 font-semibold">Pickup Time</th>
                                            <th className="text-left py-3 px-4 font-semibold">Cake Type</th>
                                            <th className="text-left py-3 px-4 font-semibold">Status</th>
                                            <th className="text-left py-3 px-4 font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-4">{order.customerName}</td>
                                                <td className="py-3 px-4">{order.eventDate}</td>
                                                <td className="py-3 px-4">{order.pickupTime}</td>
                                                <td className="py-3 px-4">{order.cakeType}</td>
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
                                                    <button className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                                                    <button className="text-red-600 hover:text-red-800">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
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
                                    <h4 className="text-lg font-semibold mb-2">Tax Files</h4>
                                    <p className="text-gray-600 mb-4">Download your tax documents and reports</p>
                                    <button className="btn-primary">Download Tax Files</button>
                                </div>

                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-yellow-400 transition-colors">
                                    <div className="text-4xl mb-4">📤</div>
                                    <h4 className="text-lg font-semibold mb-2">Upload Expenses</h4>
                                    <p className="text-gray-600 mb-4">Upload expense reports and receipts</p>
                                    <button className="btn-secondary">Upload Files</button>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h4 className="text-lg font-semibold mb-4">Recent Documents</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="text-2xl">📄</div>
                                            <div>
                                                <div className="font-medium">Q4 Expense Report</div>
                                                <div className="text-sm text-gray-500">Uploaded 2 days ago</div>
                                            </div>
                                        </div>
                                        <button className="text-blue-600 hover:text-blue-800">Download</button>
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
        </div>
    );
} 