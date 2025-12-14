'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Clock,
    GraduationCap,
    Users,
    Calendar,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    MapPin,
    ArrowRight,
    FileText,
    ClipboardCheck,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { getCourseById, getSections, enrollInCourse } from '@/services/academic.service';
import { useAuthStore } from '@/stores/auth.store';
import { mockCourses, mockSections } from '@/mocks/academic.mock';

/**
 * Course Detail Page
 * Ders detayları - modern ve güzel tasarım
 */
export default function CourseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuthStore();
    const courseId = params.id;

    const [course, setCourse] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState({});
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [selectedSection, setSelectedSection] = useState(null);

    useEffect(() => {
        loadCourseData();
    }, [courseId]);

    async function loadCourseData() {
        try {
            setLoading(true);
            
            // Ders detaylarını yükle
            const courseResponse = await getCourseById(courseId);
            if (courseResponse.success) {
                setCourse(courseResponse.data);
            } else {
                // Mock data fallback
                const mockCourse = mockCourses.find(c => c.id === parseInt(courseId));
                if (mockCourse) setCourse(mockCourse);
            }

            // Section'ları yükle
            const sectionsResponse = await getSections({ courseId });
            if (sectionsResponse.success) {
                setSections(sectionsResponse.data?.items || sectionsResponse.data || []);
            } else {
                // Mock data fallback
                const mockSectionsForCourse = mockSections.filter(s => s.courseId === parseInt(courseId));
                setSections(mockSectionsForCourse);
            }
        } catch (error) {
            // Mock data fallback
            console.error('Ders bilgileri yüklenemedi, mock data kullanılıyor:', error);
            const mockCourse = mockCourses.find(c => c.id === parseInt(courseId));
            if (mockCourse) {
                setCourse(mockCourse);
                const mockSectionsForCourse = mockSections.filter(s => s.courseId === parseInt(courseId));
                setSections(mockSectionsForCourse);
            } else {
                toast.error('Ders bulunamadı', {
                    description: error.message || 'Bir hata oluştu',
                });
                router.push('/courses');
            }
        } finally {
            setLoading(false);
        }
    }

    function handleEnrollClick(section) {
        setSelectedSection(section);
        setShowEnrollModal(true);
    }

    async function handleEnrollConfirm() {
        if (!selectedSection) return;

        try {
            setEnrolling({ ...enrolling, [selectedSection.id]: true });
            setShowEnrollModal(false);
            
            const response = await enrollInCourse({ sectionId: selectedSection.id });
            
            if (response.success) {
                toast.success('Derse kayıt başarılı!', {
                    description: 'Ders listenize eklendi',
                });
                router.push('/my-courses');
            }
        } catch (error) {
            toast.error('Kayıt başarısız', {
                description: error.message || 'Bir hata oluştu',
            });
        } finally {
            setEnrolling({ ...enrolling, [selectedSection.id]: false });
            setSelectedSection(null);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Yükleniyor...</div>
            </div>
        );
    }

    if (!course) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Link href="/courses">
                <Button variant="ghost" className="gap-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                    <ArrowLeft className="size-4" />
                    Geri Dön
                </Button>
            </Link>

            {/* Course Header - Beautiful Design */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-600 to-purple-600 p-8 text-white shadow-xl"
            >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMCA0djJoLTJ2LTJoMnptLTQtNHYyaC0ydi0yaDJ6bTAgNHYyaC0ydi0yaDJ6bTQtNHYyaC0ydi0yaDJ6bTAgNHYyaC0ydi0yaDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
                <div className="relative z-10">
                    <div className="flex items-start gap-6">
                        <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
                            <BookOpen className="size-8" />
                        </div>
                        <div className="flex-1">
                            <div className="mb-3">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm font-mono text-sm font-semibold border border-white/30">
                                    {course.code}
                                </span>
                            </div>
                            <h1 className="text-4xl font-bold mb-3 leading-tight">{course.name}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-white/90">
                                <div className="flex items-center gap-2">
                                    <Clock className="size-5" />
                                    <span className="font-medium">{course.credits} Kredi</span>
                                </div>
                                {course.ects && (
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="size-5" />
                                        <span className="font-medium">{course.ects} ECTS</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Course Description */}
            {course.description && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border shadow-sm"
                >
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <BookOpen className="size-5 text-primary" />
                        Ders Açıklaması
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{course.description}</p>
                </motion.div>
            )}

            {/* Prerequisites */}
            {course.prerequisites && course.prerequisites.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border shadow-sm"
                >
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <AlertCircle className="size-5 text-primary" />
                        Önkoşullar
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {course.prerequisites.map((prereq) => (
                            <Link
                                key={prereq.id}
                                href={`/courses/${prereq.id}`}
                                className="group p-4 rounded-lg border border-border hover:border-primary hover:shadow-md transition-all bg-slate-50 dark:bg-slate-800/30"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                        <CheckCircle2 className="size-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-mono text-sm font-semibold text-primary group-hover:underline">
                                            {prereq.code}
                                        </div>
                                        <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                            {prereq.name}
                                        </div>
                                    </div>
                                    <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Available Sections */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border shadow-sm"
            >
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Calendar className="size-5 text-primary" />
                    Mevcut Gruplar
                </h2>

                {sections.length === 0 ? (
                    <div className="text-center py-12">
                        <Calendar className="size-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                        <p className="text-muted-foreground">Bu ders için grup bulunmuyor</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {sections.map((section, index) => {
                            const isEnrolling = enrolling[section.id];
                            const isFull = section.enrolledCount >= section.capacity;
                            const availableSpots = section.capacity - section.enrolledCount;

                            return (
                                <motion.div
                                    key={section.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                    className="group relative p-6 rounded-xl border-2 border-border hover:border-primary/50 hover:shadow-lg transition-all bg-gradient-to-br from-white to-slate-50 dark:from-slate-800/50 dark:to-slate-800/30"
                                >
                                    {/* Section Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-3 py-1 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white font-semibold text-sm">
                                                    Grup {section.sectionNumber}
                                                </span>
                                                {isFull ? (
                                                    <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                                                        Dolu
                                                    </span>
                                                ) : availableSpots <= 5 ? (
                                                    <span className="px-2 py-1 rounded text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">
                                                        Hızla Doluyor
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                                        Açık
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section Details */}
                                    <div className="space-y-3 mb-4">
                                        {/* Instructor */}
                                        {section.instructor && (
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-primary/10">
                                                    <Users className="size-4 text-primary" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-xs text-muted-foreground">Öğretim Üyesi</div>
                                                    <div className="font-medium text-sm">{section.instructor.fullName}</div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Schedule */}
                                        {section.schedule && (
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-primary/10">
                                                    <Calendar className="size-4 text-primary" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-xs text-muted-foreground">Program</div>
                                                    <div className="font-medium text-sm">
                                                        {section.schedule.day} {section.schedule.time}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Location */}
                                        {section.schedule?.room && (
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-primary/10">
                                                    <MapPin className="size-4 text-primary" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-xs text-muted-foreground">Konum</div>
                                                    <div className="font-medium text-sm">{section.schedule.room}</div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Capacity */}
                                        <div className="flex items-center gap-3 pt-2 border-t border-border">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                <Users className="size-4 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-xs text-muted-foreground">Kapasite</div>
                                                <div className="font-medium text-sm">
                                                    {section.enrolledCount} / {section.capacity} öğrenci
                                                </div>
                                                <div className="mt-1 w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full transition-all"
                                                        style={{ width: `${(section.enrolledCount / section.capacity) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        {user?.role === 'Student' && (
                                            <Button
                                                onClick={() => handleEnrollClick(section)}
                                                disabled={isEnrolling || isFull}
                                                className="flex-1 group-hover:scale-105 transition-transform"
                                                variant={isFull ? 'outline' : 'default'}
                                                size="lg"
                                            >
                                                {isEnrolling ? (
                                                    'Kaydediliyor...'
                                                ) : isFull ? (
                                                    'Dolu'
                                                ) : (
                                                    <>
                                                        <span>Kayıt Ol</span>
                                                        <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                        
                                        {user?.role === 'Faculty' && (
                                            <>
                                                <Link href={`/gradebook/${section.id}`} className="flex-1">
                                                    <Button
                                                        variant="outline"
                                                        className="w-full gap-2"
                                                        size="lg"
                                                    >
                                                        <FileText className="size-4" />
                                                        Not Girişi
                                                    </Button>
                                                </Link>
                                                <Link href={`/attendance/report/${section.id}`} className="flex-1">
                                                    <Button
                                                        variant="outline"
                                                        className="w-full gap-2"
                                                        size="lg"
                                                    >
                                                        <ClipboardCheck className="size-4" />
                                                        Yoklama Raporu
                                                    </Button>
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </motion.div>

            {/* Enrollment Confirmation Modal */}
            {showEnrollModal && selectedSection && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl border border-border shadow-2xl p-8 max-w-md w-full"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                                <CheckCircle2 className="size-6" />
                            </div>
                            <h3 className="text-xl font-bold">Derse Kayıt Onayı</h3>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                <p className="text-sm text-muted-foreground mb-1">Ders</p>
                                <p className="font-semibold text-lg">
                                    {course.code} - {course.name}
                                </p>
                            </div>

                            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                <p className="text-sm text-muted-foreground mb-1">Grup</p>
                                <p className="font-semibold">
                                    Grup {selectedSection.sectionNumber}
                                </p>
                            </div>

                            {selectedSection.instructor && (
                                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                    <p className="text-sm text-muted-foreground mb-1">Öğretim Üyesi</p>
                                    <p className="font-semibold">
                                        {selectedSection.instructor.fullName}
                                    </p>
                                </div>
                            )}

                            {selectedSection.schedule && (
                                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                    <p className="text-sm text-muted-foreground mb-1">Program</p>
                                    <p className="font-semibold">
                                        {selectedSection.schedule.day} {selectedSection.schedule.time}
                                    </p>
                                    {selectedSection.schedule.room && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {selectedSection.schedule.room}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                <p className="text-sm text-muted-foreground mb-1">Dönem</p>
                                <p className="font-semibold">
                                    {selectedSection.semester} {selectedSection.year}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowEnrollModal(false);
                                    setSelectedSection(null);
                                }}
                                className="flex-1"
                                size="lg"
                            >
                                İptal
                            </Button>
                            <Button
                                onClick={handleEnrollConfirm}
                                disabled={enrolling[selectedSection.id]}
                                className="flex-1 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700"
                                size="lg"
                            >
                                {enrolling[selectedSection.id] ? 'Kaydediliyor...' : 'Onayla ve Kayıt Ol'}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
