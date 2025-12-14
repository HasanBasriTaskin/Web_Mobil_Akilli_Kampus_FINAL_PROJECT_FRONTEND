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
    X,
    GraduationCap,
    GraduationCap as MyCoursesIcon,
    Award,
    ClipboardCheck,
    MapPin,
    FileCheck,
    NotebookPen,
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
        title: 'Kayıtlı Derslerim',
        href: '/my-courses',
        icon: MyCoursesIcon,
        roles: ['Student']
    },
    {
        title: 'Notlarım',
        href: '/grades',
        icon: Award,
        roles: ['Student']
    },
    {
        title: 'Yoklama Durumum',
        href: '/my-attendance',
        icon: ClipboardCheck,
        roles: ['Student']
    },
    {
        title: 'Yoklama Başlat',
        href: '/attendance/start',
        icon: MapPin,
        roles: ['Faculty']
    },
    {
        title: 'Yoklama Raporları',
        href: '/attendance/reports',
        icon: ClipboardCheck,
        roles: ['Faculty']
    },
    {
        title: 'Not Girişi',
        href: '/gradebook',
        icon: NotebookPen,
        roles: ['Faculty']
    },
    {
        title: 'Mazeret Talepleri',
        href: '/excuse-requests',
        icon: FileCheck,
        roles: ['Faculty', 'Student']
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
                    "fixed left-0 z-50 lg:z-30 h-screen top-0 w-64 bg-white dark:bg-slate-900 border-r border-border flex flex-col transition-transform duration-300",
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                {/* Header with Logo (Desktop) / Close button (Mobile) */}
                <div className="h-16 px-4 flex items-center justify-between border-b border-border shrink-0">
                    {/* Logo - Desktop only */}
                    <Link href="/dashboard" className="hidden lg:flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/20">
                            <GraduationCap className="size-5" />
                        </div>
                        <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                            SmartCampus
                        </span>
                    </Link>

                    {/* Mobile header */}
                    <span className="lg:hidden text-lg font-semibold">Menü</span>
                    <button onClick={onClose} className="lg:hidden p-2 hover:bg-accent rounded-md">
                        <X className="size-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4">

                    <ul className="space-y-1">
                        {filteredNavItems.map((item) => {
                            // Check if current pathname starts with item href (for dynamic routes)
                            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
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
