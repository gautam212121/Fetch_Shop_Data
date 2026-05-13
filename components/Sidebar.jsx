'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store, Database, BarChart3, Moon, Sun, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Sidebar() {
    const pathname = usePathname();
    const [isDark, setIsDark] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const links = [
        { href: '/', label: 'Data Extractor', icon: Store },
        { href: '/data', label: 'Saved Data', icon: Database },
        { href: '/stats', label: 'Analytics', icon: BarChart3 },
    ];

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40 top-0 left-0"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed md:relative min-h-screen bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 flex flex-col w-64 p-6 z-40 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0`}>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                    <span className="text-blue-600">India</span> Shop Data
                </h1>

                <nav className="flex-1 space-y-2">
                    {links.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive
                                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <button
                    onClick={() => setIsDark(!isDark)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-400 w-full justify-center hover:bg-gray-200 dark:hover:bg-slate-700 transition"
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    <span className="font-medium">{isDark ? 'Light' : 'Dark'}</span>
                </button>
            </div>
        </>
    );
}
