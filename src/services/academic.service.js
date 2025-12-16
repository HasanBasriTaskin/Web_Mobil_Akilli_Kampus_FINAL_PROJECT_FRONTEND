/**
 * Academic Service
 * SOLID: Single Responsibility - Sadece akademik işlemleri yönetir
 */

import { get, post, put, del } from './api-client';

/**
 * Ders listesi
 * API: GET /api/v1/Courses
 * @param {object} params - { pageNumber, pageSize, search, departmentId, minCredits, maxCredits, sortBy, sortOrder }
 * @returns {Promise<object>} Ders listesi (PagedResponse)
 */
export async function getCourses(params = {}) {
    const queryParams = new URLSearchParams();

    // Sayfalama parametreleri
    if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);

    // Arama ve filtreleme
    if (params.search) queryParams.append('search', params.search);
    if (params.departmentId) queryParams.append('departmentId', params.departmentId);
    if (params.minCredits) queryParams.append('minCredits', params.minCredits);
    if (params.maxCredits) queryParams.append('maxCredits', params.maxCredits);

    // Sıralama
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const queryString = queryParams.toString();
    const endpoint = `/Courses${queryString ? `?${queryString}` : ''}`;

    return get(endpoint);
}

/**
 * Ders detaylı bilgileri
 * API: GET /api/v1/Courses/{id}
 * @param {number|string} courseId - Ders ID
 * @returns {Promise<object>} Ders detayları
 */
export async function getCourseById(courseId) {
    return get(`/Courses/${courseId}`);
}

/**
 * Yeni ders oluşturma (Admin only)
 * API: POST /api/v1/Courses
 * @param {object} courseData - Ders bilgileri
 * @returns {Promise<object>}
 */
export async function createCourse(courseData) {
    return post('/Courses', courseData);
}

/**
 * Ders güncelleme (Admin only)
 * API: PUT /api/v1/Courses/{id}
 * @param {number|string} courseId - Ders ID
 * @param {object} courseData - Güncellenecek bilgiler
 * @returns {Promise<object>}
 */
export async function updateCourse(courseId, courseData) {
    return put(`/Courses/${courseId}`, courseData);
}

/**
 * Ders silme (Admin only)
 * API: DELETE /api/v1/Courses/{id}
 * @param {number|string} courseId - Ders ID
 * @returns {Promise<object>}
 */
export async function deleteCourse(courseId) {
    return del(`/Courses/${courseId}`);
}

/**
 * Section listesi
 * API: GET /api/v1/Sections
 * @param {object} params - { pageNumber, pageSize, semester, year, instructorId, courseId }
 * @returns {Promise<object>} Section listesi (PagedResponse)
 */
export async function getSections(params = {}) {
    const queryParams = new URLSearchParams();

    if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);
    if (params.semester) queryParams.append('semester', params.semester);
    if (params.year) queryParams.append('year', params.year);
    if (params.instructorId) queryParams.append('instructorId', params.instructorId);
    if (params.courseId) queryParams.append('courseId', params.courseId);

    const queryString = queryParams.toString();
    const endpoint = `/Sections${queryString ? `?${queryString}` : ''}`;

    return get(endpoint);
}

/**
 * Section detayları
 * API: GET /api/v1/Sections/{id}
 * @param {number|string} sectionId - Section ID
 * @returns {Promise<object>} Section detayları
 */
export async function getSectionById(sectionId) {
    return get(`/Sections/${sectionId}`);
}

/**
 * Section oluşturma (Admin only)
 * API: POST /api/v1/Sections
 * @param {object} sectionData - Section bilgileri
 * @returns {Promise<object>}
 */
export async function createSection(sectionData) {
    return post('/Sections', sectionData);
}

/**
 * Section güncelleme (Admin only)
 * API: PUT /api/v1/Sections/{id}
 * @param {number|string} sectionId - Section ID
 * @param {object} sectionData - Güncellenecek bilgiler
 * @returns {Promise<object>}
 */
export async function updateSection(sectionId, sectionData) {
    return put(`/Sections/${sectionId}`, sectionData);
}

/**
 * Derse kayıt olma (Student)
 * API: POST /api/v1/Enrollments
 * @param {object} enrollmentData - { sectionId }
 * @returns {Promise<object>}
 */
export async function enrollInCourse(enrollmentData) {
    return post('/Enrollments', enrollmentData);
}

/**
 * Dersi bırakma (Student)
 * API: DELETE /api/v1/Enrollments/{id}
 * @param {number|string} enrollmentId - Enrollment ID
 * @returns {Promise<object>}
 */
export async function dropCourse(enrollmentId) {
    return del(`/Enrollments/${enrollmentId}`);
}

/**
 * Kayıtlı derslerim (Student)
 * API: GET /api/v1/Enrollments/my-courses
 * @returns {Promise<object>} Kayıtlı dersler listesi
 */
export async function getMyCourses() {
    return get('/Enrollments/my-courses');
}

/**
 * Dersin öğrenci listesi (Faculty)
 * API: GET /api/v1/Enrollments/students/{sectionId}
 * @param {number|string} sectionId - Section ID
 * @returns {Promise<object>} Öğrenci listesi
 */
export async function getSectionStudents(sectionId) {
    return get(`/Enrollments/students/${sectionId}`);
}

/**
 * Notlarım (Student)
 * API: GET /api/v1/Grades/my-grades
 * @returns {Promise<object>} Notlar listesi
 */
export async function getMyGrades() {
    return get('/Grades/my-grades');
}

/**
 * Transkript JSON (Student)
 * API: GET /api/v1/Grades/transcript
 * @returns {Promise<object>} Transkript verisi
 */
export async function getTranscript() {
    return get('/Grades/transcript');
}

/**
 * Transkript PDF (Student)
 * API: GET /api/v1/Grades/transcript/pdf
 * @returns {Promise<Blob>} PDF dosyası
 */
export async function getTranscriptPDF() {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    const response = await fetch(`${API_BASE_URL}/Grades/transcript/pdf`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'PDF indirilemedi');
    }

    return response.blob();
}

/**
 * Not girişi (Faculty)
 * API: POST /api/v1/Grades
 * @param {object} gradeData - { enrollmentId, midtermGrade, finalGrade }
 * @returns {Promise<object>}
 */
export async function submitGrade(gradeData) {
    return post('/Grades', gradeData);
}

/**
 * Not güncelleme (Faculty)
 * API: PUT /api/v1/Grades/enrollment/{enrollmentId}
 * @param {number|string} enrollmentId - Enrollment ID
 * @param {object} gradeData - Güncellenecek notlar
 * @returns {Promise<object>}
 */
export async function updateGrade(enrollmentId, gradeData) {
    return put(`/Grades/enrollment/${enrollmentId}`, gradeData);
}

/**
 * Bölüm listesi
 * @returns {Promise<object>} Bölüm listesi
 */
export async function getDepartments() {
    return get('/departments');
}

export default {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    getSections,
    getSectionById,
    createSection,
    updateSection,
    enrollInCourse,
    dropCourse,
    getMyCourses,
    getSectionStudents,
    getMyGrades,
    getTranscript,
    getTranscriptPDF,
    submitGrade,
    updateGrade,
    getDepartments,
};

