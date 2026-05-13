'use client';

import { useState, useEffect } from 'react';
import { Trash2, Download, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function ShopsTable({ refreshTrigger = 0 }) {
    const [shops, setShops] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [selectedIds, setSelectedIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [filters, setFilters] = useState({
        state: '',
        district: '',
        category: '',
        onlineStatus: '',
    });

    const limit = 50;

    const fetchShops = async () => {
        setIsLoading(true);

        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            });

            if (searchTerm) {
                params.append('search', searchTerm);
            }

            if (filters.state) {
                params.append('state', filters.state);
            }

            if (filters.district) {
                params.append('district', filters.district);
            }

            if (filters.category) {
                params.append('category', filters.category);
            }

            if (filters.onlineStatus) {
                params.append('onlineStatus', filters.onlineStatus);
            }

            const response = await fetch(`/api/shops?${params}`);

            if (!response.ok) {
                throw new Error('Failed to fetch');
            }

            const data = await response.json();

            console.log('API Response:', data);

            setShops(Array.isArray(data?.data) ? data.data : []);

            setTotal(data?.pagination?.total || 0);

            setSelectedIds([]);
        } catch (error) {
            console.error(error);

            setShops([]);

            setTotal(0);

            toast.error('Failed to load shops');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchShops();
    }, [page, searchTerm, filters, refreshTrigger]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure?');

        if (!confirmDelete) return;

        try {
            await fetch(`/api/shops?id=${id}`, {
                method: 'DELETE',
            });

            toast.success('Shop deleted');

            fetchShops();
        } catch (error) {
            toast.error('Failed to delete shop');
        }
    };

    const handleBulkDelete = async () => {
        const confirmDelete = window.confirm(
            `Delete ${selectedIds.length} shops?`
        );

        if (!confirmDelete) return;

        try {
            for (const id of selectedIds) {
                await fetch(`/api/shops?id=${id}`, {
                    method: 'DELETE',
                });
            }

            toast.success('Shops deleted');

            fetchShops();
        } catch (error) {
            toast.error('Failed to delete shops');
        }
    };

    const handleExport = async (format) => {
        try {
            const response = await fetch(`/api/shops?format=${format}`);

            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');

            a.href = url;

            a.download = `shops.${format}`;

            document.body.appendChild(a);

            a.click();

            a.remove();

            window.URL.revokeObjectURL(url);

            toast.success('File downloaded');
        } catch (error) {
            toast.error('Export failed');
        }
    };

    const pages = Math.ceil(total / limit);

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700">

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Saved Shops
            </h2>

            {/* Search */}
            <div className="mb-6">

                <div className="relative">
                    <Search
                        className="absolute left-3 top-3 text-gray-400"
                        size={20}
                    />

                    <input
                        type="text"
                        placeholder="Search shops..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mb-6">

                <button
                    onClick={() => handleExport('csv')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                    Export CSV
                </button>

                <button
                    onClick={() => handleExport('xlsx')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                    Export Excel
                </button>

                {selectedIds.length > 0 && (
                    <button
                        onClick={handleBulkDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg"
                    >
                        Delete Selected
                    </button>
                )}
            </div>

            {/* Loading */}
            {isLoading ? (
                <div className="text-center py-10 text-gray-500">
                    Loading shops...
                </div>
            ) : !shops || shops.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    No shops found
                </div>
            ) : (
                <>
                    {/* Table */}
                    <div className="overflow-x-auto">

                        <table className="w-full text-sm">

                            <thead className="bg-gray-100 dark:bg-slate-900">

                                <tr>
                                    <th className="p-3">
                                        <input
                                            type="checkbox"
                                            checked={
                                                selectedIds.length ===
                                                    shops.length &&
                                                shops.length > 0
                                            }
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedIds(
                                                        shops.map(
                                                            (shop) => shop.id
                                                        )
                                                    );
                                                } else {
                                                    setSelectedIds([]);
                                                }
                                            }}
                                        />
                                    </th>

                                    <th className="p-3 text-left">
                                        Shop
                                    </th>

                                    <th className="p-3 text-left">
                                        Owner
                                    </th>

                                    <th className="p-3 text-left">
                                        Phone
                                    </th>

                                    <th className="p-3 text-left">
                                        District
                                    </th>

                                    <th className="p-3 text-left">
                                        State
                                    </th>

                                    <th className="p-3 text-left">
                                        Category
                                    </th>

                                    <th className="p-3 text-left">
                                        Online
                                    </th>

                                    <th className="p-3 text-left">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {shops.map((shop) => (
                                    <tr
                                        key={shop.id}
                                        className="border-b border-gray-200 dark:border-slate-700"
                                    >
                                        <td className="p-3">

                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(
                                                    shop.id
                                                )}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedIds([
                                                            ...selectedIds,
                                                            shop.id,
                                                        ]);
                                                    } else {
                                                        setSelectedIds(
                                                            selectedIds.filter(
                                                                (id) =>
                                                                    id !==
                                                                    shop.id
                                                            )
                                                        );
                                                    }
                                                }}
                                            />
                                        </td>

                                        <td className="p-3">
                                            {shop.shopName || '-'}
                                        </td>

                                        <td className="p-3">
                                            {shop.ownerName || '-'}
                                        </td>

                                        <td className="p-3">
                                            {shop.phone || '-'}
                                        </td>

                                        <td className="p-3">
                                            {shop.district || '-'}
                                        </td>

                                        <td className="p-3">
                                            {shop.state || '-'}
                                        </td>

                                        <td className="p-3">
                                            {shop.category || '-'}
                                        </td>

                                        <td className="p-3">
                                            {shop.onlineStatus
                                                ? 'Yes'
                                                : 'No'}
                                        </td>

                                        <td className="p-3">

                                            <button
                                                onClick={() =>
                                                    handleDelete(shop.id)
                                                }
                                                className="text-red-600"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pages > 1 && (
                        <div className="flex justify-between items-center mt-6">

                            <button
                                onClick={() =>
                                    setPage(Math.max(1, page - 1))
                                }
                                disabled={page === 1}
                                className="px-4 py-2 border rounded"
                            >
                                Previous
                            </button>

                            <span>
                                Page {page} of {pages}
                            </span>

                            <button
                                onClick={() =>
                                    setPage(Math.min(pages, page + 1))
                                }
                                disabled={page === pages}
                                className="px-4 py-2 border rounded"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}