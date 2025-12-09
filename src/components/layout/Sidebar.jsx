'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    User,
    Users,
    Settings,
    Calendar,
    BookOpen,
    MessageSquare,
    Bell,
    FileText,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';

/**
 * Navigation items
 */
const navItems = [
    {
        title: 'Ana Sayfa',
        href: '/dashboard',
        icon: LayoutDashboard,
        roles: ['Student', 'Faculty', 'Admin']
    },
    {
        title: 'Profilim',
        href: '/profile',
        icon: User,
        roles: ['Student', 'Faculty', 'Admin']
    },
    {
        title: 'Kullanıcılar',
        href: '/users',
        icon: Users,
        roles: ['Admin']
    },
    {
        title: 'Dersler',
        href: '/courses',
        icon: BookOpen,
        roles: ['Student', 'Faculty']
    },
    {
        title: 'Takvim',
        href: '/calendar',
        icon: Calendar,
        roles: ['Student', 'Faculty', 'Admin']
    },
    {
        title: 'Mesajlar',
        href: '/messages',
        icon: MessageSquare,
        roles: ['Student', 'Faculty', 'Admin']
    },
    {
        title: 'Bildirimler',
        href: '/notifications',
        icon: Bell,
        roles: ['Student', 'Faculty', 'Admin']
    },
    {
        title: 'Dökümanlar',
        href: '/documents',
        icon: FileText,
        roles: ['Student', 'Faculty']
    },
    {
        title: 'Ayarlar',
        href: '/settings',
        icon: Settings,
        roles: ['Student', 'Faculty', 'Admin']
    },
];

/**
 * Sidebar Component
 * Sol menü, navigasyon linkleri
 */
export function Sidebar({ isOpen, onClose }) {
    const pathname = usePathname();
    const { user } = useAuthStore();

    // Kullanıcının rolüne göre filtreleme
    const filteredNavItems = navItems.filter(item => {
        if (!user?.role) return false;
        return item.roles.includes(user.role);
    });

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed lg:sticky top-0 left-0 z-50 lg:z-30 h-screen w-64 bg-white dark:bg-slate-900 border-r border-border flex flex-col transition-transform duration-300",
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                {/* Mobile close button */}
                <div className="lg:hidden h-16 px-4 flex items-center justify-between border-b border-border">
                    <span className="text-lg font-semibold">Menü</span>
                    <button onClick={onClose} className="p-2 hover:bg-accent rounded-md">
                        <X className="size-5" />
                    </button>
                </div>

                {/* Desktop spacer (same height as navbar) */}
                <div className="hidden lg:block h-16" />

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4">
                    <ul className="space-y-1">
                        {filteredNavItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={onClose}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                            isActive
                                                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                                : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                        )}
                                    >
                                        <Icon className="size-5" />
                                        <span>{item.title}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-border">
                    <div className="text-xs text-muted-foreground text-center">
                        SmartCampus © {new Date().getFullYear()}
                    </div>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
