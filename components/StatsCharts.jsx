'use client';

import { useState, useEffect } from 'react';

import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

import { Loader } from 'lucide-react';

const COLORS = [
    '#3b82f6',
    '#ef4444',
    '#10b981',
    '#f59e0b',
    '#8b5cf6',
    '#ec4899',
    '#14b8a6',
    '#f97316',
    '#6366f1',
    '#84cc16',
];

export default function StatsCharts() {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/stats');

                if (!response.ok) {
                    throw new Error('Failed to fetch stats');
                }

                const data = await response.json();

                console.log('Stats API Data:', data);

                setStats({
                    totalShops: data?.totalShops || 0,
                    onlineShops: data?.onlineShops || 0,
                    offlineShops: data?.offlineShops || 0,
                    shopsByState: data?.shopsByState || [],
                    shopsByCategory: data?.shopsByCategory || [],
                    topDistricts: data?.topDistricts || [],
                    recentShops: data?.recentShops || [],
                });
            } catch (error) {
                console.error('Failed to fetch stats:', error);

                setStats({
                    totalShops: 0,
                    onlineShops: 0,
                    offlineShops: 0,
                    shopsByState: [],
                    shopsByCategory: [],
                    topDistricts: [],
                    recentShops: [],
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();

        const interval = setInterval(fetchStats, 30000);

        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader className="animate-spin" size={32} />
            </div>
        );
    }

    const deliveryData = [
        {
            name: 'With Online Delivery',
            value: stats.onlineShops,
        },
        {
            name: 'Without Online Delivery',
            value: stats.offlineShops,
        },
    ];

    return (
        <div className="space-y-6">

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700">
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                        Total Shops
                    </p>

                    <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                        {stats.totalShops}
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700">
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                        With Online Delivery
                    </p>

                    <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                        {stats.onlineShops}
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700">
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                        Without Online Delivery
                    </p>

                    <p className="text-4xl font-bold text-red-600 dark:text-red-400">
                        {stats.offlineShops}
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700">
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                        States Covered
                    </p>

                    <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                        {stats.shopsByState.length}
                    </p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Shops By State */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700">

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Shops by State
                    </h3>

                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.shopsByState.slice(0, 10)}>

                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis
                                dataKey="state"
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />

                            <YAxis />

                            <Tooltip />

                            <Bar
                                dataKey="count"
                                fill="#3b82f6"
                                radius={[8, 8, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Shops By Category */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700">

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Shops by Category
                    </h3>

                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>

                            <Pie
                                data={stats.shopsByCategory}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                dataKey="count"
                                label={({ category, count }) =>
                                    `${category}: ${count}`
                                }
                            >
                                {stats.shopsByCategory.map((entry, index) => (
                                    <Cell
                                        key={index}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>

                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Online Delivery */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700">

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Online Delivery Status
                    </h3>

                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>

                            <Pie
                                data={deliveryData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                dataKey="value"
                                label
                            >
                                <Cell fill="#10b981" />
                                <Cell fill="#ef4444" />
                            </Pie>

                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Districts */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700">

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Top Districts
                    </h3>

                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={stats.topDistricts}
                            layout="vertical"
                        >

                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis type="number" />

                            <YAxis
                                type="category"
                                dataKey="district"
                                width={100}
                            />

                            <Tooltip />

                            <Bar
                                dataKey="count"
                                fill="#8b5cf6"
                                radius={[0, 8, 8, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Shops */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700">

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Recently Added Shops
                </h3>

                <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                        <thead className="bg-gray-100 dark:bg-slate-900">

                            <tr>
                                <th className="text-left p-3">
                                    Shop Name
                                </th>

                                <th className="text-left p-3">
                                    District
                                </th>

                                <th className="text-left p-3">
                                    State
                                </th>

                                <th className="text-left p-3">
                                    Category
                                </th>

                                <th className="text-left p-3">
                                    Date
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {stats.recentShops.length > 0 ? (
                                stats.recentShops.map((shop) => (
                                    <tr
                                        key={shop.id}
                                        className="border-b border-gray-200 dark:border-slate-700"
                                    >
                                        <td className="p-3">
                                            {shop.shopName}
                                        </td>

                                        <td className="p-3">
                                            {shop.district}
                                        </td>

                                        <td className="p-3">
                                            {shop.state}
                                        </td>

                                        <td className="p-3">
                                            {shop.category}
                                        </td>

                                        <td className="p-3">
                                            {shop.createdAt
                                                ? new Date(
                                                      shop.createdAt
                                                  ).toLocaleDateString()
                                                : '-'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center p-6 text-gray-500"
                                    >
                                        No shops found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}