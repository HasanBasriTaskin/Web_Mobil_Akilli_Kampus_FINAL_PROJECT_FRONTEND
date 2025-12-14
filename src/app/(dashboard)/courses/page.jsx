'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Clock, ArrowRight, Grid3x3, List, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getCourses } from '@/services/academic.service';
import { mockCourses, mockDepartments } from '@/mocks/academic.mock';

/**
 * Course Catalog Page
 * Ders kataloğu - List all courses, Search by code/name, Filter by department, Click to view details
 */
export default function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [departments] = useState(mockDepartments); // Departments endpoint yok, mock kullanılıyor
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    // Pagination state - Backend tarafında yapılacak
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(9);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);

    useEffect(() => {
        loadCourses();
    }, [currentPage, departmentFilter]);

    async function loadCourses() {
        try {
            setLoading(true);

            // Backend API'ye uygun parametreler
            const params = {
                pageNumber: currentPage,
                pageSize: pageSize,
            };

            if (searchTerm) params.search = searchTerm;
            if (departmentFilter) params.departmentId = departmentFilter;

            const response = await getCourses(params);

            if (response.success && response.data) {
                // Backend PagedResponse formatı: { data: [...], pageNumber, pageSize, totalPages, totalRecords, hasNext, hasPrevious }
                // veya doğrudan array olabilir

                if (Array.isArray(response.data)) {
                    // Doğrudan array döndüyse
                    setCourses(response.data);
                    setTotalRecords(response.data.length);
                    setTotalPages(1);
                    setHasNext(false);
                    setHasPrevious(false);
                } else if (response.data.data && Array.isArray(response.data.data)) {
                    // PagedResponse formatı (nested data)
                    setCourses(response.data.data);
                    setTotalPages(response.data.totalPages || 1);
                    setTotalRecords(response.data.totalRecords || response.data.data.length);
                    setHasNext(response.data.hasNext || false);
                    setHasPrevious(response.data.hasPrevious || false);
                } else {
                    // PagedResponse formatı (flat - api-client normalizes)
                    const coursesData = response.data;
                    setCourses(Array.isArray(coursesData) ? coursesData : []);
                }
            } else {
                // API başarısız - Mock data fallback
                handleMockDataFallback();
            }
        } catch (error) {
            console.error('Dersler yüklenemedi, mock data kullanılıyor:', error);
            handleMockDataFallback();
        } finally {
            setLoading(false);
        }
    }

    function handleMockDataFallback() {
        let filteredCourses = [...mockCourses];

        if (searchTerm) {
            filteredCourses = filteredCourses.filter(c =>
                c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (departmentFilter) {
            filteredCourses = filteredCourses.filter(c =>
                c.department?.id === parseInt(departmentFilter) ||
                c.departmentId === parseInt(departmentFilter)
            );
        }

        // Client-side pagination for mock data
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedMockCourses = filteredCourses.slice(startIndex, endIndex);

        setCourses(paginatedMockCourses);
        setTotalRecords(filteredCourses.length);
        setTotalPages(Math.ceil(filteredCourses.length / pageSize));
        setHasNext(endIndex < filteredCourses.length);
        setHasPrevious(currentPage > 1);
    }

    function handleSearch(e) {
        e.preventDefault();
        setCurrentPage(1);
        loadCourses();
    }


    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold">Ders Kataloğu</h1>
                <p className="text-muted-foreground mt-2">
                    Tüm dersleri görüntüleyin ve detaylarına ulaşın
                </p>
            </motion.div>

            {/* Search and Filter */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
            >
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Ders kodu veya adı ile ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="sm:w-48">
                        <select
                            value={departmentFilter}
                            onChange={(e) => {
                                setDepartmentFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
                        >
                            <option value="">Tüm Bölümler</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant={viewMode === 'grid' ? 'default' : 'outline'}
                            onClick={() => setViewMode('grid')}
                            className="sm:w-auto"
                        >
                            <Grid3x3 className="size-4" />
                        </Button>
                        <Button
                            type="button"
                            variant={viewMode === 'list' ? 'default' : 'outline'}
                            onClick={() => setViewMode('list')}
                            className="sm:w-auto"
                        >
                            <List className="size-4" />
                        </Button>
                    </div>
                    <Button onClick={handleSearch} className="sm:w-auto">
                        Ara
                    </Button>
                </form>
            </motion.div>

            {/* Courses Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="text-muted-foreground">Yükleniyor...</div>
                </div>
            ) : courses.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <BookOpen className="size-16 mx-auto mb-4 opacity-50" />
                    <p>Ders bulunamadı</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course, index) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <div className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border hover:shadow-lg transition-all group">
                                {/* Course Code Badge */}
                                <div className="mb-4">
                                    <span className="inline-block px-3 py-1 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white font-mono text-sm font-semibold">
                                        {course.code}
                                    </span>
                                </div>

                                {/* Course Title */}
                                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                                    {course.name}
                                </h3>

                                {/* Description */}
                                {course.description && (
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                        {course.description}
                                    </p>
                                )}

                                {/* Course Info */}
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                    <Clock className="size-4" />
                                    <span>{course.credits} Kredi</span>
                                    {course.ects && (
                                        <span className="ml-2">({course.ects} ECTS)</span>
                                    )}
                                </div>

                                {/* View Details Button */}
                                <Link href={`/courses/${course.id}`}>
                                    <Button className="w-full group-hover:gap-2 transition-all">
                                        <span>Detayları Gör</span>
                                        <ArrowRight className="size-4" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {courses.map((course, index) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <div className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border hover:shadow-lg transition-all">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="px-3 py-1 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white font-mono text-sm font-semibold">
                                                {course.code}
                                            </span>
                                            <h3 className="text-lg font-semibold">{course.name}</h3>
                                        </div>
                                        {course.description && (
                                            <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                                        )}
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Clock className="size-4" />
                                            <span>{course.credits} Kredi</span>
                                            {course.ects && (
                                                <span className="ml-2">({course.ects} ECTS)</span>
                                            )}
                                        </div>
                                    </div>
                                    <Link href={`/courses/${course.id}`}>
                                        <Button>
                                            <span>Detayları Gör</span>
                                            <ArrowRight className="size-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-muted-foreground">
                        Sayfa {currentPage} / {totalPages} ({totalRecords} sonuç)
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="size-4" />
                        </Button>
                        {[...Array(totalPages)].map((_, i) => {
                            const page = i + 1;
                            if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                                return (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </Button>
                                );
                            } else if (page === currentPage - 2 || page === currentPage + 2) {
                                return <span key={page} className="px-2">...</span>;
                            }
                            return null;
                        })}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
