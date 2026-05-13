'use client';

import { useState } from 'react';
import StateDistrictSelector from '@/components/StateDistrictSelector';
import CategorySelector from '@/components/CategorySelector';
import MapLinksList from '@/components/MapLinksList';
import ShopEntryForm from '@/components/ShopEntryForm';

export default function Home() {
    const [selectedState, setSelectedState] = useState('');
    const [selectedDistricts, setSelectedDistricts] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    return (
        <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 lg:mb-8">Data Extractor</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6\">
                {/* Left Panel - Filters */}
                <div className="lg:col-span-1 space-y-4 sm:space-y-6">
                    <StateDistrictSelector
                        onStateChange={setSelectedState}
                        onDistrictChange={setSelectedDistricts}
                        selectedState={selectedState}
                        selectedDistricts={selectedDistricts}
                    />

                    <CategorySelector
                        onCategoryChange={setSelectedCategories}
                        selectedCategories={selectedCategories}
                    />
                </div>

                {/* Center Panel - Maps Links */}
                <div className="md:col-span-2 lg:col-span-1">
                    <MapLinksList
                        selectedState={selectedState}
                        selectedDistricts={selectedDistricts}
                        selectedCategories={selectedCategories}
                    />
                </div>

                {/* Right Panel - Data Entry Form */}
                <div className="lg:col-span-1">
                    <ShopEntryForm selectedState={selectedState} selectedDistricts={selectedDistricts} />
                </div>
            </div>
        </div>
    );
}
