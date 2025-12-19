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

export default {
    getEvents,
    getEventById
};

