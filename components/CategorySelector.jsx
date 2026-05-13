'use client';

import { useState } from 'react';
import {
    Zap,
    ShoppingCart,
    Shirt,
    Hammer,
    Pill,
    Sofa,
    Smartphone,
    UtensilsCrossed,
    Gem,
    Wrench,
    BookOpen,
    Scissors,
} from 'lucide-react';

const CATEGORIES = [
    { name: 'Electronics Shops', icon: Zap },
    { name: 'Grocery / Kirana / Supermarket', icon: ShoppingCart },
    { name: 'Fashion / Clothing Stores', icon: Shirt },
    { name: 'Hardware / Building Material', icon: Hammer },
    { name: 'Medical / Pharmacy', icon: Pill },
    { name: 'Furniture Shops', icon: Sofa },
    { name: 'Mobile Phone Shops', icon: Smartphone },
    { name: 'Restaurant / Dhaba / Food', icon: UtensilsCrossed },
    { name: 'Jewellery Shops', icon: Gem },
    { name: 'Automobile / Vehicle Parts', icon: Wrench },
    { name: 'Books / Stationery', icon: BookOpen },
    { name: 'Salon / Beauty Parlour', icon: Scissors },
];

export default function CategorySelector({ onCategoryChange, selectedCategories }) {
    const toggleCategory = (category) => {
        const updated = selectedCategories.includes(category)
            ? selectedCategories.filter((c) => c !== category)
            : [...selectedCategories, category];
        onCategoryChange(updated);
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-slate-700">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Shop Categories
                <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-2 py-1 rounded text-sm font-normal">
                    {selectedCategories.length}
                </span>
            </h2>

            <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map(({ name, icon: Icon }) => (
                    <button
                        key={name}
                        onClick={() => toggleCategory(name)}
                        className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition ${selectedCategories.includes(name)
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900'
                            : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-700'
                            }`}
                    >
                        <Icon size={18} className={selectedCategories.includes(name) ? 'text-blue-600' : ''} />
                        <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                            {name}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
