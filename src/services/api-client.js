/**
 * API Client - Fetch Wrapper with Auto Token Refresh
 * SOLID: Single Responsibility - Sadece HTTP isteklerini yönetir
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

// Token refresh state - race condition önleme
let isRefreshing = false;
let refreshSubscribers = [];

/**
 * Token yenilendiğinde bekleyen istekleri çalıştır
 */
function onRefreshed(newToken) {
    refreshSubscribers.forEach(callback => callback(newToken));
    refreshSubscribers = [];
}

/**
 * Token yenileme başarısız olduğunda
 */
function onRefreshFailed() {
    refreshSubscribers = [];
    // Kullanıcıyı login'e yönlendir
    if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
}

/**
 * Token yenileme isteği
 */
async function performTokenRefresh() {
    const refreshToken = typeof window !== 'undefined'
        ? localStorage.getItem('refreshToken')
        : null;

    if (!refreshToken) {
        throw new Error('No refresh token');
    }

    // Backend: POST /Auth/refresh-token with { token: "..." }
    const response = await fetch(`${API_BASE_URL}/Auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: refreshToken }),
    });

    if (!response.ok) {
        throw new Error('Token refresh failed');
    }

    const data = await response.json();

    if (data.isSuccessful && data.data) {
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        return data.data.accessToken;
    }

    throw new Error('Token refresh failed');
}

/**
 * API isteği gönderir (401'de otomatik token refresh)
 * @param {string} endpoint - API endpoint'i
 * @param {object} options - Fetch options
 * @param {boolean} isRetry - İstek retry mi
 * @returns {Promise<object>} API yanıtı
 */
async function request(endpoint, options = {}, isRetry = false) {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    // Token varsa header'a ekle
    if (typeof window !== 'undefined') {
        // Zustand auth store uses 'auth-storage' key with JSON structure
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
            try {
                const parsed = JSON.parse(authStorage);
                const token = parsed?.state?.accessToken;
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (e) {
                console.error('Failed to parse auth storage:', e);
            }
        }
    }

    try {
        const response = await fetch(url, config);

        // 401 Unauthorized - Token refresh dene
        if (response.status === 401 && !isRetry && typeof window !== 'undefined') {
            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    const newToken = await performTokenRefresh();
                    isRefreshing = false;
                    onRefreshed(newToken);

                    // Retry the original request with new token
                    return request(endpoint, options, true);
                } catch (refreshError) {
                    isRefreshing = false;
                    onRefreshFailed();
                    throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
                }
            } else {
                // Başka bir istek zaten refresh yapıyor, bekle
                return new Promise((resolve, reject) => {
                    refreshSubscribers.push((newToken) => {
                        config.headers.Authorization = `Bearer ${newToken}`;
                        fetch(url, config)
                            .then(res => res.json())
                            .then(data => {
                                const isSuccess = data.success ?? data.isSuccessful ?? true;
                                resolve({ success: isSuccess, data: data.data ?? data, message: data.message });
                            })
                            .catch(reject);
                    });
                });
            }
        }

        // Try to parse JSON, handle non-JSON responses gracefully
        let data;
        try {
            data = await response.json();
        } catch (parseError) {
            // If JSON parsing fails (e.g., HTML 404 page), return error structure
            if (!response.ok) {
                const error = new Error(`HTTP Error: ${response.status} ${response.statusText}`);
                error.status = response.status;
                error.data = null;
                throw error;
            }
            // For successful non-JSON responses, return empty data
            return {
                success: true,
                data: null,
                message: null
            };
        }

        // Backend formatına uyumluluk: isSuccessful veya success
        const isSuccess = data.success ?? data.isSuccessful ?? response.ok;

        if (!isSuccess) {
            // Backend hata mesajını al: errors array veya message
            const errorMessage = data.errors?.[0] || data.message || 'Bir hata oluştu';
            const error = new Error(errorMessage);
            error.status = response.status;
            error.data = data;
            throw error;
        }

        // Yanıtı normalize et
        return {
            success: true,
            data: data.data ?? data,
            message: data.message || null
        };
    } catch (error) {
        // Network hatası veya JSON parse hatası
        if (!error.status) {
            error.message = error.message || 'Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.';
            error.status = 0;
        }
        throw error;
    }
}

/**
 * GET isteği
 * @param {string} endpoint 
 * @param {object} options 
 * @returns {Promise<object>}
 */
export function get(endpoint, options = {}) {
    return request(endpoint, { ...options, method: 'GET' });
}

/**
 * POST isteği
 * @param {string} endpoint 
 * @param {object} body 
 * @param {object} options 
 * @returns {Promise<object>}
 */
export function post(endpoint, body, options = {}) {
    return request(endpoint, {
        ...options,
        method: 'POST',
        body: JSON.stringify(body),
    });
}

/**
 * PUT isteği
 * @param {string} endpoint 
 * @param {object} body 
 * @param {object} options 
 * @returns {Promise<object>}
 */
export function put(endpoint, body, options = {}) {
    return request(endpoint, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(body),
    });
}

/**
 * DELETE isteği
 * @param {string} endpoint 
 * @param {object} options 
 * @returns {Promise<object>}
 */
export function del(endpoint, options = {}) {
    return request(endpoint, { ...options, method: 'DELETE' });
}

/**
 * FormData ile POST isteği (dosya yükleme için)
 * @param {string} endpoint 
 * @param {FormData} formData 
 * @param {object} options 
 * @returns {Promise<object>}
 */
export async function postFormData(endpoint, formData, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
        method: 'POST',
        body: formData,
        ...options,
    };

    // Token varsa header'a ekle
    if (typeof window !== 'undefined') {
        // Zustand auth store uses 'auth-storage' key with JSON structure
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
            try {
                const parsed = JSON.parse(authStorage);
                const token = parsed?.state?.accessToken;
                if (token) {
                    config.headers = {
                        ...config.headers,
                        Authorization: `Bearer ${token}`,
                    };
                }
            } catch (e) {
                console.error('Failed to parse auth storage:', e);
            }
        }
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            const error = new Error(data.message || 'Bir hata oluştu');
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    } catch (error) {
        if (!error.status) {
            error.message = 'Sunucuya bağlanılamadı';
            error.status = 0;
        }
        throw error;
    }
}

export default { get, post, put, del, postFormData };
