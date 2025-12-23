/**
 * Wallet Service - Cüzdan servisi için API entegrasyonu
 * Backend endpoint'leri hazır olmadığı için mock API kullanılıyor
 */

/**
 * Bakiye getir
 */
export async function getBalance() {
    const response = await fetch('/api/v1/wallet/balance');
    
    if (!response.ok) {
        throw new Error('Bakiye yüklenemedi');
    }
    
    const data = await response.json();
    return data;
}

/**
 * Para yükleme işlemi başlat
 * @param {object} data - { amount, paymentMethod }
 */
export async function addMoney(data) {
    const response = await fetch('/api/v1/wallet/deposit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Para yükleme başlatılamadı';
        
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
 * İşlem geçmişini getir
 * @param {object} params - { page, pageSize, type, status }
 */
export async function getTransactions(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);
    if (params.type) queryParams.append('type', params.type);
    if (params.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    const response = await fetch(`/api/v1/wallet/transactions${queryString ? `?${queryString}` : ''}`);
    
    if (!response.ok) {
        throw new Error('İşlem geçmişi yüklenemedi');
    }
    
    const data = await response.json();
    return data;
}

export default {
    getBalance,
    addMoney,
    getTransactions
};

