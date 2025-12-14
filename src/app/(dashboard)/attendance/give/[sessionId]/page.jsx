'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    MapPin,
    CheckCircle2,
    XCircle,
    Loader2,
    AlertCircle,
    Calendar,
    Clock,
    QrCode,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { getAttendanceSession, checkIn } from '@/services/attendance.service';
import { mockAttendanceSessions } from '@/mocks/academic.mock';
import { useAuthStore } from '@/stores/auth.store';

/**
 * Give Attendance Page
 * Yoklama verme - öğrenci için (GPS ile)
 */
export default function GiveAttendancePage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuthStore();
    const sessionId = params.sessionId;
    const mapRef = useRef(null);
    const qrInputRef = useRef(null);

    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkingIn, setCheckingIn] = useState(false);
    const [location, setLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [distance, setDistance] = useState(null);
    const [gettingLocation, setGettingLocation] = useState(false);
    const [showQRScanner, setShowQRScanner] = useState(false);

    // Student only - redirect if not student
    useEffect(() => {
        if (user && user.role !== 'Student') {
            router.push('/dashboard');
        }
    }, [user, router]);

    useEffect(() => {
        loadSession();
    }, [sessionId]);

    useEffect(() => {
        // Scheduled, Active veya Aktif durumlarında konum izni iste
        if (session && ['Active', 'Aktif', 'Scheduled'].includes(session.status)) {
            requestLocationPermission();
        }
    }, [session]);

    async function loadSession() {
        try {
            setLoading(true);
            const response = await getAttendanceSession(sessionId);

            if (response.success) {
                setSession(response.data);
            } else {
                // Mock data fallback
                const mockSession = mockAttendanceSessions.find(s => s.id === parseInt(sessionId));
                if (mockSession) setSession(mockSession);
            }
        } catch (error) {
            // Mock data fallback
            console.error('Yoklama oturumu yüklenemedi, mock data kullanılıyor:', error);
            const mockSession = mockAttendanceSessions.find(s => s.id === parseInt(sessionId));
            if (mockSession) {
                setSession(mockSession);
            } else {
                toast.error('Yoklama oturumu bulunamadı', {
                    description: error.message || 'Bir hata oluştu',
                });
                router.push('/my-attendance');
            }
        } finally {
            setLoading(false);
        }
    }

    function requestLocationPermission() {
        if (!navigator.geolocation) {
            setLocationError('Tarayıcınız GPS desteklemiyor');
            return;
        }

        setGettingLocation(true);
        setLocationError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                setLocation({ latitude, longitude, accuracy });
                setGettingLocation(false);

                // Mesafe hesapla (Haversine formula)
                if (session?.latitude && session?.longitude) {
                    const dist = calculateDistance(
                        latitude,
                        longitude,
                        session.latitude,
                        session.longitude
                    );
                    setDistance(dist);
                }
            },
            (error) => {
                setLocationError('Konum alınamadı: ' + error.message);
                setGettingLocation(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    }

    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // Earth radius in meters
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in meters
    }

    async function handleCheckIn() {
        if (!location) {
            toast.error('Konum alınamadı', {
                description: 'Lütfen konum iznini verin',
            });
            requestLocationPermission();
            return;
        }

        if (distance > session.geofenceRadius + 5) {
            toast.error('Yoklama verilemedi', {
                description: `Derslikten çok uzaktasınız (${distance.toFixed(1)}m)`,
            });
            return;
        }

        try {
            setCheckingIn(true);

            const response = await checkIn(sessionId, {
                latitude: location.latitude,
                longitude: location.longitude,
                accuracy: location.accuracy,
            });

            if (response.success) {
                toast.success('Yoklama verildi!', {
                    description: 'Yoklamanız başarıyla kaydedildi',
                });
                router.push('/my-attendance');
            }
        } catch (error) {
            toast.error('Yoklama verilemedi', {
                description: error.message || 'Bir hata oluştu',
            });
        } finally {
            setCheckingIn(false);
        }
    }

    function handleQRScan() {
        setShowQRScanner(true);
        // QR code scanner implementation would go here
        // For now, just show input field
    }

    function handleQRCodeSubmit() {
        const qrCode = qrInputRef.current?.value;
        if (!qrCode) {
            toast.error('QR kod giriniz');
            return;
        }

        // Verify QR code matches session
        if (qrCode === session.qrCode || qrCode === sessionId) {
            handleCheckIn();
        } else {
            toast.error('Geçersiz QR kod');
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="size-6 animate-spin text-primary" />
            </div>
        );
    }

    if (!session) {
        return null;
    }

    const isWithinRange = distance !== null && distance <= session.geofenceRadius + 5;
    // Scheduled, Active veya Aktif durumlarında yoklama verilebilir
    const isSessionActive = ['Active', 'Aktif', 'Scheduled'].includes(session.status);
    const canCheckIn = location && isWithinRange && isSessionActive;

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold">Yoklama Ver</h1>
                <p className="text-muted-foreground mt-2">
                    {session.courseName || session.section?.course?.name || 'Ders'} - Grup {session.sectionNumber || session.section?.sectionNumber}
                </p>
            </motion.div>

            {/* Session Info */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border"
            >
                <h2 className="text-lg font-semibold mb-4">Yoklama Oturumu Bilgileri</h2>
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <Calendar className="size-5 text-primary" />
                        <div>
                            <p className="text-sm text-muted-foreground">Ders</p>
                            <p className="font-medium">{session.courseName || session.section?.course?.name || 'Ders'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Clock className="size-5 text-primary" />
                        <div>
                            <p className="text-sm text-muted-foreground">Saat</p>
                            <p className="font-medium">{session.startTime} - {session.endTime}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <MapPin className="size-5 text-primary" />
                        <div>
                            <p className="text-sm text-muted-foreground">Konum</p>
                            <p className="font-medium">
                                {session.classroom?.building || 'Bina'} {session.classroom?.roomNumber || 'Derslik'}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* GPS Permission & Location Status */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border"
            >
                <h2 className="text-lg font-semibold mb-4">Konum Durumu</h2>

                {gettingLocation ? (
                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                        <Loader2 className="size-5 animate-spin" />
                        <span>Konum alınıyor...</span>
                    </div>
                ) : locationError ? (
                    <div className="flex items-center gap-2 text-red-600 mb-4">
                        <AlertCircle className="size-5" />
                        <span>{locationError}</span>
                    </div>
                ) : !location ? (
                    <div className="text-center py-4">
                        <p className="text-muted-foreground mb-4">Konum izni verin</p>
                        <Button onClick={requestLocationPermission} variant="outline">
                            GPS İzni İste
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            {isWithinRange ? (
                                <CheckCircle2 className="size-5 text-green-600" />
                            ) : (
                                <XCircle className="size-5 text-red-600" />
                            )}
                            <span className={isWithinRange ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                {isWithinRange
                                    ? 'Derslik alanı içindesiniz'
                                    : 'Derslik alanı dışındasınız'}
                            </span>
                        </div>

                        {distance !== null && (
                            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                <div className="text-sm">
                                    <span className="text-muted-foreground">Derslikten Mesafe: </span>
                                    <span className="font-bold text-lg">{distance.toFixed(1)}m</span>
                                </div>
                            </div>
                        )}

                        {location?.accuracy && (
                            <div className="text-xs text-muted-foreground">
                                <span className="font-medium">Konum Doğruluğu: </span>
                                <span>±{location.accuracy.toFixed(1)}m</span>
                            </div>
                        )}
                    </div>
                )}
            </motion.div>

            {/* Mini Map */}
            {location && session.latitude && session.longitude && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border"
                >
                    <h2 className="text-lg font-semibold mb-4">Konum Haritası</h2>
                    <div className="relative h-64 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 border border-border">
                        <iframe
                            ref={mapRef}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${Math.min(location.longitude, session.longitude) - 0.001},${Math.min(location.latitude, session.latitude) - 0.001},${Math.max(location.longitude, session.longitude) + 0.001},${Math.max(location.latitude, session.latitude) + 0.001}&layer=mapnik&marker=${location.latitude},${location.longitude}&marker=${session.latitude},${session.longitude}`}
                        />
                        <div className="absolute top-4 left-4 bg-white dark:bg-slate-800 px-3 py-2 rounded-lg shadow-lg border border-border">
                            <div className="flex items-center gap-2 text-sm">
                                <div className="size-3 rounded-full bg-blue-500"></div>
                                <span className="font-medium">Sizin Konumunuz</span>
                            </div>
                        </div>
                        <div className="absolute top-4 right-4 bg-white dark:bg-slate-800 px-3 py-2 rounded-lg shadow-lg border border-border">
                            <div className="flex items-center gap-2 text-sm">
                                <div className="size-3 rounded-full bg-red-500"></div>
                                <span className="font-medium">Derslik</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* QR Code Scanner (Bonus) */}
            {showQRScanner && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border"
                >
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <QrCode className="size-5 text-primary" />
                        QR Kod Tarama
                    </h2>
                    <div className="space-y-4">
                        <input
                            ref={qrInputRef}
                            type="text"
                            placeholder="QR kodu girin veya tarayın"
                            className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                        />
                        <div className="flex gap-2">
                            <Button onClick={handleQRCodeSubmit} className="flex-1">
                                QR Kod ile Yoklama Ver
                            </Button>
                            <Button onClick={() => setShowQRScanner(false)} variant="outline">
                                İptal
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-3"
            >
                <Button
                    onClick={handleCheckIn}
                    disabled={!canCheckIn || checkingIn || !isSessionActive}
                    className="w-full gap-2"
                    size="lg"
                >
                    {checkingIn ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            Yoklama veriliyor...
                        </>
                    ) : !isSessionActive ? (
                        'Yoklama oturumu aktif değil'
                    ) : !location ? (
                        'Konum bekleniyor...'
                    ) : !isWithinRange ? (
                        'Derslik alanına yaklaşın'
                    ) : (
                        <>
                            <CheckCircle2 className="size-4" />
                            Yoklama Ver
                        </>
                    )}
                </Button>

                {/* QR Code Button (Bonus) */}
                <Button
                    onClick={handleQRScan}
                    variant="outline"
                    className="w-full gap-2"
                    disabled={checkingIn || !isSessionActive}
                >
                    <QrCode className="size-4" />
                    QR Kod ile Tarama
                </Button>
            </motion.div>
        </div>
    );
}
