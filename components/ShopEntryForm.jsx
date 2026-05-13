'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import indiaDistricts from '@/data/india-districts.json';

const CATEGORIES = [
    'Electronics Shops',
    'Grocery / Kirana / Supermarket',
    'Fashion / Clothing Stores',
    'Hardware / Building Material',
    'Medical / Pharmacy',
    'Furniture Shops',
    'Mobile Phone Shops',
    'Restaurant / Dhaba / Food',
    'Jewellery Shops',
    'Automobile / Vehicle Parts',
    'Books / Stationery',
    'Salon / Beauty Parlour',
];

export default function ShopEntryForm({ selectedState, selectedDistricts, onShopAdded }) {
    const [isLoading, setIsLoading] = useState(false);
    const [quickMode, setQuickMode] = useState(false);
    const [formData, setFormData] = useState({
        shopName: '',
        ownerName: '',
        phone: '',
        address: '',
        district: '',
        state: '',
        category: '',
        pincode: '',
        onlineStatus: false,
    });

    // Sync form data with props
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            state: selectedState || '',
            district: selectedDistricts[0] || '',
        }));
    }, [selectedState, selectedDistricts]);

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? e.target.checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!formData.shopName || !formData.state || !formData.district || !formData.category) {
                toast.error('Please fill in all required fields (Shop Name, State, District, Category)');
                setIsLoading(false);
                return;
            }

            const response = await fetch('/api/shops', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    shopName: formData.shopName,
                    ownerName: formData.ownerName || undefined,
                    phone: formData.phone || undefined,
                    address: formData.address || undefined,
                    district: formData.district,
                    state: formData.state,
                    category: formData.category,
                    pincode: formData.pincode || undefined,
                    onlineStatus: formData.onlineStatus,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                if (error.duplicate) {
                    const proceed = window.confirm('A shop with this name/phone already exists. Add anyway?');
                    if (!proceed) {
                        setIsLoading(false);
                        return;
                    }
                } else {
                    throw new Error(error.error || 'Failed to add shop');
                }
            }

            toast.success('Shop added successfully!');
            setFormData({
                shopName: '',
                ownerName: '',
                phone: '',
                address: '',
                district: selectedDistricts[0] || '',
                state: selectedState || '',
                category: '',
                pincode: '',
                onlineStatus: false,
            });

            onShopAdded?.();
        } catch (error) {
            toast.error(error.message || 'Failed to add shop');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-slate-700 h-fit sticky top-8\">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Add New Shop</h2>

            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setQuickMode(false)}
                    className={`px-4 py-2 rounded font-medium transition ${!quickMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                        }`}
                >
                    Full Form
                </button>
                <button
                    onClick={() => setQuickMode(true)}
                    className={`px-4 py-2 rounded font-medium transition ${quickMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                        }`}
                >
                    Quick Add
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Shop Name *
                    </label>
                    <input
                        type="text"
                        name="shopName"
                        value={formData.shopName}
                        onChange={handleInputChange}
                        placeholder="e.g., ABC Electronics"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                </div>

                {!quickMode && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Owner Name
                            </label>
                            <input
                                type="text"
                                name="ownerName"
                                value={formData.ownerName}
                                onChange={handleInputChange}
                                placeholder="Owner's full name"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Phone / Contact Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="10-digit phone number"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Full Address
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Complete shop address"
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Pincode
                            </label>
                            <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleInputChange}
                                placeholder="6-digit pincode"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        State / UT *
                    </label>
                    <input
                        type="text"
                        name="state"
                        value={formData.state}
                        readOnly
                        placeholder="Select a state from the left panel"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-not-allowed"
                        required
                    />
                    {!formData.state && <p className="text-xs text-red-500 mt-1">⚠️ Select a state from the left panel first</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        District *
                    </label>
                    <select
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    >
                        <option value="">Select district</option>
                        {selectedDistricts.map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>
                    {selectedDistricts.length === 0 && <p className="text-xs text-red-500 mt-1">⚠️ Select a district from the left panel</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Category *
                    </label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    >
                        <option value="">Select category</option>
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {!quickMode && (
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="onlineStatus"
                            checked={formData.onlineStatus}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Online Delivery Available?
                        </span>
                    </label>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                    {isLoading && <Loader size={18} className="animate-spin" />}
                    <span>{quickMode ? 'Quick Add' : 'Add Shop'}</span>
                </button>
            </form>
        </div>
    );
}
