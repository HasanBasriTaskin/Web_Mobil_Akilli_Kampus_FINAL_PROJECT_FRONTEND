'use client';

import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';

/**
 * Dashboard Layout
 * ProtectedRoute, Navbar ve Sidebar wrapper
 */
export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                {/* Sidebar */}
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                {/* Main content area */}
                <div className="lg:pl-64 flex flex-col min-h-screen">
                    {/* Navbar */}
                    <Navbar onMenuClick={() => setSidebarOpen(true)} />

                    {/* Page content */}
                    <main className="flex-1 p-4 lg:p-6">
                        {children}
                    </main>
                </div>
            </div>

            {/* Toast notifications */}
            <Toaster position="top-right" richColors closeButton />
        </ProtectedRoute>
    );
}
