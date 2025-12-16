'use client';

import { useState, useEffect } from 'react';
<<<<<<< Updated upstream
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

/**
 * Start Attendance Page
 * Yoklama oturumu açma - öğretim üyesi için
 */
export default function StartAttendancePage() {
    const router = useRouter();
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

    useEffect(() => {
        loadSections();
        return () => {
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, []);

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
=======
import { motion } from 'framer-motion';
import {
    MapPin, Clock, QrCode, Users, Play,
    Copy, CheckCircle, AlertCircle
} from 'lucide-react';
import { getMySessions, createSession, closeSession } from '@/services/attendance.service';
import { toast } from 'sonner';

/**
 * QR Code Display Component
 */
function QRCodeDisplay({ code }) {
    const [copied, setCopied] = useState(false);

    async function handleCopy() {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success('Kod kopyalandı');
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="p-6 rounded-xl bg-muted/30 text-center">
            <div className="w-48 h-48 mx-auto bg-white rounded-xl flex items-center justify-center">
                <QrCode className="size-32 text-primary" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Öğrenciler bu kodu kullanabilir:</p>
            <div className="mt-2 flex items-center justify-center gap-2">
                <code className="px-4 py-2 rounded-lg bg-muted font-mono text-sm">
                    {code?.slice(0, 20)}...
                </code>
                <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                    {copied ? <CheckCircle className="size-5 text-green-500" /> : <Copy className="size-5" />}
                </button>
            </div>
        </div>
    );
}

/**
 * Active Session Card
 */
function ActiveSessionCard({ session, onClose }) {
    const [closing, setClosing] = useState(false);

    async function handleClose() {
        setClosing(true);
        try {
            await closeSession(session.id);
            toast.success('Oturum kapatıldı');
            onClose?.();
        } catch (error) {
            toast.error('Kapatma başarısız');
        } finally {
            setClosing(false);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-white/80 text-sm">Aktif Oturum</p>
                    <h3 className="text-xl font-bold mt-1">{session.courseName}</h3>
                    <p className="text-white/80 mt-1">Seksiyon {session.sectionNumber}</p>
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-2 text-white/80">
                        <Users className="size-4" />
                        <span>{session.presentCount || 0} / {session.totalStudents || 0}</span>
                    </div>
                </div>
            </div>

            <QRCodeDisplay code={session.qrCode} />

            <button
                onClick={handleClose}
                disabled={closing}
                className="mt-4 w-full py-3 rounded-lg bg-white/20 hover:bg-white/30 font-medium transition-colors disabled:opacity-50"
            >
                {closing ? 'Kapatılıyor...' : 'Oturumu Kapat'}
            </button>
        </motion.div>
    );
}

/**
 * Start Attendance Page - Faculty
 */
export default function StartAttendancePage() {
    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState('');
    const [geofenceRadius, setGeofenceRadius] = useState(15);
    const [duration, setDuration] = useState(15);
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeSession, setActiveSession] = useState(null);
    const [gettingLocation, setGettingLocation] = useState(false);

    useEffect(() => {
        loadSessions();
        getCurrentLocation();
    }, []);

    async function loadSessions() {
        try {
            const response = await getMySessions();
            const sessions = response.data || [];
            // Find active session
            const active = sessions.find(s => s.status === 'Open' || s.status === 0);
            setActiveSession(active || null);

            // Mock sections - in real app, fetch from API
            setSections([
                { id: 1, name: 'CS101 - Introduction to Programming', sectionNumber: '01' },
                { id: 2, name: 'CS201 - Data Structures', sectionNumber: '01' },
                { id: 3, name: 'CS301 - Algorithms', sectionNumber: '01' }
            ]);
        } catch (error) {
            console.error(error);
        }
    }

    function getCurrentLocation() {
        setGettingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    });
                    setGettingLocation(false);
                },
                (error) => {
                    toast.error('Konum alınamadı: ' + error.message);
                    setGettingLocation(false);
                },
                { enableHighAccuracy: true }
            );
        } else {
            toast.error('Tarayıcınız konum özelliğini desteklemiyor');
            setGettingLocation(false);
        }
    }

    async function handleStartSession() {
        if (!selectedSection) {
            toast.error('Lütfen bir seksiyon seçin');
            return;
        }
        if (!location) {
            toast.error('Lütfen konum izni verin');
            return;
        }

        setLoading(true);
        try {
            const startTime = new Date().toISOString();
            const endTime = new Date(Date.now() + duration * 60 * 1000).toISOString();

            const response = await createSession({
                sectionId: parseInt(selectedSection),
                date: new Date().toISOString().split('T')[0],
                startTime,
                endTime,
                latitude: location.latitude,
                longitude: location.longitude,
                geofenceRadius
            });

            setActiveSession(response.data);
            toast.success('Yoklama oturumu başlatıldı');
        } catch (error) {
            toast.error(error.message || 'Oturum başlatılamadı');
>>>>>>> Stashed changes
        } finally {
            setLoading(false);
        }
    }

<<<<<<< Updated upstream
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

=======
>>>>>>> Stashed changes
    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
<<<<<<< Updated upstream
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
=======
                <h1 className="text-2xl lg:text-3xl font-bold">Yoklama Başlat</h1>
                <p className="text-muted-foreground mt-1">GPS tabanlı yoklama oturumu oluşturun</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active Session or Create Form */}
                {activeSession ? (
                    <ActiveSessionCard session={activeSession} onClose={loadSessions} />
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border space-y-6"
                    >
                        <h2 className="text-lg font-semibold">Yeni Oturum</h2>

                        {/* Section Select */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Seksiyon</label>
                            <select
                                value={selectedSection}
                                onChange={(e) => setSelectedSection(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="">Seksiyon seçin...</option>
                                {sections.map(s => (
                                    <option key={s.id} value={s.id}>
                                        {s.name} - Seksiyon {s.sectionNumber}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Geofence Radius */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Geofence Yarıçapı: {geofenceRadius}m
                            </label>
                            <input
                                type="range"
                                min="5"
                                max="50"
                                value={geofenceRadius}
                                onChange={(e) => setGeofenceRadius(Number(e.target.value))}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>5m</span>
                                <span>50m</span>
                            </div>
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Süre: {duration} dakika
                            </label>
                            <input
                                type="range"
                                min="5"
                                max="60"
                                step="5"
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        {/* Location Status */}
                        <div className="p-4 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3">
                                <MapPin className={`size-5 ${location ? 'text-green-500' : 'text-yellow-500'}`} />
                                <div className="flex-1">
                                    <p className="font-medium">
                                        {gettingLocation ? 'Konum alınıyor...' : location ? 'Konum alındı' : 'Konum gerekli'}
                                    </p>
                                    {location && (
                                        <p className="text-xs text-muted-foreground">
                                            {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)} (±{location.accuracy?.toFixed(0)}m)
                                        </p>
                                    )}
                                </div>
                                {!location && !gettingLocation && (
                                    <button
                                        onClick={getCurrentLocation}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        Yenile
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Start Button */}
                        <button
                            onClick={handleStartSession}
                            disabled={loading || !location || !selectedSection}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                        >
                            <Play className="size-5" />
                            <span>{loading ? 'Başlatılıyor...' : 'Oturumu Başlat'}</span>
                        </button>
                    </motion.div>
                )}

                {/* Info Card */}
>>>>>>> Stashed changes
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border"
                >
<<<<<<< Updated upstream
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
=======
                    <h3 className="text-lg font-semibold mb-4">Nasıl Çalışır?</h3>
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 h-fit">
                                <MapPin className="size-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium">GPS Tabanlı</p>
                                <p className="text-sm text-muted-foreground">
                                    Öğrenciler belirlenen yarıçap içinde olmalı
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 h-fit">
                                <QrCode className="size-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium">QR Kod Desteği</p>
                                <p className="text-sm text-muted-foreground">
                                    Alternatif olarak QR kod ile giriş
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 h-fit">
                                <AlertCircle className="size-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium">Sahtecilik Tespiti</p>
                                <p className="text-sm text-muted-foreground">
                                    Şüpheli konumlar otomatik işaretlenir
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
>>>>>>> Stashed changes
        </div>
    );
}
