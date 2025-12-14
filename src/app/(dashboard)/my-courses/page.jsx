'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Calendar,
    Users,
    Clock,
    MapPin,
    MoreVertical,
    Search,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Eye,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getMyCourses, dropCourse } from '@/services/academic.service';
import { mockEnrollments } from '@/mocks/academic.mock';

/**
 * My Courses Page
 * Kayıtlı derslerim - görsel tasarıma benzer modern tasarım
 * 
 * Backend EnrollmentDto Response:
 * {
 *   id, studentId, studentNumber, studentName, sectionId,
 *   courseCode, courseName, sectionNumber, status,
 *   enrollmentDate, midtermGrade, finalGrade, letterGrade, gradePoint
 * }
 */
export default function MyCoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dropping, setDropping] = useState({});
    const [showDropModal, setShowDropModal] = useState(false);
    const [selectedEnrollment, setSelectedEnrollment] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [semesterFilter, setSemesterFilter] = useState('');

    useEffect(() => {
        loadMyCourses();
    }, []);

    async function loadMyCourses() {
        try {
            setLoading(true);
            const response = await getMyCourses();

            if (response.success && response.data) {
                // Backend EnrollmentDto array veya nested data olabilir
                let enrollmentsData;

                if (Array.isArray(response.data)) {
                    enrollmentsData = response.data;
                } else if (response.data.data && Array.isArray(response.data.data)) {
                    enrollmentsData = response.data.data;
                } else {
                    enrollmentsData = [];
                }

                // Backend formatını normalize et
                const normalizedCourses = enrollmentsData.map(e => ({
                    id: e.id,
                    studentId: e.studentId,
                    studentNumber: e.studentNumber,
                    studentName: e.studentName,
                    sectionId: e.sectionId,
                    // Course info - backend'den düz gelir
                    courseCode: e.courseCode,
                    courseName: e.courseName,
                    sectionNumber: e.sectionNumber,
                    status: e.status,
                    enrollmentDate: e.enrollmentDate,
                    // Grade info
                    midtermGrade: e.midtermGrade,
                    finalGrade: e.finalGrade,
                    letterGrade: e.letterGrade,
                    gradePoint: e.gradePoint,
                    // Mock data compatibility
                    section: e.section,
                    course: e.course,
                    attendancePercentage: e.attendancePercentage || 85, // Default value
                }));

                setCourses(normalizedCourses);
            } else {
                // Mock data fallback
                setCourses(mockEnrollments);
            }
        } catch (error) {
            // Mock data fallback
            console.error('Dersler yüklenemedi, mock data kullanılıyor:', error);
            setCourses(mockEnrollments);
        } finally {
            setLoading(false);
        }
    }

    function handleDropClick(enrollment) {
        setSelectedEnrollment(enrollment);
        setShowDropModal(true);
    }

    async function handleDropConfirm() {
        if (!selectedEnrollment) return;

        const enrollmentId = selectedEnrollment.id;
        const courseName = selectedEnrollment.courseName ||
            selectedEnrollment.section?.course?.name ||
            selectedEnrollment.course?.name;

        try {
            setDropping({ ...dropping, [enrollmentId]: true });
            setShowDropModal(false);

            const response = await dropCourse(enrollmentId);

            if (response.success) {
                toast.success('Ders bırakıldı', {
                    description: `${courseName} dersinden kaydınız silindi`,
                });
                loadMyCourses();
            }
        } catch (error) {
            toast.error('Ders bırakılamadı', {
                description: error.message || 'Bir hata oluştu',
            });
        } finally {
            setDropping({ ...dropping, [enrollmentId]: false });
            setSelectedEnrollment(null);
        }
    }

    function getAttendanceStatus(attendancePercentage) {
        if (attendancePercentage >= 80) {
            return {
                color: 'text-green-600',
                bgColor: 'bg-green-500',
                icon: CheckCircle2,
                label: 'İyi',
                status: 'good'
            };
        } else if (attendancePercentage >= 70) {
            return {
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-500',
                icon: AlertTriangle,
                label: 'Uyarı',
                status: 'warning'
            };
        } else {
            return {
                color: 'text-red-600',
                bgColor: 'bg-red-500',
                icon: XCircle,
                label: 'Kritik',
                status: 'critical'
            };
        }
    }

    function getCourseCodeColor(courseCode) {
        const code = courseCode?.toUpperCase() || '';
        if (code.includes('CS') || code.includes('CENG')) return 'bg-green-500';
        if (code.includes('ENG') || code.includes('TUR')) return 'bg-yellow-500';
        if (code.includes('MAT') || code.includes('MATH')) return 'bg-red-500';
        if (code.includes('HIS') || code.includes('TAR')) return 'bg-green-500';
        if (code.includes('PHY') || code.includes('FIZ')) return 'bg-purple-500';
        if (code.includes('SE')) return 'bg-blue-500';
        if (code.includes('CE')) return 'bg-orange-500';
        return 'bg-indigo-500';
    }

    // Filter courses - backend veya mock data uyumlu
    const filteredCourses = courses.filter(enrollment => {
        // Backend formatı: courseCode, courseName doğrudan
        // Mock formatı: section.course.code, section.course.name
        const courseCode = enrollment.courseCode || enrollment.section?.course?.code || enrollment.course?.code;
        const courseName = enrollment.courseName || enrollment.section?.course?.name || enrollment.course?.name;
        const instructorName = enrollment.section?.instructor?.fullName || '';

        const matchesSearch = !searchTerm ||
            courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            courseCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            instructorName?.toLowerCase().includes(searchTerm.toLowerCase());

        const semester = enrollment.section?.semester;
        const matchesSemester = !semesterFilter || semester === semesterFilter;

        return matchesSearch && matchesSemester;
    });

    // Get unique semesters
    const semesters = [...new Set(courses.map(e => e.section?.semester).filter(Boolean))];


    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold">Kayıtlı Derslerim</h1>
                <p className="text-muted-foreground mt-2">
                    {semesterFilter || 'Tüm dönemler'} için kayıtlı olduğunuz dersler
                </p>
            </motion.div>

            {/* Search and Filter */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col sm:flex-row gap-4"
            >
                <div className="sm:w-48">
                    <select
                        value={semesterFilter}
                        onChange={(e) => setSemesterFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
                    >
                        <option value="">Tüm Dönemler</option>
                        {semesters.map((semester) => (
                            <option key={semester} value={semester}>
                                {semester}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Ders adı, kodu veya öğretim üyesi ile ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Link href="/courses">
                    <Button className="sm:w-auto gap-2">
                        <BookOpen className="size-4" />
                        Ders Kataloğu
                    </Button>
                </Link>
            </motion.div>

            {/* Courses Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="text-muted-foreground">Yükleniyor...</div>
                </div>
            ) : filteredCourses.length === 0 ? (
                <div className="text-center py-12">
                    <BookOpen className="size-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <p className="text-muted-foreground mb-4">Henüz kayıtlı dersiniz yok</p>
                    <Link href="/courses">
                        <Button>Ders Kataloğuna Git</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredCourses.map((enrollment, index) => {
                        // Backend formatı: courseCode, courseName doğrudan
                        // Mock formatı: section.course.code, section.course.name
                        const courseCode = enrollment.courseCode || enrollment.section?.course?.code || enrollment.course?.code;
                        const courseName = enrollment.courseName || enrollment.section?.course?.name || enrollment.course?.name;
                        const courseId = enrollment.sectionId || enrollment.section?.courseId || enrollment.course?.id;
                        const sectionNumber = enrollment.sectionNumber || enrollment.section?.sectionNumber;
                        const section = enrollment.section;
                        const attendancePercentage = enrollment.attendancePercentage || 85;
                        const attendanceStatus = getAttendanceStatus(attendancePercentage);
                        const StatusIcon = attendanceStatus.icon;
                        const codeColor = getCourseCodeColor(courseCode);

                        return (
                            <motion.div
                                key={enrollment.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative p-6 rounded-xl bg-white dark:bg-slate-800/50 border-2 border-border hover:border-primary/50 hover:shadow-lg transition-all"
                            >
                                {/* Options Menu */}
                                <button className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors opacity-0 group-hover:opacity-100">
                                    <MoreVertical className="size-5 text-muted-foreground" />
                                </button>

                                {/* Course Code Badge */}
                                <div className="mb-4">
                                    <span className={`inline-block px-3 py-1 rounded-full text-white text-sm font-semibold ${codeColor}`}>
                                        {courseCode}{sectionNumber ? `-${sectionNumber}` : ''}
                                    </span>
                                </div>

                                {/* Course Title */}
                                <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">
                                    {courseName}
                                </h3>

                                {/* Section Info */}
                                <div className="space-y-3 mb-4">
                                    {/* Instructor */}
                                    {section?.instructor && (
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                                                {section.instructor.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-xs text-muted-foreground">Öğretim Üyesi</div>
                                                <div className="font-medium text-sm">{section.instructor.fullName}</div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Schedule */}
                                    {section?.schedule && (
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                <Clock className="size-4 text-primary" />
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
                                    {section?.schedule?.room && (
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

                                    {/* Grades - Backend'den gelebilir */}
                                    {(enrollment.midtermGrade !== null || enrollment.finalGrade !== null || enrollment.letterGrade) && (
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                <BookOpen className="size-4 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-xs text-muted-foreground">Notlar</div>
                                                <div className="font-medium text-sm">
                                                    {enrollment.midtermGrade != null && `Vize: ${enrollment.midtermGrade}`}
                                                    {enrollment.midtermGrade != null && enrollment.finalGrade != null && ' | '}
                                                    {enrollment.finalGrade != null && `Final: ${enrollment.finalGrade}`}
                                                    {enrollment.letterGrade && ` (${enrollment.letterGrade})`}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>


                                {/* Attendance */}
                                <div className="mb-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <StatusIcon className={`size-5 ${attendanceStatus.color}`} />
                                            <span className="text-sm font-semibold">Yoklama</span>
                                        </div>
                                        <span className={`text-sm font-bold ${attendanceStatus.color}`}>
                                            %{attendancePercentage.toFixed(1)}
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${attendanceStatus.bgColor} rounded-full transition-all duration-500`}
                                            style={{ width: `${Math.min(attendancePercentage, 100)}%` }}
                                        />
                                    </div>
                                    {attendanceStatus.status === 'critical' && (
                                        <p className="text-xs text-red-600 mt-2 font-medium">
                                            Uyarı: %75 eşiğinin altında
                                        </p>
                                    )}
                                    {attendanceStatus.status === 'warning' && (
                                        <p className="text-xs text-yellow-600 mt-2 font-medium">
                                            Dikkat: Yoklama oranınız düşük
                                        </p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Link href={`/courses/${courseId}`} className="flex-1">
                                        <Button variant="outline" className="w-full gap-2">
                                            <Eye className="size-4" />
                                            Detayları Gör
                                        </Button>
                                    </Link>
                                    {enrollment.status === 'Active' ? (
                                        <Button
                                            variant="destructive"
                                            onClick={() => handleDropClick(enrollment)}
                                            disabled={dropping[enrollment.id]}
                                            className="flex-1"
                                        >
                                            {dropping[enrollment.id] ? 'Bırakılıyor...' : 'Dersi Bırak'}
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            disabled
                                            className="flex-1 text-muted-foreground"
                                        >
                                            {enrollment.status === 'Dropped' ? 'Bırakıldı' : enrollment.status || 'Kayıtlı'}
                                        </Button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Drop Confirmation Modal */}
            {showDropModal && selectedEnrollment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl border border-border shadow-2xl p-8 max-w-md w-full"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-xl bg-destructive/10">
                                <AlertTriangle className="size-6 text-destructive" />
                            </div>
                            <h3 className="text-xl font-bold">Dersi Bırakma Onayı</h3>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                <p className="text-sm text-muted-foreground mb-1">Ders</p>
                                <p className="font-semibold text-lg">
                                    {selectedEnrollment.section?.course?.code || selectedEnrollment.course?.code} - {selectedEnrollment.section?.course?.name || selectedEnrollment.course?.name}
                                </p>
                            </div>

                            {selectedEnrollment.section && (
                                <>
                                    <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                        <p className="text-sm text-muted-foreground mb-1">Grup</p>
                                        <p className="font-semibold">
                                            Grup {selectedEnrollment.section.sectionNumber}
                                        </p>
                                    </div>
                                    {selectedEnrollment.section.instructor && (
                                        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                            <p className="text-sm text-muted-foreground mb-1">Öğretim Üyesi</p>
                                            <p className="font-semibold">
                                                {selectedEnrollment.section.instructor.fullName}
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}

                            <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                    <strong>Uyarı:</strong> Bu işlem geri alınamaz. Dersi bıraktıktan sonra tekrar kayıt olmanız gerekebilir.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowDropModal(false);
                                    setSelectedEnrollment(null);
                                }}
                                className="flex-1"
                                size="lg"
                            >
                                İptal
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDropConfirm}
                                disabled={dropping[selectedEnrollment.id]}
                                className="flex-1"
                                size="lg"
                            >
                                {dropping[selectedEnrollment.id] ? 'Bırakılıyor...' : 'Onayla ve Bırak'}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
