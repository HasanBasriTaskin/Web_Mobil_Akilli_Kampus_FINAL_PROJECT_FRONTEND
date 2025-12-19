/**
 * Meal Service - Yemek servisi için API entegrasyonu
 * Menu Page için gerekli fonksiyonlar
 * Backend endpoint'leri hazır olmadığı için mock API kullanılıyor
 */

/**
 * Menü listesi getir
 * @param {object} params - { date, cafeteriaId }
 */
export async function getMenus(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.date) queryParams.append('date', params.date);
    if (params.cafeteriaId) queryParams.append('cafeteriaId', params.cafeteriaId);

    const queryString = queryParams.toString();
    const response = await fetch(`/api/v1/meals/menus${queryString ? `?${queryString}` : ''}`);
    
    if (!response.ok) {
        throw new Error('Menüler yüklenemedi');
    }
    
    const data = await response.json();
    return data;
}

/**
 * Yemek rezervasyonu yap
 * @param {object} data - { menuId, mealType, date }
 */
export async function createReservation(data) {
    const response = await fetch('/api/v1/meals/reservations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Rezervasyon yapılamadı';
        
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
 * Kullanıcının rezervasyonlarını getir
 * @param {object} params - { status, dateFrom, dateTo }
 */
export async function getMyReservations(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) queryParams.append('dateTo', params.dateTo);

    const queryString = queryParams.toString();
    const response = await fetch(`/api/v1/meals/my-reservations${queryString ? `?${queryString}` : ''}`);
    
    if (!response.ok) {
        throw new Error('Rezervasyonlar yüklenemedi');
    }
    
    const data = await response.json();
    return data;
}

/**
 * Rezervasyon iptal et
 * @param {string} reservationId - Rezervasyon ID
 */
export async function cancelReservation(reservationId) {
    const response = await fetch(`/api/v1/meals/reservations/${reservationId}/cancel`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Rezervasyon iptal edilemedi';
        
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

export default {
    getMenus,
    createReservation,
    getMyReservations,
    cancelReservation
};

