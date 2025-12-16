<<<<<<< Updated upstream
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

=======
/**
 * Attendance Service - Yoklama işlemleri için API servisi
 */

import { get, post, put } from './api-client';

// ==================== SESSION MANAGEMENT (Faculty) ====================

/**
 * Yeni yoklama oturumu oluştur
 * @param {object} sessionData 
 */
export async function createSession(sessionData) {
    return post('/attendance/sessions', sessionData);
}

/**
 * Oturum detaylarını getir
 * @param {number} sessionId 
 */
export async function getSessionById(sessionId) {
    return get(`/attendance/sessions/${sessionId}`);
}

/**
 * Oturumu kapat
 * @param {number} sessionId 
 */
export async function closeSession(sessionId) {
    return put(`/attendance/sessions/${sessionId}/close`);
}

/**
 * Instructor'ın oturumlarını getir
 */
export async function getMySessions() {
    return get('/attendance/sessions/my-sessions');
}

/**
 * Oturum kayıtlarını getir
 * @param {number} sessionId 
 */
export async function getSessionRecords(sessionId) {
    return get(`/attendance/sessions/${sessionId}/records`);
}

// ==================== STUDENT CHECK-IN ====================

/**
 * Yoklamaya katıl (GPS ile)
 * @param {number} sessionId 
 * @param {object} locationData - { latitude, longitude, accuracy }
 */
export async function checkIn(sessionId, locationData) {
    return post(`/attendance/sessions/${sessionId}/checkin`, locationData);
}

/**
 * Öğrencinin yoklama istatistiklerini getir
 */
export async function getMyAttendance() {
    return get('/attendance/my-attendance');
}

// ==================== EXCUSE REQUESTS ====================

/**
 * Mazeret talebi oluştur
 * @param {object} requestData - { sessionId, reason }
 */
export async function createExcuseRequest(requestData) {
    return post('/attendance/excuse-requests', requestData);
}

/**
 * Mazeret taleplerini getir (Faculty)
 * @param {number} sectionId - Opsiyonel filtre
 */
export async function getExcuseRequests(sectionId = null) {
    const query = sectionId ? `?sectionId=${sectionId}` : '';
    return get(`/attendance/excuse-requests${query}`);
}

/**
 * Mazeret talebini onayla
 * @param {number} requestId 
 * @param {object} reviewData - { notes }
 */
export async function approveExcuseRequest(requestId, reviewData = {}) {
    return put(`/attendance/excuse-requests/${requestId}/approve`, reviewData);
}

/**
 * Mazeret talebini reddet
 * @param {number} requestId 
 * @param {object} reviewData - { notes }
 */
export async function rejectExcuseRequest(requestId, reviewData = {}) {
    return put(`/attendance/excuse-requests/${requestId}/reject`, reviewData);
}

// ==================== GPS UTILITIES ====================

/**
 * İki koordinat arasındaki mesafeyi hesapla (Haversine - metre)
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Dünya yarıçapı (m)
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(deg) {
    return deg * (Math.PI / 180);
}

export default {
    createSession,
    getSessionById,
    closeSession,
    getMySessions,
    getSessionRecords,
    checkIn,
    getMyAttendance,
    createExcuseRequest,
    getExcuseRequests,
    approveExcuseRequest,
    rejectExcuseRequest,
    calculateDistance
};
>>>>>>> Stashed changes
