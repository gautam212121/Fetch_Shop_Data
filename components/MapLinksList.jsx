'use client';

import { ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function MapLinksList({ selectedState, selectedDistricts, selectedCategories }) {
    const [openedCount, setOpenedCount] = useState(0);

    const generateLinks = () => {
        const links = [];
        for (const district of selectedDistricts) {
            for (const category of selectedCategories) {
                links.push({
                    district,
                    category,
                    url: `https://www.google.com/maps/search/${encodeURIComponent(
                        category
                    )}+in+${encodeURIComponent(district)}+${encodeURIComponent(selectedState)}`,
                });
            }
        }
        return links;
    };

    const links = generateLinks();

    const handleOpenAll = () => {
        if (links.length > 10) {
            const confirmed = window.confirm(`This will open ${links.length} tabs. Are you sure?`);
            if (!confirmed) return;
        }

        links.forEach((link, index) => {
            setTimeout(() => {
                window.open(link.url, '_blank');
            }, index * 200);
        });

        setOpenedCount(links.length);
        setTimeout(() => setOpenedCount(0), 3000);
    };

    if (!selectedState || selectedDistricts.length === 0 || selectedCategories.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-slate-700\">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Google Maps Links</h2>
                <p className="text-gray-500 dark:text-gray-400">
                    Select a state, at least one district, and at least one category to generate maps links.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Google Maps Links
                    <span className="ml-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 px-2 py-1 rounded text-sm">
                        {links.length} links
                    </span>
                </h2>
            </div>

            {links.length > 0 && (
                <button
                    onClick={handleOpenAll}
                    className="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                    Open All Links ({links.length}){openedCount > 0 && ` - Opened ${openedCount}`}
                </button>
            )}

            <div className="max-h-96 overflow-y-auto space-y-2">
                {links.map((link, index) => (
                    <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 transition"
                    >
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">{link.district}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{link.category}</p>
                        </div>
                        <ExternalLink className="text-blue-600 dark:text-blue-400" size={20} />
                    </a>
                ))}
            </div>
        </div>
    );
}
