/**
 * Attendance Service
 * SOLID: Single Responsibility - Sadece yoklama işlemlerini yönetir
 */

import { get, post, put, postFormData } from './api-client';

/**
 * Yoklama oturumu açma (Faculty)
 * @param {object} sessionData - { sectionId, date, startTime, endTime, geofenceRadius }
 * @returns {Promise<object>} Oturum bilgileri
 */
export async function createAttendanceSession(sessionData) {
    return post('/attendance/sessions', sessionData);
}

/**
 * Oturum detayları
 * @param {number|string} sessionId - Session ID
 * @returns {Promise<object>} Oturum detayları
 */
export async function getAttendanceSession(sessionId) {
    return get(`/attendance/sessions/${sessionId}`);
}

/**
 * Oturumu kapatma (Faculty)
 * @param {number|string} sessionId - Session ID
 * @returns {Promise<object>}
 */
export async function closeAttendanceSession(sessionId) {
    return put(`/attendance/sessions/${sessionId}/close`, {});
}

/**
 * Benim oturumlarım (Faculty)
 * @returns {Promise<object>} Oturum listesi
 */
export async function getMySessions() {
    return get('/attendance/sessions/my-sessions');
}

/**
 * Yoklama verme (Student)
 * @param {number|string} sessionId - Session ID
 * @param {object} locationData - { latitude, longitude, accuracy }
 * @returns {Promise<object>}
 */
export async function checkIn(sessionId, locationData) {
    return post(`/attendance/sessions/${sessionId}/checkin`, locationData);
}

/**
 * Yoklama durumum (Student)
 * @returns {Promise<object>} Yoklama istatistikleri
 */
export async function getMyAttendance() {
    return get('/attendance/my-attendance');
}

/**
 * Yoklama raporu (Faculty)
 * @param {number|string} sectionId - Section ID
 * @returns {Promise<object>} Rapor verisi
 */
export async function getAttendanceReport(sectionId) {
    return get(`/attendance/report/${sectionId}`);
}

/**
 * Mazeret bildirme (Student)
 * @param {object} excuseData - { sessionId, reason, document (File) }
 * @returns {Promise<object>}
 */
export async function submitExcuseRequest(excuseData) {
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
 * @returns {Promise<object>} Mazeret talepleri listesi
 */
export async function getExcuseRequests() {
    return get('/attendance/excuse-requests');
}

/**
 * Mazeret onaylama (Faculty)
 * @param {number|string} requestId - Request ID
 * @param {object} data - { notes }
 * @returns {Promise<object>}
 */
export async function approveExcuseRequest(requestId, data = {}) {
    return put(`/attendance/excuse-requests/${requestId}/approve`, data);
}

/**
 * Mazeret reddetme (Faculty)
 * @param {number|string} requestId - Request ID
 * @param {object} data - { notes }
 * @returns {Promise<object>}
 */
export async function rejectExcuseRequest(requestId, data = {}) {
    return put(`/attendance/excuse-requests/${requestId}/reject`, data);
}

export default {
    createAttendanceSession,
    getAttendanceSession,
    closeAttendanceSession,
    getMySessions,
    checkIn,
    getMyAttendance,
    getAttendanceReport,
    submitExcuseRequest,
    getExcuseRequests,
    approveExcuseRequest,
    rejectExcuseRequest,
};

