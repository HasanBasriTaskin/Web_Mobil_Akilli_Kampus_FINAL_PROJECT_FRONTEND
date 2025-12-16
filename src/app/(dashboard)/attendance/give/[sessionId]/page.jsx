'use client';

<<<<<<< Updated upstream
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

/**
 * Give Attendance Page
 * Yoklama verme - öğrenci için (GPS ile)
 */
export default function GiveAttendancePage() {
    const params = useParams();
    const router = useRouter();
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

    useEffect(() => {
        loadSession();
    }, [sessionId]);

    useEffect(() => {
        if (session && (session.status === 'Active' || session.status === 'Aktif')) {
            requestLocationPermission();
        }
    }, [session]);
=======
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    MapPin, Clock, CheckCircle, AlertTriangle,
    Loader2, Navigation, QrCode
} from 'lucide-react';
import { getSessionById, checkIn, calculateDistance } from '@/services/attendance.service';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

// Dynamic import for Leaflet (SSR issue)
const MapComponent = dynamic(() => import('@/components/attendance/MapComponent'), {
    ssr: false,
    loading: () => <div className="h-64 rounded-xl bg-muted animate-pulse" />
});

/**
 * Give Attendance Page - Student
 */
export default function GiveAttendancePage() {
    const params = useParams();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [location, setLocation] = useState(null);
    const [gettingLocation, setGettingLocation] = useState(false);
    const [distance, setDistance] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadSession();
    }, [params.sessionId]);
>>>>>>> Stashed changes

    async function loadSession() {
        try {
            setLoading(true);
<<<<<<< Updated upstream
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
=======
            const response = await getSessionById(params.sessionId);
            setSession(response.data);
        } catch (error) {
            setError('Oturum bulunamadı');
            console.error(error);
>>>>>>> Stashed changes
        } finally {
            setLoading(false);
        }
    }

<<<<<<< Updated upstream
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
=======
    function getCurrentLocation() {
        setGettingLocation(true);
        setError(null);

        if (!navigator.geolocation) {
            setError('Tarayıcınız konum özelliğini desteklemiyor');
            setGettingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const loc = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };
                setLocation(loc);
                setGettingLocation(false);

                // Calculate distance from classroom
                if (session) {
                    const dist = calculateDistance(
                        loc.latitude, loc.longitude,
                        session.latitude, session.longitude
>>>>>>> Stashed changes
                    );
                    setDistance(dist);
                }
            },
<<<<<<< Updated upstream
            (error) => {
                setLocationError('Konum alınamadı: ' + error.message);
=======
            (err) => {
                setError('Konum alınamadı: ' + err.message);
>>>>>>> Stashed changes
                setGettingLocation(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
<<<<<<< Updated upstream
                maximumAge: 0,
=======
                maximumAge: 0
>>>>>>> Stashed changes
            }
        );
    }

<<<<<<< Updated upstream
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
=======
    async function handleCheckIn() {
        if (!location) {
            toast.error('Lütfen önce konum izni verin');
            return;
        }

        setSubmitting(true);
        try {
            const response = await checkIn(params.sessionId, {
                latitude: location.latitude,
                longitude: location.longitude,
                accuracy: location.accuracy
            });

            setResult(response.data);
            toast.success(response.data.message || 'Yoklama başarılı!');
        } catch (error) {
            toast.error(error.message || 'Yoklama başarısız');
            setError(error.message);
        } finally {
            setSubmitting(false);
>>>>>>> Stashed changes
        }
    }

    if (loading) {
        return (
<<<<<<< Updated upstream
            <div className="flex items-center justify-center py-12">
                <Loader2 className="size-6 animate-spin text-primary" />
=======
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="size-8 animate-spin text-primary" />
>>>>>>> Stashed changes
            </div>
        );
    }

<<<<<<< Updated upstream
    if (!session) {
        return null;
    }

    const isWithinRange = distance !== null && distance <= session.geofenceRadius + 5;
    const canCheckIn = location && isWithinRange && (session.status === 'Active' || session.status === 'Aktif');

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold">Yoklama Ver</h1>
                <p className="text-muted-foreground mt-2">
                    {session.section?.course?.name || 'Ders'} - Grup {session.section?.sectionNumber}
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
                            <p className="font-medium">{session.section?.course?.name || 'Ders'}</p>
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
                    disabled={!canCheckIn || checkingIn || (session.status !== 'Active' && session.status !== 'Aktif')}
                    className="w-full gap-2"
                    size="lg"
                >
                    {checkingIn ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            Yoklama veriliyor...
                        </>
                    ) : (session.status !== 'Active' && session.status !== 'Aktif') ? (
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
                    disabled={checkingIn || (session.status !== 'Active' && session.status !== 'Aktif')}
                >
                    <QrCode className="size-4" />
                    QR Kod ile Tarama
                </Button>
            </motion.div>
=======
    if (error && !session) {
        return (
            <div className="text-center py-12">
                <AlertTriangle className="size-12 mx-auto text-red-500" />
                <h3 className="mt-4 text-lg font-medium">{error}</h3>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Session Info */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-xl bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-600 text-white"
            >
                <div className="flex items-center gap-2 text-white/80">
                    <Clock className="size-4" />
                    <span>{new Date(session?.date).toLocaleDateString('tr-TR')}</span>
                </div>
                <h1 className="text-2xl font-bold mt-2">{session?.courseName}</h1>
                <p className="text-white/80 mt-1">
                    {session?.courseCode} - Seksiyon {session?.sectionNumber}
                </p>
            </motion.div>

            {/* Result Card */}
            {result && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-6 rounded-xl ${result.isFlagged
                            ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                            : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        } border`}
                >
                    <div className="flex items-center gap-3">
                        {result.isFlagged ? (
                            <AlertTriangle className="size-8 text-yellow-600" />
                        ) : (
                            <CheckCircle className="size-8 text-green-600" />
                        )}
                        <div>
                            <h3 className="font-bold text-lg">
                                {result.success ? 'Yoklama Kaydedildi' : 'İşlem Tamamlandı'}
                            </h3>
                            <p className="text-sm text-muted-foreground">{result.message}</p>
                            {result.distanceFromCenter !== undefined && (
                                <p className="text-sm mt-1">
                                    Merkeze uzaklık: {result.distanceFromCenter.toFixed(1)}m
                                </p>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Location & Map */}
            {!result && (
                <>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border"
                    >
                        <h2 className="text-lg font-semibold mb-4">Konumunuz</h2>

                        {/* Map */}
                        <div className="h-64 rounded-xl overflow-hidden mb-4">
                            {session && (
                                <MapComponent
                                    center={[session.latitude, session.longitude]}
                                    userLocation={location ? [location.latitude, location.longitude] : null}
                                    radius={session.geofenceRadius}
                                />
                            )}
                        </div>

                        {/* Location Info */}
                        <div className="p-4 rounded-lg bg-muted/50">
                            {gettingLocation ? (
                                <div className="flex items-center gap-3">
                                    <Loader2 className="size-5 animate-spin text-primary" />
                                    <span>Konum alınıyor...</span>
                                </div>
                            ) : location ? (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-green-600">
                                        <CheckCircle className="size-5" />
                                        <span className="font-medium">Konum alındı</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                                    </p>
                                    {distance !== null && (
                                        <p className={`text-sm font-medium ${distance <= session?.geofenceRadius
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                            }`}>
                                            Sınıfa uzaklık: {distance.toFixed(1)}m
                                            {distance <= session?.geofenceRadius
                                                ? ' ✓ Geofence içinde'
                                                : ` ✗ Geofence dışında (max ${session?.geofenceRadius}m)`
                                            }
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={getCurrentLocation}
                                    className="flex items-center gap-2 text-primary hover:underline"
                                >
                                    <Navigation className="size-5" />
                                    <span>Konum İzni Ver</span>
                                </button>
                            )}
                        </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-3"
                    >
                        <button
                            onClick={handleCheckIn}
                            disabled={submitting || !location}
                            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-primary text-primary-foreground font-medium text-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="size-5 animate-spin" />
                                    <span>Gönderiliyor...</span>
                                </>
                            ) : (
                                <>
                                    <MapPin className="size-5" />
                                    <span>Yoklama Ver</span>
                                </>
                            )}
                        </button>

                        <button
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border hover:bg-muted transition-colors"
                        >
                            <QrCode className="size-5" />
                            <span>QR Kod ile Gir (Bonus)</span>
                        </button>
                    </motion.div>
                </>
            )}
>>>>>>> Stashed changes
        </div>
    );
}
