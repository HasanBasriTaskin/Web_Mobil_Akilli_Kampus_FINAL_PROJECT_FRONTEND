'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { GraduationCap, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth.store';

/**
 * Dashboard Page
 * Placeholder - Giriş yapan kullanıcının adını gösterir
 */
export default function DashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuthStore();

    useEffect(() => {
        // Giriş yapmamışsa login'e yönlendir
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    async function handleLogout() {
        logout();
        router.push('/login');
    }

    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-violet-950/30 dark:to-slate-950">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                                <GraduationCap className="size-5" />
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                SmartCampus
                            </span>
                        </div>

                        {/* User Menu */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm">
                                <User className="size-4 text-muted-foreground" />
                                <span className="font-medium">{user.fullName}</span>
                                <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-primary/10">
                                    {user.role}
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLogout}
                                className="gap-2"
                            >
                                <LogOut className="size-4" />
                                Çıkış
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-center"
                >
                    <h1 className="text-4xl font-bold mb-4">
                        Hoş Geldiniz, <span className="text-primary">{user.fullName}</span>! 👋
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        SmartCampus Akıllı Kampüs Yönetim Sistemine hoş geldiniz.
                        Bu bir placeholder sayfa, ilerleyen aşamalarda dashboard özellikleri eklenecektir.
                    </p>
                </motion.div>

                {/* User Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="mt-12 max-w-md mx-auto"
                >
                    <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-xl p-6">
                        <h2 className="text-lg font-semibold mb-4">Kullanıcı Bilgileri</h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Email:</dt>
                                <dd className="font-medium">{user.email}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Kullanıcı Tipi:</dt>
                                <dd className="font-medium">{user.userType}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Rol:</dt>
                                <dd className="font-medium">{user.role}</dd>
                            </div>
                            {user.student && (
                                <div className="flex justify-between">
                                    <dt className="text-muted-foreground">Öğrenci No:</dt>
                                    <dd className="font-medium">{user.student.studentNumber}</dd>
                                </div>
                            )}
                            {user.faculty && (
                                <>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">Personel No:</dt>
                                        <dd className="font-medium">{user.faculty.employeeNumber}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">Ünvan:</dt>
                                        <dd className="font-medium">{user.faculty.title}</dd>
                                    </div>
                                </>
                            )}
                        </dl>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
