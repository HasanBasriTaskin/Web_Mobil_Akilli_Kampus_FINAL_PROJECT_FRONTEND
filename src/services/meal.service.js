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
    const result = await response.json();
    return result;
}

export default {
    getMenus,
    createReservation
};

