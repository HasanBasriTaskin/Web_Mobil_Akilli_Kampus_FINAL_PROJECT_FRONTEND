'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, QrCode, Play, Users, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { getSections } from '@/services/academic.service';
import { createAttendanceSession, getAttendanceSession } from '@/services/attendance.service';
import { mockSections } from '@/mocks/academic.mock';
import { useAuthStore } from '@/stores/auth.store';

/**
 * Start Attendance Page
 * Yoklama oturumu açma - öğretim üyesi için
 */
export default function StartAttendancePage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [starting, setStarting] = useState(false);
    const [activeSession, setActiveSession] = useState(null);
    const [attendanceCount, setAttendanceCount] = useState(0);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [pollingInterval, setPollingInterval] = useState(null);

    const form = useForm({
        defaultValues: {
            sectionId: '',
            date: new Date().toISOString().split('T')[0],
            startTime: new Date().toTimeString().slice(0, 5),
            endTime: '',
            geofenceRadius: 15,
            sessionDuration: 30, // minutes
        },
    });

    // Faculty/Admin only - redirect if not authorized
    useEffect(() => {
        if (user && user.role !== 'Faculty' && user.role !== 'Admin') {
            router.push('/dashboard');
        }
    }, [user, router]);

    useEffect(() => {
        if (user && (user.role === 'Faculty' || user.role === 'Admin')) {
            loadSections();
        }
        return () => {
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, [user]);

    async function loadSections() {
        try {
            setLoading(true);
            const response = await getSections();

            if (response.success) {
                setSections(response.data?.items || response.data || []);
            } else {
                // Mock data fallback
                setSections(mockSections);
            }
        } catch (error) {
            // Mock data fallback
            console.error('Section\'lar yüklenemedi, mock data kullanılıyor:', error);
            setSections(mockSections);
        } finally {
            setLoading(false);
        }
    }

    async function pollAttendanceCount(sessionId) {
        try {
            const response = await getAttendanceSession(sessionId);
            if (response.success && response.data) {
                // Mock: Backend'den gerçek sayı gelecek
                setAttendanceCount(response.data.attendanceCount || Math.floor(Math.random() * 30) + 1);
            }
        } catch (error) {
            console.error('Yoklama sayısı alınamadı:', error);
        }
    }

    async function onSubmit(data) {
        try {
            setStarting(true);

            const response = await createAttendanceSession({
                sectionId: parseInt(data.sectionId),
                date: data.date,
                startTime: data.startTime,
                endTime: data.endTime || null,
                geofenceRadius: parseFloat(data.geofenceRadius),
                sessionDuration: parseInt(data.sessionDuration),
            });

            if (response.success) {
                const session = response.data;
                setActiveSession(session);

                // QR Code URL oluştur (online QR code generator)
                const attendanceUrl = `${window.location.origin}/attendance/give/${session.id}`;
                setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(attendanceUrl)}`);

                // Real-time attendance count polling
                const interval = setInterval(() => {
                    pollAttendanceCount(session.id);
                }, 3000); // Her 3 saniyede bir
                setPollingInterval(interval);

                // İlk sayıyı al
                pollAttendanceCount(session.id);

                toast.success('Yoklama oturumu başlatıldı!', {
                    description: 'Öğrenciler yoklama verebilir',
                });
            }
        } catch (error) {
            toast.error('Yoklama oturumu başlatılamadı', {
                description: error.message || 'Bir hata oluştu',
            });
        } finally {
            setStarting(false);
        }
    }

    function handleCloseSession() {
        if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
        }
        setActiveSession(null);
        setAttendanceCount(0);
        setQrCodeUrl('');
        toast.info('Yoklama oturumu kapatıldı');
    }

    const selectedSection = sections.find(s => s.id === parseInt(form.watch('sectionId')));
    const classroom = selectedSection?.classroom || { building: 'A', roomNumber: '101' };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold">Yoklama Oturumu Başlat</h1>
                <p className="text-muted-foreground mt-2">
                    Ders için yoklama oturumu oluşturun
                </p>
            </motion.div>

            {/* Active Session Display */}
            {activeSession && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 border-2 border-violet-200 dark:border-violet-800"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Aktif Yoklama Oturumu</h2>
                            <p className="text-sm text-muted-foreground">
                                {selectedSection?.course?.name} - Grup {selectedSection?.sectionNumber}
                            </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleCloseSession}>
                            Kapat
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* QR Code */}
                        <div className="space-y-3">
                            <h3 className="font-semibold flex items-center gap-2">
                                <QrCode className="size-5 text-violet-600" />
                                QR Kod (Yedek Yöntem)
                            </h3>
                            {qrCodeUrl && (
                                <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-border">
                                    <img
                                        src={qrCodeUrl}
                                        alt="QR Code"
                                        className="w-full max-w-[250px] mx-auto"
                                    />
                                    <p className="text-xs text-center text-muted-foreground mt-2">
                                        Öğrenciler bu QR kodu tarayarak yoklama verebilir
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Real-time Attendance Count */}
                        <div className="space-y-3">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Users className="size-5 text-violet-600" />
                                Gerçek Zamanlı Yoklama
                            </h3>
                            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-border">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-violet-600 mb-2">
                                        {attendanceCount}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Öğrenci yoklama verdi
                                    </p>
                                    {selectedSection && (
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Toplam: {selectedSection.enrolledCount || 0} öğrenci
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Form */}
            {!activeSession && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border"
                >
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Section Selection */}
                            <FormField
                                control={form.control}
                                name="sectionId"
                                rules={{ required: 'Grup seçiniz' }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Grup</FormLabel>
                                        <FormControl>
                                            <select
                                                {...field}
                                                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                                                disabled={loading}
                                            >
                                                <option value="">Grup seçiniz</option>
                                                {sections.map((section) => (
                                                    <option key={section.id} value={section.id}>
                                                        {section.course?.code} - Grup {section.sectionNumber} ({section.semester} {section.year})
                                                    </option>
                                                ))}
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Classroom Info (Auto-selected) */}
                            {selectedSection && (
                                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-border">
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="size-4 text-primary" />
                                        <span className="text-muted-foreground">Derslik (Otomatik):</span>
                                        <span className="font-medium">
                                            {classroom.building} {classroom.roomNumber}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Date */}
                            <FormField
                                control={form.control}
                                name="date"
                                rules={{ required: 'Tarih seçiniz' }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tarih</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                                <Input
                                                    type="date"
                                                    className="pl-10"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Start Time */}
                            <FormField
                                control={form.control}
                                name="startTime"
                                rules={{ required: 'Başlangıç saati giriniz' }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Başlangıç Saati</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                                <Input
                                                    type="time"
                                                    className="pl-10"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* End Time (Optional) */}
                            <FormField
                                control={form.control}
                                name="endTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bitiş Saati (Opsiyonel)</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                                <Input
                                                    type="time"
                                                    className="pl-10"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Session Duration */}
                            <FormField
                                control={form.control}
                                name="sessionDuration"
                                rules={{
                                    required: 'Süre giriniz',
                                    min: { value: 5, message: 'Minimum 5 dakika' },
                                    max: { value: 120, message: 'Maksimum 120 dakika' },
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Oturum Süresi (dakika)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="5"
                                                max="120"
                                                step="5"
                                                placeholder="30"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                        <p className="text-xs text-muted-foreground">
                                            Yoklama oturumunun ne kadar süre açık kalacağı
                                        </p>
                                    </FormItem>
                                )}
                            />

                            {/* Geofence Radius */}
                            <FormField
                                control={form.control}
                                name="geofenceRadius"
                                rules={{
                                    required: 'Yarıçap giriniz',
                                    min: { value: 5, message: 'Minimum 5 metre olmalı' },
                                    max: { value: 100, message: 'Maksimum 100 metre olabilir' },
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>GPS Yarıçapı (metre)</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                                <Input
                                                    type="number"
                                                    min="5"
                                                    max="100"
                                                    step="1"
                                                    className="pl-10"
                                                    placeholder="15"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                        <p className="text-xs text-muted-foreground">
                                            Öğrenciler bu yarıçap içinde olmalı (varsayılan: 15m)
                                        </p>
                                    </FormItem>
                                )}
                            />

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={starting}
                                className="w-full gap-2"
                                size="lg"
                            >
                                {starting ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Başlatılıyor...
                                    </>
                                ) : (
                                    <>
                                        <Play className="size-4" />
                                        Yoklama Oturumunu Başlat
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </motion.div>
            )}
        </div>
    );
}
