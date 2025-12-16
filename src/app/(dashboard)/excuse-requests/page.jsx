'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
<<<<<<< Updated upstream
    FileText,
    CheckCircle2,
    XCircle,
    Clock,
    Upload,
    Eye,
} from 'lucide-react';
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
import { useAuthStore } from '@/stores/auth.store';
import {
    getExcuseRequests,
    submitExcuseRequest,
    approveExcuseRequest,
    rejectExcuseRequest,
} from '@/services/attendance.service';
import { mockExcuseRequests } from '@/mocks/academic.mock';

/**
 * Excuse Requests Page
 * Mazeret talepleri - öğrenci ve öğretim üyesi için
 */
export default function ExcuseRequestsPage() {
    const { user } = useAuthStore();
    const isFaculty = user?.role === 'Faculty' || user?.role === 'Admin';
    const isStudent = user?.role === 'Student';

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [processing, setProcessing] = useState({});
    const [approveNote, setApproveNote] = useState('');
    const [rejectNote, setRejectNote] = useState('');
    const [showApproveModal, setShowApproveModal] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(null);

    const form = useForm({
        defaultValues: {
            sessionId: '',
            reason: '',
            document: null,
        },
    });

    useEffect(() => {
        if (isFaculty) {
            loadRequests();
        }
    }, [isFaculty]);
=======
    FileText, CheckCircle, XCircle, Clock,
    User, Calendar, ExternalLink, Search
} from 'lucide-react';
import { getExcuseRequests, approveExcuseRequest, rejectExcuseRequest } from '@/services/attendance.service';
import { toast } from 'sonner';

/**
 * Status Badge
 */
function StatusBadge({ status }) {
    const config = {
        Pending: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30', icon: Clock, label: 'Bekliyor' },
        Approved: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30', icon: CheckCircle, label: 'Onaylandı' },
        Rejected: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30', icon: XCircle, label: 'Reddedildi' }
    };

    const { color, icon: Icon, label } = config[status] || config.Pending;

    return (
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}>
            <Icon className="size-3" />
            <span>{label}</span>
        </div>
    );
}

/**
 * Excuse Request Card
 */
function ExcuseRequestCard({ request, onAction }) {
    const [notes, setNotes] = useState('');
    const [processing, setProcessing] = useState(false);

    async function handleApprove() {
        setProcessing(true);
        try {
            await approveExcuseRequest(request.id, { notes });
            toast.success('Talep onaylandı');
            onAction?.();
        } catch (error) {
            toast.error('İşlem başarısız');
        } finally {
            setProcessing(false);
        }
    }

    async function handleReject() {
        setProcessing(true);
        try {
            await rejectExcuseRequest(request.id, { notes });
            toast.success('Talep reddedildi');
            onAction?.();
        } catch (error) {
            toast.error('İşlem başarısız');
        } finally {
            setProcessing(false);
        }
    }

    const isPending = request.status === 'Pending' || request.status === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border"
        >
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-muted">
                        <User className="size-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold">{request.studentName}</h3>
                        <p className="text-sm text-muted-foreground">{request.studentNumber}</p>
                    </div>
                </div>
                <StatusBadge status={request.status} />
            </div>

            <div className="mt-4 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                        <Calendar className="size-4" />
                        <span>{new Date(request.sessionDate).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <span>•</span>
                    <span>{request.courseCode}</span>
                </div>
                <p className="text-sm">{request.reason}</p>
            </div>

            {request.documentUrl && (
                <a
                    href={request.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center gap-2 text-sm text-primary hover:underline"
                >
                    <ExternalLink className="size-4" />
                    <span>Belgeyi Görüntüle</span>
                </a>
            )}

            {isPending && (
                <div className="mt-4 space-y-3">
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Not ekle (opsiyonel)..."
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                        rows={2}
                    />
                    <div className="flex gap-3">
                        <button
                            onClick={handleApprove}
                            disabled={processing}
                            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 disabled:opacity-50 transition-colors"
                        >
                            <CheckCircle className="size-4" />
                            <span>Onayla</span>
                        </button>
                        <button
                            onClick={handleReject}
                            disabled={processing}
                            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 disabled:opacity-50 transition-colors"
                        >
                            <XCircle className="size-4" />
                            <span>Reddet</span>
                        </button>
                    </div>
                </div>
            )}

            {request.notes && !isPending && (
                <div className="mt-4 p-3 rounded-lg bg-muted/30 text-sm">
                    <p className="text-muted-foreground">Not: {request.notes}</p>
                </div>
            )}
        </motion.div>
    );
}

/**
 * Excuse Requests Page - Faculty
 */
export default function ExcuseRequestsPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('Pending');

    useEffect(() => {
        loadRequests();
    }, []);
>>>>>>> Stashed changes

    async function loadRequests() {
        try {
            setLoading(true);
            const response = await getExcuseRequests();
<<<<<<< Updated upstream
            
            if (response.success) {
                setRequests(response.data?.items || response.data || []);
            } else {
                // Mock data fallback
                setRequests(mockExcuseRequests);
            }
        } catch (error) {
            // Mock data fallback
            console.error('Mazeret talepleri yüklenemedi, mock data kullanılıyor:', error);
            setRequests(mockExcuseRequests);
=======
            setRequests(response.data || []);
        } catch (error) {
            toast.error('Talepler yüklenemedi');
            console.error(error);
>>>>>>> Stashed changes
        } finally {
            setLoading(false);
        }
    }

<<<<<<< Updated upstream
    async function onSubmit(data) {
        if (!data.document) {
            toast.error('Döküman gerekli', {
                description: 'Lütfen mazeret belgesi yükleyin',
            });
            return;
        }

        try {
            setSubmitting(true);
            
            const response = await submitExcuseRequest({
                sessionId: parseInt(data.sessionId),
                reason: data.reason,
                document: data.document,
            });
            
            if (response.success) {
                toast.success('Mazeret talebi gönderildi', {
                    description: 'Öğretim üyesi onayı bekleniyor',
                });
                form.reset();
            }
        } catch (error) {
            toast.error('Mazeret talebi gönderilemedi', {
                description: error.message || 'Bir hata oluştu',
            });
        } finally {
            setSubmitting(false);
        }
    }

    async function handleApprove(requestId) {
        try {
            setProcessing({ ...processing, [requestId]: true });
            
            const response = await approveExcuseRequest(requestId, {
                notes: approveNote || undefined,
            });
            
            if (response.success) {
                toast.success('Mazeret onaylandı');
                setApproveNote('');
                setShowApproveModal(null);
                loadRequests();
            }
        } catch (error) {
            toast.error('Onaylanamadı', {
                description: error.message || 'Bir hata oluştu',
            });
        } finally {
            setProcessing({ ...processing, [requestId]: false });
        }
    }

    async function handleReject(requestId) {
        try {
            setProcessing({ ...processing, [requestId]: true });
            
            const response = await rejectExcuseRequest(requestId, {
                notes: rejectNote || undefined,
            });
            
            if (response.success) {
                toast.success('Mazeret reddedildi');
                setRejectNote('');
                setShowRejectModal(null);
                loadRequests();
            }
        } catch (error) {
            toast.error('Reddedilemedi', {
                description: error.message || 'Bir hata oluştu',
            });
        } finally {
            setProcessing({ ...processing, [requestId]: false });
        }
    }
=======
    const filteredRequests = filter === 'all'
        ? requests
        : requests.filter(r => r.status === filter || (filter === 'Pending' && r.status === 0));

    const pendingCount = requests.filter(r => r.status === 'Pending' || r.status === 0).length;
>>>>>>> Stashed changes

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
<<<<<<< Updated upstream
            >
                <h1 className="text-3xl font-bold">
                    {isFaculty ? 'Mazeret Talepleri' : 'Mazeret Bildir'}
                </h1>
                <p className="text-muted-foreground mt-2">
                    {isFaculty
                        ? 'Öğrenci mazeret taleplerini görüntüleyin ve onaylayın'
                        : 'Devamsızlığınız için mazeret bildirin'}
                </p>
            </motion.div>

            {/* Student Form */}
            {isStudent && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border"
                >
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="sessionId"
                                rules={{ required: 'Session ID giriniz' }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Session ID</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Yoklama oturumu ID"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="reason"
                                rules={{ required: 'Mazeret sebebi giriniz' }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mazeret Sebebi</FormLabel>
                                        <FormControl>
                                            <textarea
                                                className="w-full px-3 py-2 border border-border rounded-lg bg-background min-h-[100px]"
                                                placeholder="Mazeret sebebinizi açıklayın..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="document"
                                rules={{ required: 'Döküman yükleyiniz' }}
                                render={({ field: { value, onChange, ...field } }) => (
                                    <FormItem>
                                        <FormLabel>Mazeret Belgesi</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) => onChange(e.target.files[0])}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" disabled={submitting} className="w-full">
                                {submitting ? 'Gönderiliyor...' : 'Mazeret Bildir'}
                            </Button>
                        </form>
                    </Form>
                </motion.div>
            )}

            {/* Faculty Requests List */}
            {isFaculty && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                >
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-muted-foreground">Yükleniyor...</div>
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="size-16 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">Bekleyen mazeret talebi yok</p>
                        </div>
                    ) : (
                        requests.map((request, index) => (
                            <motion.div
                                key={request.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-semibold">
                                                {request.student?.fullName || 'Öğrenci'}
                                            </span>
                                            {(request.status === 'Pending' || request.status === 'Beklemede') && (
                                                <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                                                    Beklemede
                                                </span>
                                            )}
                                            {(request.status === 'Approved' || request.status === 'Onaylandı') && (
                                                <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                                    Onaylandı
                                                </span>
                                            )}
                                            {(request.status === 'Rejected' || request.status === 'Reddedildi') && (
                                                <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                                                    Reddedildi
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            {request.reason}
                                        </p>
                                        {request.documentUrl && (
                                            <a
                                                href={request.documentUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-primary hover:underline text-sm mb-2"
                                            >
                                                <Eye className="size-4" />
                                                Belgeyi Görüntüle
                                            </a>
                                        )}
                                        {request.session && (
                                            <div className="text-xs text-muted-foreground mt-2">
                                                <span className="font-medium">Devamsızlık Tarihi:</span>{' '}
                                                {new Date(request.session.date).toLocaleDateString('tr-TR')} - {request.session.startTime}
                                            </div>
                                        )}
                                    </div>
                                    {(request.status === 'Pending' || request.status === 'Beklemede') && (
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => setShowApproveModal(request.id)}
                                                disabled={processing[request.id]}
                                                variant="outline"
                                                size="sm"
                                                className="gap-2"
                                            >
                                                <CheckCircle2 className="size-4" />
                                                Onayla
                                            </Button>
                                            <Button
                                                onClick={() => setShowRejectModal(request.id)}
                                                disabled={processing[request.id]}
                                                variant="destructive"
                                                size="sm"
                                                className="gap-2"
                                            >
                                                <XCircle className="size-4" />
                                                Reddet
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </motion.div>
            )}

            {/* Approve Modal */}
            {showApproveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-border max-w-md w-full mx-4"
                    >
                        <h3 className="text-lg font-semibold mb-4">Mazereti Onayla</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Not (Opsiyonel)</label>
                                <textarea
                                    value={approveNote}
                                    onChange={(e) => setApproveNote(e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background min-h-[100px]"
                                    placeholder="Onay notu ekleyin..."
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handleApprove(showApproveModal)}
                                    disabled={processing[showApproveModal]}
                                    className="flex-1 gap-2"
                                >
                                    <CheckCircle2 className="size-4" />
                                    Onayla
                                </Button>
                                <Button
                                    onClick={() => {
                                        setShowApproveModal(null);
                                        setApproveNote('');
                                    }}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    İptal
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-border max-w-md w-full mx-4"
                    >
                        <h3 className="text-lg font-semibold mb-4">Mazereti Reddet</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Red Sebebi (Opsiyonel)</label>
                                <textarea
                                    value={rejectNote}
                                    onChange={(e) => setRejectNote(e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background min-h-[100px]"
                                    placeholder="Red sebebini açıklayın..."
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handleReject(showRejectModal)}
                                    disabled={processing[showRejectModal]}
                                    variant="destructive"
                                    className="flex-1 gap-2"
                                >
                                    <XCircle className="size-4" />
                                    Reddet
                                </Button>
                                <Button
                                    onClick={() => {
                                        setShowRejectModal(null);
                                        setRejectNote('');
                                    }}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    İptal
                                </Button>
                            </div>
                        </div>
                    </motion.div>
=======
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold">Mazeret Talepleri</h1>
                    <p className="text-muted-foreground mt-1">
                        {pendingCount} bekleyen talep
                    </p>
                </div>
                <div className="flex gap-2">
                    {['Pending', 'Approved', 'Rejected', 'all'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted hover:bg-muted/80'
                                }`}
                        >
                            {f === 'all' ? 'Tümü' : f === 'Pending' ? 'Bekleyen' : f === 'Approved' ? 'Onaylanan' : 'Reddedilen'}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Request Cards */}
            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
                    ))}
                </div>
            ) : filteredRequests.length === 0 ? (
                <div className="text-center py-12">
                    <FileText className="size-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Talep bulunamadı</h3>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredRequests.map((request, index) => (
                        <motion.div
                            key={request.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <ExcuseRequestCard
                                request={request}
                                onAction={loadRequests}
                            />
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
