'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
<<<<<<< Updated upstream
    Calendar,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    BookOpen,
    MapPin,
    Clock,
    Navigation,
    TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { getMyAttendance } from '@/services/attendance.service';
import { mockAttendance, mockAttendanceSessions } from '@/mocks/academic.mock';

/**
 * My Attendance Page
 * Yoklama durumum - öğrenci için
 */
export default function MyAttendancePage() {
    const [attendance, setAttendance] = useState([]);
    const [activeSessions, setActiveSessions] = useState([]);
=======
    CheckCircle, AlertTriangle, XCircle,
    BookOpen, BarChart3, FileText
} from 'lucide-react';
import { getMyAttendance } from '@/services/attendance.service';
import { toast } from 'sonner';
import Link from 'next/link';

/**
 * Attendance Status Badge
 */
function StatusBadge({ level }) {
    const config = {
        OK: {
            color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            icon: CheckCircle
        },
        Warning: {
            color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
            icon: AlertTriangle
        },
        Critical: {
            color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            icon: XCircle
        }
    };

    const { color, icon: Icon } = config[level] || config.OK;

    return (
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${color}`}>
            <Icon className="size-4" />
            <span>{level}</span>
        </div>
    );
}

/**
 * Attendance Card
 */
function AttendanceCard({ course }) {
    const percentage = course.attendancePercentage || 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border"
        >
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600">
                        <BookOpen className="size-6 text-white" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">{course.courseCode}</p>
                        <h3 className="font-semibold">{course.courseName}</h3>
                    </div>
                </div>
                <StatusBadge level={course.warningLevel} />
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Devam Oranı</span>
                    <span className="font-medium">%{percentage.toFixed(0)}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all ${percentage >= 80 ? 'bg-green-500' :
                                percentage >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold">{course.totalSessions}</p>
                    <p className="text-xs text-muted-foreground">Toplam</p>
                </div>
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <p className="text-2xl font-bold text-green-600">{course.attendedSessions}</p>
                    <p className="text-xs text-muted-foreground">Katıldım</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <p className="text-2xl font-bold text-blue-600">{course.excusedSessions}</p>
                    <p className="text-xs text-muted-foreground">Mazeretli</p>
                </div>
            </div>

            {/* Request Excuse Button */}
            {course.warningLevel !== 'OK' && (
                <button className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm">
                    <FileText className="size-4" />
                    <span>Mazeret Bildirimi</span>
                </button>
            )}
        </motion.div>
    );
}

/**
 * My Attendance Page - Student
 */
export default function MyAttendancePage() {
    const [courses, setCourses] = useState([]);
>>>>>>> Stashed changes
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAttendance();
    }, []);

    async function loadAttendance() {
        try {
            setLoading(true);
            const response = await getMyAttendance();
<<<<<<< Updated upstream
            
            if (response.success) {
                setAttendance(response.data?.items || response.data || []);
                // Aktif oturumları ayır
                const active = response.data?.activeSessions || [];
                setActiveSessions(active);
            } else {
                // Mock data fallback
                setAttendance(mockAttendance);
                // Aktif oturumlar için mock data
                const active = mockAttendanceSessions.filter(s => s.status === 'Aktif' || s.status === 'Active');
                setActiveSessions(active);
            }
        } catch (error) {
            // Mock data fallback
            console.error('Yoklama bilgileri yüklenemedi, mock data kullanılıyor:', error);
            setAttendance(mockAttendance);
            // Aktif oturumlar için mock data
            const active = mockAttendanceSessions.filter(s => s.status === 'Aktif' || s.status === 'Active');
            setActiveSessions(active);
=======
            setCourses(response.data || []);
        } catch (error) {
            toast.error('Veriler yüklenemedi');
            console.error(error);
>>>>>>> Stashed changes
        } finally {
            setLoading(false);
        }
    }

<<<<<<< Updated upstream
    function getStatusBadge(percentage) {
        if (percentage >= 80) {
            return {
                color: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
                icon: CheckCircle2,
                label: 'İyi',
            };
        } else if (percentage >= 70) {
            return {
                color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
                icon: AlertTriangle,
                label: 'Uyarı',
            };
        } else {
            return {
                color: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
                icon: XCircle,
                label: 'Kritik',
            };
        }
    }

    /**
     * Attendance Trend Chart Component
     * Minimal ve sade haftalık yoklama görselleştirmesi
     */
    function AttendanceTrendChart({ trend, courseName }) {
        if (!trend || trend.length === 0) {
            return null;
        }

        return (
            <div className="mt-6 pt-4 border-t border-border">
                <h3 className="text-sm font-medium mb-3 text-muted-foreground">
                    Haftalık Yoklama Geçmişi
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {trend.map((point, index) => {
                        const date = new Date(point.date);
                        const dateLabel = date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
                        
                        return (
                            <div 
                                key={index} 
                                className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/30 border border-border/50"
                            >
                                <div className="text-xs text-muted-foreground mb-1">
                                    Hafta {point.week}
                                </div>
                                <div className="text-xs text-muted-foreground mb-2">
                                    {dateLabel}
                                </div>
                                <div className={`text-lg font-semibold ${
                                    point.percentage >= 80 
                                        ? 'text-green-600 dark:text-green-500' 
                                        : point.percentage >= 50 
                                        ? 'text-yellow-600 dark:text-yellow-500' 
                                        : 'text-red-600 dark:text-red-500'
                                }`}>
                                    %{point.percentage}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
=======
    // Calculate overall stats
    const overallStats = courses.reduce((acc, course) => {
        acc.total += course.totalSessions;
        acc.attended += course.attendedSessions;
        acc.excused += course.excusedSessions;
        return acc;
    }, { total: 0, attended: 0, excused: 0 });

    const overallPercentage = overallStats.total > 0
        ? ((overallStats.attended + overallStats.excused) / overallStats.total * 100)
        : 100;
>>>>>>> Stashed changes

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
<<<<<<< Updated upstream
                <h1 className="text-3xl font-bold">Yoklama Durumum</h1>
                <p className="text-muted-foreground mt-2">
                    Tüm derslerinizdeki yoklama istatistikleriniz
                </p>
            </motion.div>

            {/* Active Sessions */}
            {!loading && activeSessions.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 border-2 border-violet-200 dark:border-violet-800"
                >
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Navigation className="size-5 text-violet-600 dark:text-violet-400" />
                        Aktif Yoklama Oturumları
                    </h2>
                    <div className="space-y-3">
                        {activeSessions.map((session, index) => {
                            const course = session.section?.course;
                            return (
                                <motion.div
                                    key={session.id || index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-4 rounded-lg bg-white dark:bg-slate-800/50 border border-violet-200 dark:border-violet-800"
                                >
                                    <div className="flex items-start justify-between gap-4 mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <BookOpen className="size-4 text-violet-600 dark:text-violet-400" />
                                                <span className="font-mono text-sm text-primary">
                                                    {course?.code}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold mb-2">{course?.name}</h3>
                                            <div className="space-y-1 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="size-4" />
                                                    <span>{new Date(session.date).toLocaleDateString('tr-TR')}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="size-4" />
                                                    <span>{session.startTime} - {session.endTime}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="size-4" />
                                                    <span>
                                                        {session.classroom?.building || 'Bina'} {session.classroom?.roomNumber || 'Derslik'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Link href={`/attendance/give/${session.id}`}>
                                        <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white">
                                            <Navigation className="size-4 mr-2" />
                                            Yoklama Ver
                                        </Button>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="text-muted-foreground">Yükleniyor...</div>
                </div>
            ) : attendance.length === 0 ? (
                <div className="text-center py-12">
                    <Calendar className="size-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Henüz yoklama kaydınız bulunmuyor</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {attendance.map((item, index) => {
                        const course = item.course || item.section?.course;
                        const percentage = item.attendancePercentage || 0;
                        const status = getStatusBadge(percentage);
                        const StatusIcon = status.icon;

                        return (
                            <motion.div
                                key={item.id || index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border hover:shadow-lg transition-all"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        {/* Course Info */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                                                <BookOpen className="size-4" />
                                            </div>
                                            <div>
                                                <div className="font-mono text-sm text-primary">
                                                    {course?.code}
                                                </div>
                                                <h3 className="text-lg font-semibold">
                                                    {course?.name}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Attendance Stats */}
                                        <div className="grid grid-cols-3 gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Toplam</p>
                                                <p className="text-lg font-semibold">
                                                    {item.totalSessions || 0}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Katıldı</p>
                                                <p className="text-lg font-semibold text-green-600">
                                                    {item.attendedSessions || 0}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Mazeretli</p>
                                                <p className="text-lg font-semibold text-yellow-600">
                                                    {item.excusedAbsences || 0}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium">Yoklama Oranı</span>
                                                <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                                    <StatusIcon className="size-3" />
                                                    <span>{status.label}</span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all ${
                                                        percentage >= 80
                                                            ? 'bg-green-600'
                                                            : percentage >= 70
                                                            ? 'bg-yellow-600'
                                                            : 'bg-red-600'
                                                    }`}
                                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                                />
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                %{percentage.toFixed(1)}
                                            </p>
                                        </div>

                                        {/* Attendance Trend Chart */}
                                        {item.attendanceTrend && (
                                            <AttendanceTrendChart
                                                trend={item.attendanceTrend}
                                                courseName={course?.code || `course-${item.id}`}
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Link href={`/courses/${course?.id}`} className="flex-1">
                                        <Button variant="outline" className="w-full">
                                            Ders Detayları
                                        </Button>
                                    </Link>
                                    {percentage < 80 && (
                                        <Link href="/excuse-requests" className="flex-1">
                                            <Button variant="outline" className="w-full">
                                                Mazeret Bildir
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
=======
                <h1 className="text-2xl lg:text-3xl font-bold">Devam Durumum</h1>
                <p className="text-muted-foreground mt-1">
                    Tüm derslerinizin yoklama istatistikleri
                </p>
            </motion.div>

            {/* Overall Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-4 gap-4"
            >
                <div className="p-6 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                    <BarChart3 className="size-8 mb-2" />
                    <p className="text-3xl font-bold">%{overallPercentage.toFixed(0)}</p>
                    <p className="text-white/80 text-sm">Genel Oran</p>
                </div>
                <div className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border">
                    <p className="text-3xl font-bold">{overallStats.total}</p>
                    <p className="text-muted-foreground text-sm">Toplam Oturum</p>
                </div>
                <div className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border">
                    <p className="text-3xl font-bold text-green-600">{overallStats.attended}</p>
                    <p className="text-muted-foreground text-sm">Katıldığım</p>
                </div>
                <div className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border">
                    <p className="text-3xl font-bold text-blue-600">{overallStats.excused}</p>
                    <p className="text-muted-foreground text-sm">Mazeretli</p>
                </div>
            </motion.div>

            {/* Course Cards */}
            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
                    ))}
                </div>
            ) : courses.length === 0 ? (
                <div className="text-center py-12">
                    <BookOpen className="size-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Yoklama verisi yok</h3>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {courses.map((course, index) => (
                        <motion.div
                            key={course.courseCode}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <AttendanceCard course={course} />
                        </motion.div>
                    ))}
>>>>>>> Stashed changes
                </div>
            )}
        </div>
    );
}
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
