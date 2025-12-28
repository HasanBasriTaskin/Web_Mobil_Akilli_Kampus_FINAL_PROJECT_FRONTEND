/**
 * Event Service - Etkinlik servisi için API entegrasyonu
 * Events Page için gerekli fonksiyonlar
 * Backend endpoint'leri hazır olmadığı için mock API kullanılıyor
 */

/**
 * Etkinlik listesi getir
 * @param {object} params - { category, date, search }
 */
export async function getEvents(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.category) queryParams.append('category', params.category);
    if (params.date) queryParams.append('date', params.date);
    if (params.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    const response = await fetch(`/api/v1/events${queryString ? `?${queryString}` : ''}`);
    
    if (!response.ok) {
        throw new Error('Etkinlikler yüklenemedi');
    }
    
    const data = await response.json();
    return data;
}

/**
 * Etkinlik detayı getir
 * @param {string} eventId - Etkinlik ID
 */
export async function getEventById(eventId) {
    const response = await fetch(`/api/v1/events/${eventId}`);
    
    if (!response.ok) {
        throw new Error('Etkinlik detayı yüklenemedi');
    }
    
    const data = await response.json();
    return data;
}

/**
 * Etkinliğe kayıt ol
 * @param {string} eventId - Etkinlik ID
 * @param {object} formData - Kayıt form verileri
 */
export async function registerToEvent(eventId, formData = {}) {
    const response = await fetch(`/api/v1/events/${eventId}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Kayıt işlemi başarısız oldu';
        
        try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorMessage;
        } catch {
            errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
    }
    
    const result = await response.json();
    return result;
}

/**
 * Kullanıcının kayıt olduğu etkinlikleri getir
 */
export async function getMyEvents() {
    const response = await fetch('/api/v1/events/my-events');
    
    if (!response.ok) {
        throw new Error('Kayıtlı etkinlikler yüklenemedi');
    }
    
    const data = await response.json();
    return data;
}

/**
 * Etkinlik kaydını iptal et
 * @param {string} registrationId - Kayıt ID
 */
export async function cancelEventRegistration(registrationId) {
    const response = await fetch(`/api/v1/events/registrations/${registrationId}/cancel`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Kayıt iptal edilemedi';
        
        try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorMessage;
        } catch {
            errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
    }
    
    const result = await response.json();
    return result;
}

/**
 * QR kod ile kayıt doğrula (Check-in için)
 * @param {string} qrCode - QR kod
 */
export async function validateEventQRCode(qrCode) {
    const response = await fetch('/api/v1/events/checkin/validate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrCode })
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'QR kod doğrulanamadı';
        
        try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorMessage;
        } catch {
            errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
    }
    
    const result = await response.json();
    return result;
}

/**
 * Check-in yap
 * @param {string} qrCode - QR kod
 */
export async function checkInEvent(qrCode) {
    const response = await fetch('/api/v1/events/checkin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrCode })
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Check-in başarısız oldu';
        
        try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorMessage;
        } catch {
            errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
    }
    
    const result = await response.json();
    return result;
}

/**
 * Etkinlik katılımcı sayısını getir
 * @param {string} eventId - Etkinlik ID
 */
export async function getEventAttendeeCount(eventId) {
    const response = await fetch(`/api/v1/events/${eventId}/attendees`);
    
    if (!response.ok) {
        throw new Error('Katılımcı sayısı yüklenemedi');
    }
    
    const data = await response.json();
    return data;
}

export default {
    getEvents,
    getEventById,
    registerToEvent,
    getMyEvents,
    cancelEventRegistration,
    validateEventQRCode,
    checkInEvent,
    getEventAttendeeCount
};
