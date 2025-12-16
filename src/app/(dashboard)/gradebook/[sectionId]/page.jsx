'use client';

import { useState, useEffect } from 'react';
<<<<<<< Updated upstream
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save, Users, BookOpen, Download, Send, CheckSquare } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getSectionStudents, submitGrade, updateGrade } from '@/services/academic.service';
import { useAuthStore } from '@/stores/auth.store';
import { mockEnrollments } from '@/mocks/academic.mock';
import { useRouter } from 'next/navigation';

/**
 * Gradebook Page
 * Not defteri - öğretim üyesi için
=======
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Save, Users, BookOpen,
    Download, Mail, CheckCircle
} from 'lucide-react';
import { getStudentsBySection } from '@/services/enrollment.service';
import { enterGradesBatch, calculateLetterGrade } from '@/services/grade.service';
import { toast } from 'sonner';

/**
 * Gradebook Page - Faculty
>>>>>>> Stashed changes
 */
export default function GradebookPage() {
    const params = useParams();
    const router = useRouter();
<<<<<<< Updated upstream
    const { user } = useAuthStore();
    const sectionId = params.sectionId;

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState({});
    const [grades, setGrades] = useState({});
    const [selectedStudents, setSelectedStudents] = useState(new Set());
    const [exporting, setExporting] = useState(false);
    const [sendingNotifications, setSendingNotifications] = useState(false);

    // Faculty only - redirect if not faculty
    useEffect(() => {
        if (user && user.role !== 'Faculty' && user.role !== 'Admin') {
            router.push('/dashboard');
        }
    }, [user, router]);

    useEffect(() => {
        loadStudents();
    }, [sectionId]);
=======
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [grades, setGrades] = useState({});

    useEffect(() => {
        loadStudents();
    }, [params.sectionId]);
>>>>>>> Stashed changes

    async function loadStudents() {
        try {
            setLoading(true);
<<<<<<< Updated upstream
            const response = await getSectionStudents(sectionId);
            
            if (response.success) {
                const studentsData = response.data?.items || response.data || [];
                setStudents(studentsData);
                
                // Mevcut notları state'e yükle
                const gradesMap = {};
                studentsData.forEach((enrollment) => {
                    gradesMap[enrollment.id] = {
                        midtermGrade: enrollment.midtermGrade || '',
                        finalGrade: enrollment.finalGrade || '',
                        homeworkGrade: enrollment.homeworkGrade || '',
                    };
                });
                setGrades(gradesMap);
            } else {
                // Mock data fallback
                const mockStudents = mockEnrollments.filter(e => e.section.id === parseInt(sectionId));
                setStudents(mockStudents);
                const gradesMap = {};
                mockStudents.forEach((enrollment) => {
                    gradesMap[enrollment.id] = {
                        midtermGrade: enrollment.midtermGrade || '',
                        finalGrade: enrollment.finalGrade || '',
                        homeworkGrade: '',
                    };
                });
                setGrades(gradesMap);
            }
        } catch (error) {
            // Mock data fallback
            console.error('Öğrenci listesi yüklenemedi, mock data kullanılıyor:', error);
            const mockStudents = mockEnrollments.filter(e => e.section.id === parseInt(sectionId));
            setStudents(mockStudents);
            const gradesMap = {};
            mockStudents.forEach((enrollment) => {
                gradesMap[enrollment.id] = {
                    midtermGrade: enrollment.midtermGrade || '',
                    finalGrade: enrollment.finalGrade || '',
                    homeworkGrade: '',
                };
            });
            setGrades(gradesMap);
=======
            const response = await getStudentsBySection(params.sectionId);
            const studentList = response.data || [];
            setStudents(studentList);

            // Initialize grades state
            const initialGrades = {};
            studentList.forEach(s => {
                initialGrades[s.studentId] = {
                    midterm: s.midtermGrade ?? '',
                    final: s.finalGrade ?? '',
                    letter: s.letterGrade ?? ''
                };
            });
            setGrades(initialGrades);
        } catch (error) {
            toast.error('Öğrenciler yüklenemedi');
            console.error(error);
>>>>>>> Stashed changes
        } finally {
            setLoading(false);
        }
    }

<<<<<<< Updated upstream
    function calculateLetterGrade(midterm, final, homework) {
        const midtermNum = parseFloat(midterm) || 0;
        const finalNum = parseFloat(final) || 0;
        const homeworkNum = parseFloat(homework) || 0;
        
        // Vize %30, Final %50, Ödev %20 (standart ağırlık)
        const total = (midtermNum * 0.3) + (finalNum * 0.5) + (homeworkNum * 0.2);
        
        if (total >= 90) return 'A+';
        if (total >= 85) return 'A';
        if (total >= 80) return 'A-';
        if (total >= 75) return 'B+';
        if (total >= 70) return 'B';
        if (total >= 65) return 'B-';
        if (total >= 60) return 'C+';
        if (total >= 55) return 'C';
        if (total >= 50) return 'C-';
        if (total >= 45) return 'D+';
        if (total >= 40) return 'D';
        return 'F';
    }

    function handleGradeChange(enrollmentId, field, value) {
        const updatedGrades = {
            ...grades,
            [enrollmentId]: {
                ...grades[enrollmentId],
                [field]: value,
            },
        };
        
        // Auto-calculate letter grade
        const gradeData = updatedGrades[enrollmentId];
        if (gradeData.midtermGrade || gradeData.finalGrade || gradeData.homeworkGrade) {
            const calculatedGrade = calculateLetterGrade(
                gradeData.midtermGrade,
                gradeData.finalGrade,
                gradeData.homeworkGrade
            );
            // Update the enrollment's letter grade in the display
            // Note: This is just for preview, actual save will be done via API
        }
        
        setGrades(updatedGrades);
    }

    async function handleSaveGrade(enrollmentId) {
        try {
            setSaving({ ...saving, [enrollmentId]: true });
            
            const gradeData = grades[enrollmentId];
            const response = await submitGrade({
                enrollmentId,
                ...gradeData,
            });
            
            if (response.success) {
                toast.success('Not kaydedildi', {
                    description: 'Öğrenci notu başarıyla güncellendi',
                });
                loadStudents();
            }
        } catch (error) {
            toast.error('Not kaydedilemedi', {
                description: error.message || 'Bir hata oluştu',
            });
        } finally {
            setSaving({ ...saving, [enrollmentId]: false });
        }
    }

    function handleSelectAll() {
        if (selectedStudents.size === students.length) {
            setSelectedStudents(new Set());
        } else {
            setSelectedStudents(new Set(students.map(s => s.id)));
        }
    }

    function handleToggleStudent(studentId) {
        const newSelected = new Set(selectedStudents);
        if (newSelected.has(studentId)) {
            newSelected.delete(studentId);
        } else {
            newSelected.add(studentId);
        }
        setSelectedStudents(newSelected);
    }

    async function handleExport() {
        try {
            setExporting(true);
            
            // CSV export
            const headers = ['Öğrenci Adı', 'Öğrenci No', 'Vize', 'Final', 'Ödev', 'Harf Notu'];
            const rows = students.map(enrollment => {
                const student = enrollment.student || enrollment.user;
                const gradeData = grades[enrollment.id] || {};
                return [
                    student?.fullName || '',
                    student?.studentNumber || '',
                    gradeData.midtermGrade || '',
                    gradeData.finalGrade || '',
                    gradeData.homeworkGrade || '',
                    enrollment.letterGrade || ''
                ];
            });
            
            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.join(','))
            ].join('\n');
            
            const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `notlar_${sectionId}_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            toast.success('Notlar dışa aktarıldı');
        } catch (error) {
            toast.error('Dışa aktarma başarısız', {
                description: error.message || 'Bir hata oluştu',
            });
        } finally {
            setExporting(false);
        }
    }

    async function handleSendNotifications() {
        if (selectedStudents.size === 0) {
            toast.error('Lütfen en az bir öğrenci seçin');
            return;
        }

        try {
            setSendingNotifications(true);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            toast.success('Bildirimler gönderildi', {
                description: `${selectedStudents.size} öğrenciye bildirim gönderildi`,
            });
            
            setSelectedStudents(new Set());
        } catch (error) {
            toast.error('Bildirimler gönderilemedi', {
                description: error.message || 'Bir hata oluştu',
            });
        } finally {
            setSendingNotifications(false);
        }
    }

    // Faculty only access
    if (user && user.role !== 'Faculty' && user.role !== 'Admin') {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <p className="text-muted-foreground">Bu sayfaya erişim yetkiniz yok.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Yükleniyor...</div>
            </div>
        );
=======
    function handleGradeChange(studentId, field, value) {
        const numValue = value === '' ? '' : Math.min(100, Math.max(0, Number(value)));

        setGrades(prev => {
            const updated = { ...prev };
            updated[studentId] = { ...updated[studentId], [field]: numValue };

            // Auto-calculate letter grade
            const mid = field === 'midterm' ? numValue : updated[studentId].midterm;
            const fin = field === 'final' ? numValue : updated[studentId].final;

            if (mid !== '' && fin !== '') {
                updated[studentId].letter = calculateLetterGrade(Number(mid), Number(fin));
            }

            return updated;
        });
    }

    async function handleSave() {
        setSaving(true);
        try {
            const gradeEntries = students
                .filter(s => grades[s.studentId]?.midterm !== '' || grades[s.studentId]?.final !== '')
                .map(s => ({
                    enrollmentId: s.enrollmentId,
                    midtermGrade: grades[s.studentId].midterm || null,
                    finalGrade: grades[s.studentId].final || null
                }));

            if (gradeEntries.length === 0) {
                toast.warning('Kaydedilecek not yok');
                return;
            }

            await enterGradesBatch(gradeEntries);
            toast.success('Notlar başarıyla kaydedildi');
        } catch (error) {
            toast.error(error.message || 'Kaydetme başarısız');
        } finally {
            setSaving(false);
        }
    }

    function handleExport() {
        // Create CSV
        const headers = ['Öğrenci No', 'Ad Soyad', 'Vize', 'Final', 'Harf Notu'];
        const rows = students.map(s => [
            s.studentNumber,
            s.studentName,
            grades[s.studentId]?.midterm || '',
            grades[s.studentId]?.final || '',
            grades[s.studentId]?.letter || ''
        ]);

        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `notlar_${params.sectionId}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        toast.success('Excel dosyası indirildi');
>>>>>>> Stashed changes
    }

    return (
        <div className="space-y-6">
<<<<<<< Updated upstream
=======
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="size-4" />
                <span>Geri</span>
            </button>

>>>>>>> Stashed changes
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
<<<<<<< Updated upstream
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold">Not Girişi</h1>
                    <p className="text-muted-foreground mt-2">
                        Öğrenci notlarını girin ve güncelleyin
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleExport}
                        disabled={exporting || students.length === 0}
                        className="gap-2"
                    >
                        <Download className="size-4" />
                        {exporting ? 'Dışa Aktarılıyor...' : 'Dışa Aktar'}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleSendNotifications}
                        disabled={sendingNotifications || selectedStudents.size === 0}
                        className="gap-2"
                    >
                        <Send className="size-4" />
                        {sendingNotifications ? 'Gönderiliyor...' : `Bildirim Gönder (${selectedStudents.size})`}
                    </Button>
                </div>
            </motion.div>

            {/* Students Table */}
=======
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold">Not Defteri</h1>
                    <p className="text-muted-foreground mt-1">
                        {loading ? 'Yükleniyor...' : `${students.length} öğrenci`}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                        <Download className="size-4" />
                        <span>Dışa Aktar</span>
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                        <Save className="size-4" />
                        <span>{saving ? 'Kaydediliyor...' : 'Kaydet'}</span>
                    </button>
                </div>
            </motion.div>

            {/* Gradebook Table */}
>>>>>>> Stashed changes
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl bg-white dark:bg-slate-800/50 border border-border overflow-hidden"
            >
<<<<<<< Updated upstream
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                                    <button
                                        onClick={handleSelectAll}
                                        className="flex items-center gap-2 hover:text-foreground transition-colors"
                                    >
                                        <CheckSquare className={`size-4 ${selectedStudents.size === students.length && students.length > 0 ? 'text-primary' : ''}`} />
                                        Öğrenci
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase">
                                    Vize
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase">
                                    Final
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase">
                                    Ödev
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase">
                                    Harf Notu
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase">
                                    İşlem
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {students.map((enrollment) => {
                                const student = enrollment.student || enrollment.user;
                                const gradeData = grades[enrollment.id] || {
                                    midtermGrade: '',
                                    finalGrade: '',
                                    homeworkGrade: '',
                                };
                                const isSaving = saving[enrollment.id];

                                return (
                                    <tr
                                        key={enrollment.id}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => handleToggleStudent(enrollment.id)}
                                                    className="shrink-0"
                                                >
                                                    <CheckSquare className={`size-4 ${selectedStudents.has(enrollment.id) ? 'text-primary' : 'text-muted-foreground'}`} />
                                                </button>
                                                <div className="size-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                                                    {student?.fullName?.charAt(0)?.toUpperCase() || 'S'}
                                                </div>
                                                <div>
                                                    <div className="font-medium">
                                                        {student?.fullName || 'Öğrenci'}
                                                    </div>
                                                    {student?.studentNumber && (
                                                        <div className="text-sm text-muted-foreground">
                                                            {student.studentNumber}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={gradeData.midtermGrade}
                                                onChange={(e) =>
                                                    handleGradeChange(
                                                        enrollment.id,
                                                        'midtermGrade',
                                                        e.target.value
                                                    )
                                                }
                                                className="w-20 mx-auto text-center"
                                                placeholder="0"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={gradeData.finalGrade}
                                                onChange={(e) =>
                                                    handleGradeChange(
                                                        enrollment.id,
                                                        'finalGrade',
                                                        e.target.value
                                                    )
                                                }
                                                className="w-20 mx-auto text-center"
                                                placeholder="0"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={gradeData.homeworkGrade}
                                                onChange={(e) =>
                                                    handleGradeChange(
                                                        enrollment.id,
                                                        'homeworkGrade',
                                                        e.target.value
                                                    )
                                                }
                                                className="w-20 mx-auto text-center"
                                                placeholder="0"
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-bold text-lg">
                                                {(() => {
                                                    const calculated = calculateLetterGrade(
                                                        gradeData.midtermGrade,
                                                        gradeData.finalGrade,
                                                        gradeData.homeworkGrade
                                                    );
                                                    // Show calculated grade if any grade is entered, otherwise show saved grade
                                                    if (gradeData.midtermGrade || gradeData.finalGrade || gradeData.homeworkGrade) {
                                                        return calculated;
                                                    }
                                                    return enrollment.letterGrade || '-';
                                                })()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Button
                                                onClick={() => handleSaveGrade(enrollment.id)}
                                                disabled={isSaving}
                                                size="sm"
                                                className="gap-2"
                                            >
                                                <Save className="size-4" />
                                                {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {students.length === 0 && (
                <div className="text-center py-12">
                    <Users className="size-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Bu section'da öğrenci bulunmuyor</p>
                </div>
            )}
        </div>
    );
}

=======
                {loading ? (
                    <div className="p-6">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-14 bg-muted animate-pulse rounded mb-3" />
                        ))}
                    </div>
                ) : students.length === 0 ? (
                    <div className="p-12 text-center">
                        <Users className="size-12 mx-auto text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">Öğrenci bulunamadı</h3>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Öğrenci</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider w-32">Vize (40%)</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider w-32">Final (60%)</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider w-24">Harf</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {students.map((student) => (
                                    <tr key={student.studentId} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium">{student.studentName}</p>
                                                <p className="text-sm text-muted-foreground">{student.studentNumber}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={grades[student.studentId]?.midterm ?? ''}
                                                onChange={(e) => handleGradeChange(student.studentId, 'midterm', e.target.value)}
                                                className="w-20 px-3 py-2 text-center rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                placeholder="-"
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={grades[student.studentId]?.final ?? ''}
                                                onChange={(e) => handleGradeChange(student.studentId, 'final', e.target.value)}
                                                className="w-20 px-3 py-2 text-center rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                placeholder="-"
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${grades[student.studentId]?.letter
                                                    ? 'bg-primary/10 text-primary'
                                                    : 'bg-muted text-muted-foreground'
                                                }`}>
                                                {grades[student.studentId]?.letter || '-'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
>>>>>>> Stashed changes
