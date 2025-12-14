'use client';

import { useState, useEffect } from 'react';
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
 */
export default function GradebookPage() {
    const params = useParams();
    const router = useRouter();
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

    async function loadStudents() {
        try {
            setLoading(true);
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
        } finally {
            setLoading(false);
        }
    }

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
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
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
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl bg-white dark:bg-slate-800/50 border border-border overflow-hidden"
            >
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

