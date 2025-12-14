/**
 * Attendance Service
 * API Dokümantasyonuna uygun - 7. Attendance Controller
 * 
 * Base Path: /api/v1/Attendance
 * - POST /sessions - Oturum oluştur
 * - GET /sessions/{id} - Oturum detayı
 * - GET /sessions/{id}/records - Oturum kayıtları
 * - GET /sessions/{id}/qr-code - QR kod
 * - PUT /sessions/{id}/close - Oturum kapat
 * - POST /sessions/{id}/checkin - Yoklama ver
 * - GET /sessions/my-sessions - Benim oturumlarım
 * - GET /students/{studentId} - Öğrenci yoklamaları
 * - GET /report/{sectionId} - Rapor
 * - GET /my-attendance - Benim yoklamam
 * 
 * Excuse Requests Base Path: /api/v1/attendance/excuse-requests
 */

import { get, post, put, postFormData } from './api-client';

/**
 * Yoklama oturumu açma (Faculty)
 * POST /api/v1/Attendance/sessions
 */
export async function createAttendanceSession(sessionData) {
    return post('/Attendance/sessions', sessionData);
}

/**
 * Oturum detayları
 * GET /api/v1/Attendance/sessions/{sessionId}
 */
export async function getAttendanceSession(sessionId) {
    return get(`/Attendance/sessions/${sessionId}`);
}

/**
 * Oturum kayıtları - katılan öğrenciler (Faculty)
 * GET /api/v1/Attendance/sessions/{sessionId}/records
 */
export async function getSessionRecords(sessionId) {
    return get(`/Attendance/sessions/${sessionId}/records`);
}

/**
 * QR kod bilgisi
 * GET /api/v1/Attendance/sessions/{sessionId}/qr-code
 */
export async function getQRCode(sessionId) {
    return get(`/Attendance/sessions/${sessionId}/qr-code`);
}

/**
 * Oturumu kapatma (Faculty)
 * PUT /api/v1/Attendance/sessions/{id}/close
 */
export async function closeAttendanceSession(sessionId) {
    return put(`/Attendance/sessions/${sessionId}/close`, {});
}

/**
 * Benim oturumlarım (Faculty)
 * GET /api/v1/Attendance/sessions/my-sessions
 */
export async function getMySessions() {
    return get('/Attendance/sessions/my-sessions');
}

/**
 * Yoklama verme (Student)
 * POST /api/v1/Attendance/sessions/{sessionId}/checkin
 */
export async function checkIn(sessionId, locationData) {
    return post(`/Attendance/sessions/${sessionId}/checkin`, locationData);
}

/**
 * Öğrenci yoklamaları
 * GET /api/v1/Attendance/students/{studentId}
 */
export async function getStudentAttendance(studentId) {
    return get(`/Attendance/students/${studentId}`);
}

/**
 * Yoklama durumum (Student)
 * GET /api/v1/Attendance/my-attendance
 */
export async function getMyAttendance() {
    return get('/Attendance/my-attendance');
}

/**
 * Yoklama raporu (Faculty)
 * GET /api/v1/Attendance/report/{sectionId}
 */
export async function getAttendanceReport(sectionId) {
    return get(`/Attendance/report/${sectionId}`);
}

// ============================================
// EXCUSE REQUESTS - Base: /api/v1/attendance/excuse-requests
// ============================================

/**
 * Mazeret talebi oluşturma (Student)
 * POST /api/v1/attendance/excuse-requests
 */
export async function submitExcuseRequest(excuseData) {
    // Dokümantasyona göre JSON body (documentUrl string olarak)
    return post('/attendance/excuse-requests', {
        sessionId: excuseData.sessionId,
        reason: excuseData.reason,
        documentUrl: excuseData.documentUrl || null,
    });
}

/**
 * Mazeret talebi oluşturma (FormData ile dosya yükleme)
 */
export async function submitExcuseRequestWithFile(excuseData) {
    const formData = new FormData();
    formData.append('sessionId', excuseData.sessionId);
    formData.append('reason', excuseData.reason);

    if (excuseData.document) {
        formData.append('document', excuseData.document);
    }

    return postFormData('/attendance/excuse-requests', formData);
}

/**
 * Mazeret listesi (Faculty)
 * GET /api/v1/attendance/excuse-requests
 */
export async function getExcuseRequests() {
    return get('/attendance/excuse-requests');
}

/**
 * Mazeret onaylama (Faculty)
 * PUT /api/v1/attendance/excuse-requests/{id}/approve
 */
export async function approveExcuseRequest(requestId, data = {}) {
    return put(`/attendance/excuse-requests/${requestId}/approve`, data);
}

/**
 * Mazeret reddetme (Faculty)
 * PUT /api/v1/attendance/excuse-requests/{id}/reject
 */
export async function rejectExcuseRequest(requestId, data = {}) {
    return put(`/attendance/excuse-requests/${requestId}/reject`, data);
}

export default {
    createAttendanceSession,
    getAttendanceSession,
    getSessionRecords,
    getQRCode,
    closeAttendanceSession,
    getMySessions,
    checkIn,
    getStudentAttendance,
    getMyAttendance,
    getAttendanceReport,
    submitExcuseRequest,
    submitExcuseRequestWithFile,
    getExcuseRequests,
    approveExcuseRequest,
    rejectExcuseRequest,
};

