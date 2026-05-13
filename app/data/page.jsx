'use client';

import { useState } from 'react';
import ShopsTable from '@/components/ShopsTable';

export default function DataPage() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    return (
        <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 lg:mb-8">Saved Data</h1>
            <ShopsTable refreshTrigger={refreshTrigger} />
        </div>
    );
}
