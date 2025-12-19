/**
 * Meal Service Mock Data
 * Menu Page için sahte veriler
 * Part 3 - Meal Service
 */

// Tarih bazlı menü verileri oluştur
function generateMenusForDate(date) {
    const dateStr = new Date(date).toISOString().split('T')[0];
    const dayOfWeek = new Date(date).getDay();
    
    // Hafta içi ve hafta sonu için farklı menüler
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Hafta içi menüler
    const weekdayLunchItems = ['Köfte', 'Makarna', 'Mevsim Salatası', 'Mercimek Çorbası', 'Meyve'];
    const weekdayDinnerItems = ['Etli Kuru Fasulye', 'Pilav', 'Turşu', 'Yeşil Salata', 'Meyve'];
    
    // Hafta sonu menüler (daha özel)
    const weekendLunchItems = ['Izgara Tavuk', 'Pilav', 'Mevsim Salatası', 'Domates Çorbası', 'Sütlaç'];
    const weekendDinnerItems = ['Balık Tava', 'Sebze Yemeği (Vejetaryen)', 'Bulgur Pilavı', 'Yeşil Salata', 'Baklava'];
    
    // Vegan/Vegetarian seçenekleri ekle
    const veganOptions = ['Vegan Köfte', 'Vegan Pilav', 'Vegan Salata'];
    const vegetarianOptions = ['Vejetaryen Köfte', 'Vejetaryen Makarna'];
    
    return [
        // Öğle Yemeği
        {
            id: `lunch-${dateStr}`,
            cafeteriaId: 1,
            cafeteriaName: 'Ana Yemekhane',
            date: dateStr,
            mealType: 'lunch',
            items: isWeekend ? weekendLunchItems : weekdayLunchItems,
            nutrition: {
                calories: isWeekend ? 650 : 720,
                protein: isWeekend ? 45 : 52,
                carbs: isWeekend ? 65 : 78,
                fat: isWeekend ? 18 : 22,
                fiber: isWeekend ? 8 : 10
            },
            isPublished: true,
            createdAt: new Date().toISOString()
        },
        // Akşam Yemeği
        {
            id: `dinner-${dateStr}`,
            cafeteriaId: 1,
            cafeteriaName: 'Ana Yemekhane',
            date: dateStr,
            mealType: 'dinner',
            items: isWeekend ? weekendDinnerItems : weekdayDinnerItems,
            nutrition: {
                calories: isWeekend ? 580 : 680,
                protein: isWeekend ? 38 : 48,
                carbs: isWeekend ? 58 : 72,
                fat: isWeekend ? 15 : 20,
                fiber: isWeekend ? 12 : 14
            },
            isPublished: true,
            createdAt: new Date().toISOString()
        }
    ];
}

/**
 * Menü listesi getir (tarih filtresi ile)
 * @param {string} date - YYYY-MM-DD formatında tarih
 */
export function getMockMenus(date) {
    if (!date) {
        // Bugün için menü
        return generateMenusForDate(new Date());
    }
    
    const requestedDate = new Date(date);
    return generateMenusForDate(requestedDate);
}

/**
 * Rezervasyon oluştur (mock)
 * @param {object} data - { menuId, mealType, date }
 */
export function createMockReservation(data) {
    // Simüle edilmiş rezervasyon
    const reservation = {
        id: `res-${Date.now()}`,
        userId: 1,
        menuId: data.menuId,
        cafeteriaId: 1,
        mealType: data.mealType,
        date: data.date,
        amount: 0, // Burslu öğrenci için 0
        qrCode: `QR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        status: 'reserved',
        createdAt: new Date().toISOString()
    };
    
    return reservation;
}

export default {
    getMockMenus,
    createMockReservation
};

