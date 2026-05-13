'use client';

import { useState, useEffect } from 'react';
import indiaDistricts from '@/data/india-districts.json';
import { ChevronDown } from 'lucide-react';

export default function StateDistrictSelector({
    onStateChange,
    onDistrictChange,
    selectedState,
    selectedDistricts,
}) {
    const states = Object.keys(indiaDistricts);
    const [districts, setDistricts] = useState([]);

    useEffect(() => {
        if (selectedState) {
            setDistricts(indiaDistricts[selectedState] || []);
            onDistrictChange([]);
        }
    }, [selectedState, onDistrictChange]);

    const toggleDistrict = (district) => {
        const updated = selectedDistricts.includes(district)
            ? selectedDistricts.filter((d) => d !== district)
            : [...selectedDistricts, district];
        onDistrictChange(updated);
    };

    const selectAllDistricts = () => {
        onDistrictChange(districts);
    };

    const clearAllDistricts = () => {
        onDistrictChange([]);
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-slate-700">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Filters</h2>

            {/* State Selector */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select State / UT
                </label>
                <div className="relative">
                    <select
                        value={selectedState}
                        onChange={(e) => onStateChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Choose a state...</option>
                        {states.map((state) => (
                            <option key={state} value={state}>
                                {state}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 text-gray-400" size={20} />
                </div>
            </div>

            {/* District Selector */}
            {selectedState && (
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Select Districts
                            <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-2 py-1 rounded text-xs">
                                {selectedDistricts.length} selected
                            </span>
                        </label>
                    </div>

                    <div className="flex gap-2 mb-3">
                        <button
                            onClick={selectAllDistricts}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Select All
                        </button>
                        <button
                            onClick={clearAllDistricts}
                            className="px-3 py-1 text-sm bg-gray-300 dark:bg-slate-700 text-gray-900 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-slate-600 transition"
                        >
                            Clear All
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto border border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-gray-50 dark:bg-slate-900">
                        {districts.map((district) => (
                            <label
                                key={district}
                                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 p-2 rounded"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedDistricts.includes(district)}
                                    onChange={() => toggleDistrict(district)}
                                    className="w-4 h-4 text-blue-600 rounded"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{district}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
