/**
 * Meal Service Mock Data
 * Menu Page için sahte veriler
 * Part 3 - Meal Service
 */

// In-memory store (server-side için localStorage yerine)
let mockReservationsStore = [];

// Örnek rezervasyonları yükle (ilk çağrıda)
function initializeMockReservations() {
    if (mockReservationsStore.length === 0) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        
        mockReservationsStore = [
            // Gelecek rezervasyonlar
            {
                id: 'res-upcoming-1',
                userId: 1,
                menuId: `lunch-${tomorrow.toISOString().split('T')[0]}`,
                cafeteriaId: 1,
                cafeteriaName: 'Ana Yemekhane',
                mealType: 'lunch',
                date: tomorrow.toISOString().split('T')[0],
                amount: 0,
                qrCode: 'QR-UPCOMING-001-ABC123XYZ',
                status: 'reserved',
                createdAt: new Date().toISOString(),
                menu: {
                    items: ['Köfte', 'Makarna', 'Mevsim Salatası', 'Mercimek Çorbası', 'Meyve']
                }
            },
            {
                id: 'res-upcoming-2',
                userId: 1,
                menuId: `dinner-${tomorrow.toISOString().split('T')[0]}`,
                cafeteriaId: 1,
                cafeteriaName: 'Ana Yemekhane',
                mealType: 'dinner',
                date: tomorrow.toISOString().split('T')[0],
                amount: 0,
                qrCode: 'QR-UPCOMING-002-DEF456UVW',
                status: 'reserved',
                createdAt: new Date().toISOString(),
                menu: {
                    items: ['Etli Kuru Fasulye', 'Pilav', 'Turşu', 'Yeşil Salata', 'Meyve']
                }
            },
            // Bugünkü rezervasyon
            {
                id: 'res-today-1',
                userId: 1,
                menuId: `lunch-${today.toISOString().split('T')[0]}`,
                cafeteriaId: 1,
                cafeteriaName: 'Ana Yemekhane',
                mealType: 'lunch',
                date: today.toISOString().split('T')[0],
                amount: 0,
                qrCode: 'QR-TODAY-001-GHI789RST',
                status: 'reserved',
                createdAt: new Date().toISOString(),
                menu: {
                    items: ['Izgara Tavuk', 'Pilav', 'Mevsim Salatası', 'Domates Çorbası', 'Sütlaç']
                }
            },
            // Geçmiş rezervasyonlar (kullanılmış)
            {
                id: 'res-past-1',
                userId: 1,
                menuId: `lunch-${yesterday.toISOString().split('T')[0]}`,
                cafeteriaId: 1,
                cafeteriaName: 'Ana Yemekhane',
                mealType: 'lunch',
                date: yesterday.toISOString().split('T')[0],
                amount: 0,
                qrCode: 'QR-PAST-001-JKL012MNO',
                status: 'used',
                usedAt: yesterday.toISOString(),
                createdAt: lastWeek.toISOString(),
                menu: {
                    items: ['Köfte', 'Makarna', 'Mevsim Salatası', 'Mercimek Çorbası', 'Meyve']
                }
            },
            {
                id: 'res-past-2',
                userId: 1,
                menuId: `dinner-${yesterday.toISOString().split('T')[0]}`,
                cafeteriaId: 1,
                cafeteriaName: 'Ana Yemekhane',
                mealType: 'dinner',
                date: yesterday.toISOString().split('T')[0],
                amount: 0,
                qrCode: 'QR-PAST-002-PQR345STU',
                status: 'used',
                usedAt: yesterday.toISOString(),
                createdAt: lastWeek.toISOString(),
                menu: {
                    items: ['Etli Kuru Fasulye', 'Pilav', 'Turşu', 'Yeşil Salata', 'Meyve']
                }
            },
            // İptal edilmiş rezervasyon
            {
                id: 'res-cancelled-1',
                userId: 1,
                menuId: `lunch-${lastWeek.toISOString().split('T')[0]}`,
                cafeteriaId: 1,
                cafeteriaName: 'Ana Yemekhane',
                mealType: 'lunch',
                date: lastWeek.toISOString().split('T')[0],
                amount: 0,
                qrCode: 'QR-CANCELLED-001-VWX678YZA',
                status: 'cancelled',
                cancelledAt: lastWeek.toISOString(),
                createdAt: new Date(lastWeek.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                menu: {
                    items: ['Köfte', 'Makarna', 'Mevsim Salatası', 'Mercimek Çorbası', 'Meyve']
                }
            }
        ];
    }
}

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
        cafeteriaName: 'Ana Yemekhane',
        mealType: data.mealType,
        date: data.date,
        amount: 0, // Burslu öğrenci için 0
        qrCode: `QR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        status: 'reserved',
        createdAt: new Date().toISOString()
    };
    
    // In-memory store'a kaydet
    mockReservationsStore.push(reservation);
    
    return reservation;
}

/**
 * Kullanıcının rezervasyonlarını getir (mock)
 * @param {object} params - { status, dateFrom, dateTo }
 */
export function getMockMyReservations(params = {}) {
    // In-memory store'u başlat
    initializeMockReservations();
    
    // Rezervasyonları kopyala (referans sorununu önlemek için)
    let reservations = JSON.parse(JSON.stringify(mockReservationsStore));
    
    // Filtreleme
    if (params.status) {
        reservations = reservations.filter(r => r.status === params.status);
    }
    
    if (params.dateFrom) {
        reservations = reservations.filter(r => r.date >= params.dateFrom);
    }
    
    if (params.dateTo) {
        reservations = reservations.filter(r => r.date <= params.dateTo);
    }
    
    // Tarihe göre sırala (gelecek -> geçmiş)
    reservations.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA; // Yeni tarihler önce
    });
    
    return reservations;
}

/**
 * Rezervasyon iptal et (mock)
 * @param {string} reservationId - Rezervasyon ID
 */
export function cancelMockReservation(reservationId) {
    // In-memory store'u başlat
    initializeMockReservations();
    
    const reservation = mockReservationsStore.find(r => r.id === reservationId);
    
    if (!reservation) {
        throw new Error('Rezervasyon bulunamadı');
    }
    
    // İptal edilebilir mi kontrol et (>= 2 saat kala)
    const reservationDate = new Date(reservation.date);
    const mealTime = reservation.mealType === 'lunch' ? 12 : 18; // Öğle: 12:00, Akşam: 18:00
    reservationDate.setHours(mealTime, 0, 0, 0);
    
    const now = new Date();
    const hoursUntilMeal = (reservationDate - now) / (1000 * 60 * 60);
    
    if (hoursUntilMeal < 2) {
        throw new Error('Rezervasyon en az 2 saat önceden iptal edilebilir');
    }
    
    if (reservation.status !== 'reserved') {
        throw new Error('Sadece rezerve edilmiş yemekler iptal edilebilir');
    }
    
    // İptal et
    reservation.status = 'cancelled';
    reservation.cancelledAt = new Date().toISOString();
    
    return reservation;
}

export default {
    getMockMenus,
    createMockReservation,
    getMockMyReservations,
    cancelMockReservation
};

