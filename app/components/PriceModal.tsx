'use client';

import { useState, useEffect } from 'react';

interface PriceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (price: number) => void;
    currentPrice?: number;
    orderId: string;
    customerName: string;
}

export default function PriceModal({
    isOpen,
    onClose,
    onConfirm,
    currentPrice,
    orderId,
    customerName
}: PriceModalProps) {
    const [price, setPrice] = useState<string>('');

    useEffect(() => {
        if (isOpen) {
            setPrice(currentPrice?.toString() || '');
        }
    }, [isOpen, currentPrice]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numericPrice = parseFloat(price);
        if (!isNaN(numericPrice) && numericPrice > 0) {
            onConfirm(numericPrice);
            onClose();
        }
    };

    const handleClose = () => {
        setPrice('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
                {/* Header */}
                <div className="bg-[#C8A2B8] px-6 py-4 rounded-t-2xl">
                    <h3 className="text-xl font-bold text-white text-center">
                        Set Order Price
                    </h3>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-4">
                        <p className="text-gray-600 text-center">
                            Setting price for <span className="font-semibold text-gray-800">{customerName}</span>
                        </p>
                        <p className="text-sm text-gray-500 text-center mt-1">
                            Order ID: {orderId}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Final Price ($)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                                    $
                                </span>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8A2B8] focus:border-[#C8A2B8] text-lg"
                                    placeholder="0.00"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0}
                                className="flex-1 px-4 py-3 bg-[#C8A2B8] text-white rounded-lg hover:bg-[#6B2E5F] focus:outline-none focus:ring-2 focus:ring-[#C8A2B8] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
                            >
                                Set Price
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}