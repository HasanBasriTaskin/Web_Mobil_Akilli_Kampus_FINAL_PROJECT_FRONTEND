'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
<<<<<<< Updated upstream
    GraduationCap,
    Download,
    TrendingUp,
    BookOpen,
    Award,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { getMyGrades, getTranscriptPDF } from '@/services/academic.service';
import { mockGrades } from '@/mocks/academic.mock';

/**
 * Grades Page
 * Notlarım - sadece istenen özellikler, güzel tasarım
=======
    GraduationCap, TrendingUp, Download, BookOpen,
    Award, BarChart3
} from 'lucide-react';
import { getMyGrades, getTranscript, downloadTranscriptPdf, letterToGradePoint } from '@/services/grade.service';
import { toast } from 'sonner';

/**
 * Grade Badge Component
 */
function GradeBadge({ letter }) {
    const getColor = () => {
        if (['AA', 'BA'].includes(letter)) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
        if (['BB', 'CB', 'CC'].includes(letter)) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
        if (['DC', 'DD'].includes(letter)) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    };

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getColor()}`}>
            {letter || '-'}
        </span>
    );
}

/**
 * Stats Card Component
 */
function StatsCard({ icon: Icon, title, value, subtitle, color }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border"
        >
            <div className={`p-3 rounded-lg w-fit ${color}`}>
                <Icon className="size-6 text-white" />
            </div>
            <div className="mt-4">
                <h3 className="text-3xl font-bold">{value}</h3>
                <p className="text-sm text-muted-foreground">{title}</p>
                {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
            </div>
        </motion.div>
    );
}

/**
 * Grades Page - Student
>>>>>>> Stashed changes
 */
export default function GradesPage() {
    const [grades, setGrades] = useState([]);
    const [transcript, setTranscript] = useState(null);
    const [loading, setLoading] = useState(true);
<<<<<<< Updated upstream
    const [downloadingPDF, setDownloadingPDF] = useState(false);

    useEffect(() => {
        loadGrades();
        loadTranscript();
    }, []);

    async function loadGrades() {
        try {
            setLoading(true);
            const response = await getMyGrades();
            
            if (response.success) {
                setGrades(response.data?.items || response.data || []);
            } else {
                // Mock data fallback
                setGrades(mockGrades);
            }
        } catch (error) {
            // Mock data fallback
            console.error('Notlar yüklenemedi, mock data kullanılıyor:', error);
            setGrades(mockGrades);
=======
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            const [gradesRes, transcriptRes] = await Promise.all([
                getMyGrades(),
                getTranscript()
            ]);
            setGrades(gradesRes.data || []);
            setTranscript(transcriptRes.data || null);
        } catch (error) {
            toast.error('Veriler yüklenemedi');
            console.error(error);
>>>>>>> Stashed changes
        } finally {
            setLoading(false);
        }
    }

<<<<<<< Updated upstream
    async function loadTranscript() {
        try {
            const response = await getTranscript();
            if (response.success) {
                setTranscript(response.data);
            } else {
                // Mock transcript data
                setTranscript({ cgpa: 3.0, gpa: 3.0 });
            }
        } catch (error) {
            console.error('Transkript yüklenemedi, mock data kullanılıyor:', error);
            setTranscript({ cgpa: 3.0, gpa: 3.0 });
        }
    }

    async function handleDownloadPDF() {
        try {
            setDownloadingPDF(true);
            const blob = await getTranscriptPDF();
            
            // PDF'i indir
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'transcript.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            toast.success('Transkript indirildi');
        } catch (error) {
            toast.error('PDF indirilemedi', {
                description: error.message || 'Bir hata oluştu',
            });
        } finally {
            setDownloadingPDF(false);
        }
    }

    function calculateGPA(grades) {
        if (!grades || grades.length === 0) return { gpa: 0, cgpa: 0 };

        const gradePoints = {
            'A+': 4.0, 'A': 4.0, 'A-': 3.7,
            'B+': 3.3, 'B': 3.0, 'B-': 2.7,
            'C+': 2.3, 'C': 2.0, 'C-': 1.7,
            'D+': 1.3, 'D': 1.0, 'F': 0.0,
        };

        let totalPoints = 0;
        let totalCredits = 0;

        grades.forEach((grade) => {
            if (grade.letterGrade && grade.course?.credits) {
                const points = gradePoints[grade.letterGrade] || 0;
                const credits = grade.course.credits;
                totalPoints += points * credits;
                totalCredits += credits;
            }
        });

        const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

        return {
            gpa: parseFloat(gpa.toFixed(2)),
            cgpa: transcript?.cgpa || parseFloat(gpa.toFixed(2)),
        };
    }

    function getGradeColor(letterGrade) {
        if (!letterGrade) return 'bg-gray-500';
        if (letterGrade.startsWith('A')) return 'bg-green-500';
        if (letterGrade.startsWith('B')) return 'bg-blue-500';
        if (letterGrade.startsWith('C')) return 'bg-yellow-500';
        if (letterGrade.startsWith('D')) return 'bg-orange-500';
        return 'bg-red-500';
    }

    // Grade distribution for chart
    function getGradeDistribution() {
        const distribution = {
            'A+': 0, 'A': 0, 'A-': 0,
            'B+': 0, 'B': 0, 'B-': 0,
            'C+': 0, 'C': 0, 'C-': 0,
            'D+': 0, 'D': 0, 'F': 0,
        };
        
        grades.forEach(grade => {
            if (grade.letterGrade && distribution.hasOwnProperty(grade.letterGrade)) {
                distribution[grade.letterGrade]++;
            }
        });
        
        return distribution;
    }

    const { gpa, cgpa } = calculateGPA(grades);
    const gradeDistribution = getGradeDistribution();
    const maxCount = Math.max(...Object.values(gradeDistribution), 1);
=======
    async function handleDownloadPdf() {
        setDownloading(true);
        try {
            await downloadTranscriptPdf();
            toast.success('Transkript indirildi');
        } catch (error) {
            toast.error('İndirme başarısız');
        } finally {
            setDownloading(false);
        }
    }

    // Calculate local GPA if not from API
    const calculateGPA = () => {
        if (transcript?.gpa) return transcript.gpa;
        const validGrades = grades.filter(g => g.letterGrade && g.letterGrade !== 'FF');
        if (validGrades.length === 0) return 0;
        const totalPoints = validGrades.reduce((sum, g) => sum + letterToGradePoint(g.letterGrade) * g.credits, 0);
        const totalCredits = validGrades.reduce((sum, g) => sum + g.credits, 0);
        return (totalPoints / totalCredits).toFixed(2);
    };
>>>>>>> Stashed changes

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
<<<<<<< Updated upstream
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold">Notlarım</h1>
                    <p className="text-muted-foreground mt-2">
                        Akademik performansınız ve notlarınız
                    </p>
                </div>
                <Button
                    onClick={handleDownloadPDF}
                    disabled={downloadingPDF}
                    className="gap-2"
                >
                    <Download className="size-4" />
                    {downloadingPDF ? 'İndiriliyor...' : 'Transkript İndir'}
                </Button>
            </motion.div>

            {/* GPA Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Semester GPA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative overflow-hidden p-8 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 text-white shadow-xl"
                >
                    <div className="absolute top-0 right-0 opacity-10">
                        <GraduationCap className="size-40" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm opacity-90 mb-2 font-medium">DÖNEM NOT ORTALAMASI</p>
                                <h2 className="text-5xl font-bold mb-2">{gpa.toFixed(2)}</h2>
                                <div className="flex items-center gap-1 text-green-200 text-sm">
                                    <TrendingUp className="size-4" />
                                    <span>+0.2</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm opacity-90">Bu dönem mükemmel performans gösterdiniz.</p>
                    </div>
                </motion.div>

                {/* CGPA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative overflow-hidden p-8 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 text-white shadow-xl"
                >
                    <div className="absolute top-0 right-0 opacity-10">
                        <Award className="size-40" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm opacity-90 mb-2 font-medium">GENEL NOT ORTALAMASI (CGPA)</p>
                                <h2 className="text-5xl font-bold mb-2">{cgpa.toFixed(2)}</h2>
                                <div className="flex items-center gap-1 text-green-200 text-sm">
                                    <TrendingUp className="size-4" />
                                    <span>+0.05</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm opacity-90">Sınıfınızın en iyi %15'inde yer alıyorsunuz.</p>
                    </div>
                </motion.div>
            </div>

            {/* Grade Statistics Chart */}
            {grades.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Grade Distribution */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border shadow-sm"
                    >
                        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <BookOpen className="size-5 text-primary" />
                            Not Dağılımı
                        </h2>
                        <div className="space-y-4">
                            {Object.entries(gradeDistribution).map(([grade, count]) => {
                                if (count === 0) return null;
                                const percentage = (count / maxCount) * 100;
                                
                                return (
                                    <div key={grade} className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-semibold">{grade}</span>
                                            <span className="text-muted-foreground">{count} ders</span>
                                        </div>
                                        <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${getGradeColor(grade)} rounded-full transition-all duration-700 shadow-sm`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {Object.values(gradeDistribution).every(v => v === 0) && (
                            <p className="text-center text-muted-foreground py-8">
                                Henüz not dağılımı bulunmuyor
                            </p>
                        )}
                    </motion.div>

                    {/* GPA Trend Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border shadow-sm"
                    >
                        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <TrendingUp className="size-5 text-primary" />
                            GPA Trendi
                        </h2>
                        <div className="space-y-4">
                            {/* Mock: Dönem bazlı GPA verisi (gerçekte backend'den gelecek) */}
                            {[
                                { semester: '2023 Güz', gpa: 2.8 },
                                { semester: '2024 Bahar', gpa: 2.9 },
                                { semester: '2024 Güz', gpa: 3.0 },
                            ].map((semesterData, index) => {
                                const maxGPA = 4.0;
                                const percentage = (semesterData.gpa / maxGPA) * 100;
                                
                                return (
                                    <div key={index} className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-semibold">{semesterData.semester}</span>
                                            <span className="text-muted-foreground font-bold">
                                                {semesterData.gpa.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-700 shadow-sm"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Genel Trend</span>
                                <div className="flex items-center gap-1 text-green-600">
                                    <TrendingUp className="size-4" />
                                    <span className="text-sm font-bold">Yükselişte</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Course Details Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-xl bg-white dark:bg-slate-800/50 border border-border overflow-hidden shadow-sm"
            >
                <div className="p-6 border-b border-border bg-slate-50 dark:bg-slate-800/50">
                    <h2 className="text-lg font-semibold">Ders Notları</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">
                                    Ders
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-muted-foreground uppercase">
                                    Vize
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-muted-foreground uppercase">
                                    Final
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-muted-foreground uppercase">
                                    Harf Notu
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-muted-foreground">
                                        Yükleniyor...
                                    </td>
                                </tr>
                            ) : grades.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center">
                                        <GraduationCap className="size-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                                        <p className="text-muted-foreground">Henüz notunuz bulunmuyor</p>
                                    </td>
                                </tr>
                            ) : (
                                grades.map((grade, index) => {
                                    const course = grade.course || grade.section?.course;

                                    return (
                                        <tr
                                            key={grade.id || index}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-primary/10">
                                                        <BookOpen className="size-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <div className="font-mono text-sm text-primary font-semibold mb-1">
                                                            {course?.code}
                                                        </div>
                                                        <div className="text-sm font-medium">
                                                            {course?.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-lg font-bold">
                                                    {grade.midtermGrade ?? '-'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-lg font-bold">
                                                    {grade.finalGrade ?? '-'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {grade.letterGrade ? (
                                                    <span className={`inline-flex items-center justify-center size-12 rounded-full text-white font-bold text-lg shadow-md ${getGradeColor(grade.letterGrade)}`}>
                                                        {grade.letterGrade}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
=======
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold">Notlarım</h1>
                    <p className="text-muted-foreground mt-1">
                        Akademik performansınızı görüntüleyin
                    </p>
                </div>
                <button
                    onClick={handleDownloadPdf}
                    disabled={downloading}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                    <Download className="size-4" />
                    <span>{downloading ? 'İndiriliyor...' : 'Transkript İndir'}</span>
                </button>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    icon={TrendingUp}
                    title="Dönem GPA"
                    value={calculateGPA()}
                    subtitle="4.00 üzerinden"
                    color="bg-gradient-to-br from-violet-500 to-indigo-600"
                />
                <StatsCard
                    icon={Award}
                    title="CGPA"
                    value={transcript?.cgpa?.toFixed(2) || calculateGPA()}
                    subtitle="Kümülatif ortalama"
                    color="bg-gradient-to-br from-emerald-500 to-teal-600"
                />
                <StatsCard
                    icon={BookOpen}
                    title="Toplam Kredi"
                    value={transcript?.totalCredits || grades.reduce((s, g) => s + g.credits, 0)}
                    subtitle="Tamamlanan"
                    color="bg-gradient-to-br from-blue-500 to-cyan-600"
                />
                <StatsCard
                    icon={BarChart3}
                    title="Ders Sayısı"
                    value={grades.length}
                    subtitle="Bu dönem"
                    color="bg-gradient-to-br from-orange-500 to-amber-600"
                />
            </div>

            {/* Grades Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl bg-white dark:bg-slate-800/50 border border-border overflow-hidden"
            >
                <div className="p-6 border-b border-border">
                    <h2 className="text-lg font-semibold">Ders Notları</h2>
                </div>

                {loading ? (
                    <div className="p-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-12 bg-muted animate-pulse rounded mb-3" />
                        ))}
                    </div>
                ) : grades.length === 0 ? (
                    <div className="p-12 text-center">
                        <GraduationCap className="size-12 mx-auto text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">Henüz not bulunmuyor</h3>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Ders</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Kredi</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Vize</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Final</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Harf</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {grades.map((grade) => (
                                    <tr key={grade.enrollmentId} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium">{grade.courseName}</p>
                                                <p className="text-sm text-muted-foreground">{grade.courseCode}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">{grade.credits}</td>
                                        <td className="px-6 py-4 text-center font-medium">{grade.midtermGrade ?? '-'}</td>
                                        <td className="px-6 py-4 text-center font-medium">{grade.finalGrade ?? '-'}</td>
                                        <td className="px-6 py-4 text-center">
                                            <GradeBadge letter={grade.letterGrade} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
>>>>>>> Stashed changes
            </motion.div>
        </div>
    );
}
