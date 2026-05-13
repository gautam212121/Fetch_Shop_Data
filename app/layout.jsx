import Sidebar from '@/components/Sidebar';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata = {
    title: 'India Shop Data Extractor',
    description: 'Extract and manage local shop data across all states and districts of India',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="bg-gray-50 dark:bg-slate-950">
                <div className="flex flex-col md:flex-row">
                    <Sidebar />
                    <main className="flex-1 w-full">
                        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
                    </main>
                </div>
                <Toaster />
            </body>
        </html>
    );
}
