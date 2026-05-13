'use client';

import StatsCharts from '@/components/StatsCharts';

export default function StatsPage() {
    return (
        <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 lg:mb-8">
                Analytics & Dashboard
            </h1>
            <StatsCharts />
        </div>
    );
}
