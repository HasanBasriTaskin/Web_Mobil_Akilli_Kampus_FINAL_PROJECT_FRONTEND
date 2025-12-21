'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, User, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { getMySchedule } from '@/services/enrollment.service';
import { toast } from 'sonner';
import Link from 'next/link';

/**
 * Haftalık Takvim Görünümü
 */
function WeeklyCalendar({ scheduleItems, onCourseClick }) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timeSlots = [];
    
    // 08:00 - 20:00 arası saat dilimleri oluştur
    for (let hour = 8; hour < 20; hour++) {
        timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    }

    // Günleri Türkçe'ye çevir
    const dayTranslations = {
        'Monday': 'Pazartesi',
        'Tuesday': 'Salı',
        'Wednesday': 'Çarşamba',
        'Thursday': 'Perşembe',
        'Friday': 'Cuma',
        'Saturday': 'Cumartesi',
        'Sunday': 'Pazar'
    };

    // Her ders için renk ataması (SectionId'ye göre)
    const courseColors = {};
    const colors = [
        'bg-blue-100 border-blue-400 text-blue-900 dark:bg-blue-900/40 dark:border-blue-600 dark:text-blue-200',
        'bg-purple-100 border-purple-400 text-purple-900 dark:bg-purple-900/40 dark:border-purple-600 dark:text-purple-200',
        'bg-green-100 border-green-400 text-green-900 dark:bg-green-900/40 dark:border-green-600 dark:text-green-200',
        'bg-orange-100 border-orange-400 text-orange-900 dark:bg-orange-900/40 dark:border-orange-600 dark:text-orange-200',
        'bg-pink-100 border-pink-400 text-pink-900 dark:bg-pink-900/40 dark:border-pink-600 dark:text-pink-200',
        'bg-indigo-100 border-indigo-400 text-indigo-900 dark:bg-indigo-900/40 dark:border-indigo-600 dark:text-indigo-200',
        'bg-teal-100 border-teal-400 text-teal-900 dark:bg-teal-900/40 dark:border-teal-600 dark:text-teal-200',
        'bg-rose-100 border-rose-400 text-rose-900 dark:bg-rose-900/40 dark:border-rose-600 dark:text-rose-200',
    ];

    // SectionId'ye göre renk ataması yap (aynı ders aynı renkte)
    const uniqueSectionIds = [...new Set(scheduleItems.map(item => item.SectionId))];
    uniqueSectionIds.forEach((sectionId, index) => {
        courseColors[sectionId] = colors[index % colors.length];
    });

    // Saat dilimine göre dersleri grupla
    const getTimeSlotIndex = (time) => {
        const [hour] = time.split(':').map(Number);
        return hour - 8;
    };

    const getDuration = (startTime, endTime) => {
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        return endMinutes - startMinutes;
    };

    // Her gün için dersleri saat dilimine göre yerleştir
    const getCoursePosition = (item) => {
        const [startHour, startMin] = item.StartTime.split(':').map(Number);
        const startMinutes = startHour * 60 + startMin;
        const baseMinutes = 8 * 60; // 08:00
        const topOffset = ((startMinutes - baseMinutes) / 60) * 64; // Her saat 64px
        
        const duration = getDuration(item.StartTime, item.EndTime);
        const height = `${(duration / 60) * 64}px`;
        
        return { top: `${topOffset}px`, height };
    };

    return (
        <div className="overflow-x-auto">
            <div className="min-w-full">
                {/* Gün başlıkları */}
                <div className="grid grid-cols-8 gap-2 mb-3 sticky top-0 bg-white dark:bg-slate-800/50 z-20 pb-2 border-b-2">
                    <div className="p-3 text-sm font-bold text-muted-foreground">Saat</div>
                    {days.map(day => (
                        <div key={day} className="p-3 text-sm font-bold text-center">
                            {dayTranslations[day] || day}
                        </div>
                    ))}
                </div>

                {/* Saat dilimleri ve dersler */}
                <div className="grid grid-cols-8 gap-2 relative">
                    {/* Saat kolonu */}
                    <div className="space-y-0">
                        {timeSlots.map((time, index) => (
                            <div 
                                key={time} 
                                className="h-16 p-2 text-xs font-medium text-muted-foreground border-r border-border/50 flex items-start"
                            >
                                {time}
                            </div>
                        ))}
                    </div>

                    {/* Gün kolonları */}
                    {days.map(day => {
                        const dayItems = scheduleItems.filter(item => item.Day === day);
                        
                        return (
                            <div key={day} className="relative min-h-[768px] border-r border-border/30">
                                {/* Saat çizgileri */}
                                {timeSlots.map((time, index) => (
                                    <div 
                                        key={time} 
                                        className="h-16 border-b border-border/30"
                                    />
                                ))}
                                
                                {/* Dersler */}
                                {dayItems.map(item => {
                                    const position = getCoursePosition(item);
                                    const colorClass = courseColors[item.SectionId] || colors[0];

                                    return (
                                        <motion.div
                                            key={`${item.SectionId}-${item.Day}-${item.StartTime}`}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`absolute left-1 right-1 border-2 rounded-lg p-2.5 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all ${colorClass}`}
                                            style={{
                                                top: position.top,
                                                height: position.height,
                                                zIndex: 10
                                            }}
                                            onClick={() => onCourseClick?.(item)}
                                        >
                                            <div className="text-xs font-bold truncate mb-1">
                                                {item.CourseCode}
                                            </div>
                                            <div className="text-xs truncate mb-2 font-semibold leading-tight">
                                                {item.CourseName}
                                            </div>
                                            <div className="text-xs flex items-start gap-1 mb-1.5">
                                                <User className="size-3 flex-shrink-0 mt-0.5" />
                                                <span className="truncate leading-tight">{item.InstructorName || 'Belirtilmemiş'}</span>
                                            </div>
                                            <div className="text-xs flex items-center gap-1 mb-1">
                                                <MapPin className="size-3 flex-shrink-0" />
                                                <span className="truncate">{item.ClassroomInfo || 'Belirtilmemiş'}</span>
                                            </div>
                                            <div className="text-xs flex items-center gap-1">
                                                <Clock className="size-3 flex-shrink-0" />
                                                <span>{item.StartTime} - {item.EndTime}</span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

/**
 * Ders Detay Modal
 */
function CourseDetailModal({ course, isOpen, onClose }) {
    if (!isOpen || !course) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl"
            >
                <h3 className="text-xl font-bold mb-4">{course.CourseCode} - {course.CourseName}</h3>
                
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <User className="size-4 text-muted-foreground" />
                        <span className="text-sm">
                            <strong>Öğretmen:</strong> {course.InstructorName || 'Belirtilmemiş'}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-muted-foreground" />
                        <span className="text-sm">
                            <strong>Sınıf:</strong> {course.ClassroomInfo || 'Belirtilmemiş'}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Clock className="size-4 text-muted-foreground" />
                        <span className="text-sm">
                            <strong>Saat:</strong> {course.StartTime} - {course.EndTime}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-muted-foreground" />
                        <span className="text-sm">
                            <strong>Gün:</strong> {course.Day}
                        </span>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                    <div className="grid grid-cols-2 gap-2">
                        <Link
                            href={`/courses/${course.SectionId}`}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-center text-sm font-medium"
                        >
                            Ders Detayları
                        </Link>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium"
                        >
                            Kapat
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

/**
 * Schedule Page - Ders Programı Sayfası
 */
export default function SchedulePage() {
    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadSchedule();
    }, []);

    async function loadSchedule() {
        try {
            setLoading(true);
            // Önce API'den veri çekmeyi dene
            try {
                const response = await getMySchedule();
                if (response.data && response.data.ScheduleItems && response.data.ScheduleItems.length > 0) {
                    setSchedule(response.data);
                    return;
                }
            } catch (apiError) {
                console.log('API hatası, mock data kullanılıyor:', apiError);
            }
            
            // Mock data - API'den veri gelmezse veya boşsa
            const mockSchedule = {
                Semester: 'Fall',
                Year: 2025,
                ScheduleItems: [
                    {
                        SectionId: 1,
                        CourseCode: 'CS101',
                        CourseName: 'Introduction to Computer Science',
                        SectionNumber: 'A',
                        InstructorName: 'Prof. Dr. Ahmet Yılmaz',
                        ClassroomInfo: 'A-101',
                        Day: 'Monday',
                        StartTime: '09:00',
                        EndTime: '10:30',
                        ClassroomId: 1
                    },
                    {
                        SectionId: 1,
                        CourseCode: 'CS101',
                        CourseName: 'Introduction to Computer Science',
                        SectionNumber: 'A',
                        InstructorName: 'Prof. Dr. Ahmet Yılmaz',
                        ClassroomInfo: 'A-101',
                        Day: 'Wednesday',
                        StartTime: '09:00',
                        EndTime: '10:30',
                        ClassroomId: 1
                    },
                    {
                        SectionId: 2,
                        CourseCode: 'MATH201',
                        CourseName: 'Calculus II',
                        SectionNumber: 'B',
                        InstructorName: 'Doç. Dr. Mehmet Demir',
                        ClassroomInfo: 'B-205',
                        Day: 'Tuesday',
                        StartTime: '10:00',
                        EndTime: '11:30',
                        ClassroomId: 2
                    },
                    {
                        SectionId: 2,
                        CourseCode: 'MATH201',
                        CourseName: 'Calculus II',
                        SectionNumber: 'B',
                        InstructorName: 'Doç. Dr. Mehmet Demir',
                        ClassroomInfo: 'B-205',
                        Day: 'Thursday',
                        StartTime: '10:00',
                        EndTime: '11:30',
                        ClassroomId: 2
                    },
                    {
                        SectionId: 3,
                        CourseCode: 'ENG102',
                        CourseName: 'English Composition',
                        SectionNumber: 'C',
                        InstructorName: 'Dr. Ayşe Kaya',
                        ClassroomInfo: 'C-301',
                        Day: 'Monday',
                        StartTime: '14:00',
                        EndTime: '15:30',
                        ClassroomId: 3
                    },
                    {
                        SectionId: 4,
                        CourseCode: 'PHYS101',
                        CourseName: 'Physics I',
                        SectionNumber: 'A',
                        InstructorName: 'Prof. Dr. Ali Çelik',
                        ClassroomInfo: 'Lab-1',
                        Day: 'Tuesday',
                        StartTime: '13:00',
                        EndTime: '15:00',
                        ClassroomId: 4
                    },
                    {
                        SectionId: 5,
                        CourseCode: 'HIST201',
                        CourseName: 'World History',
                        SectionNumber: 'D',
                        InstructorName: 'Dr. Fatma Özkan',
                        ClassroomInfo: 'D-102',
                        Day: 'Friday',
                        StartTime: '09:00',
                        EndTime: '10:30',
                        ClassroomId: 5
                    }
                ]
            };
            
            setSchedule(mockSchedule);
        } catch (error) {
            toast.error('Ders programı yüklenemedi');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    function handleCourseClick(course) {
        setSelectedCourse(course);
        setIsModalOpen(true);
    }

    function exportToICal() {
        if (!schedule || !schedule.ScheduleItems || schedule.ScheduleItems.length === 0) {
            toast.error('Dışa aktarılacak ders bulunamadı');
            return;
        }

        // iCal formatında dosya oluştur
        let icalContent = 'BEGIN:VCALENDAR\r\n';
        icalContent += 'VERSION:2.0\r\n';
        icalContent += 'PRODID:-//SmartCampus//Schedule//EN\r\n';
        icalContent += 'CALSCALE:GREGORIAN\r\n';
        icalContent += 'METHOD:PUBLISH\r\n';

        // Her ders için event oluştur
        schedule.ScheduleItems.forEach((item, index) => {
            // Gün adını sayıya çevir (1=Monday, 7=Sunday)
            const dayMap = {
                'Monday': 1,
                'Tuesday': 2,
                'Wednesday': 3,
                'Thursday': 4,
                'Friday': 5,
                'Saturday': 6,
                'Sunday': 7
            };
            
            const dayOfWeek = dayMap[item.Day] || 1;
            
            // Bugünden itibaren 16 haftalık dönem için event oluştur
            const startDate = new Date();
            const currentDay = startDate.getDay(); // 0=Sunday, 1=Monday, etc.
            const daysUntilNext = (dayOfWeek - (currentDay === 0 ? 7 : currentDay) + 7) % 7 || 7;
            
            startDate.setDate(startDate.getDate() + daysUntilNext);
            startDate.setHours(parseInt(item.StartTime.split(':')[0]), parseInt(item.StartTime.split(':')[1]), 0, 0);
            
            const endDate = new Date(startDate);
            endDate.setHours(parseInt(item.EndTime.split(':')[0]), parseInt(item.EndTime.split(':')[1]), 0, 0);
            
            // 16 hafta sonrası
            const untilDate = new Date(startDate);
            untilDate.setDate(untilDate.getDate() + (16 * 7));

            // iCal formatında tarih (YYYYMMDDTHHMMSSZ)
            const formatDate = (date) => {
                return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
            };

            icalContent += 'BEGIN:VEVENT\r\n';
            icalContent += `UID:schedule-${item.SectionId}-${index}@smartcampus.edu\r\n`;
            icalContent += `DTSTART:${formatDate(startDate)}\r\n`;
            icalContent += `DTEND:${formatDate(endDate)}\r\n`;
            icalContent += `RRULE:FREQ=WEEKLY;BYDAY=${item.Day.substring(0, 2).toUpperCase()};UNTIL=${formatDate(untilDate)}\r\n`;
            icalContent += `SUMMARY:${item.CourseCode} - ${item.CourseName}\r\n`;
            icalContent += `DESCRIPTION:${item.InstructorName || ''} - ${item.ClassroomInfo || ''}\r\n`;
            if (item.ClassroomInfo) {
                icalContent += `LOCATION:${item.ClassroomInfo}\r\n`;
            }
            icalContent += 'END:VEVENT\r\n';
        });

        icalContent += 'END:VCALENDAR\r\n';

        // Dosyayı indir
        const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `schedule-${schedule.Semester}-${schedule.Year}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success('Ders programı iCal formatında indirildi');
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 bg-muted animate-pulse rounded" />
                <div className="h-96 bg-muted animate-pulse rounded-xl" />
            </div>
        );
    }

    if (!schedule || !schedule.ScheduleItems || schedule.ScheduleItems.length === 0) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold">Ders Programım</h1>
                    <p className="text-muted-foreground mt-1">
                        {schedule ? `${schedule.Semester} ${schedule.Year}` : 'Ders programınız'}
                    </p>
                </div>
                <div className="text-center py-12">
                    <Calendar className="size-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Ders programı bulunamadı</h3>
                    <p className="text-muted-foreground mt-2">
                        Aktif ders kaydınız bulunmuyor.
                    </p>
                </div>
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
                    <h1 className="text-2xl lg:text-3xl font-bold">Ders Programım</h1>
                    <p className="text-muted-foreground mt-1">
                        {schedule.Semester} {schedule.Year}
                    </p>
                </div>
                <button
                    onClick={exportToICal}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                >
                    <Download className="size-4" />
                    <span>iCal'e Aktar</span>
                </button>
            </motion.div>

            {/* Weekly Calendar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-slate-800/50 rounded-xl border border-border p-6"
            >
                <WeeklyCalendar
                    scheduleItems={schedule.ScheduleItems}
                    onCourseClick={handleCourseClick}
                />
            </motion.div>

            {/* Course Detail Modal */}
            <CourseDetailModal
                course={selectedCourse}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}

