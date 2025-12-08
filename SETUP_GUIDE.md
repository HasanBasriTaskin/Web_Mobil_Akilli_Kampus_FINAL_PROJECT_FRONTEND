# Frontend ve Backend Bağlantı Rehberi

Bu rehber, ayrı repo'larda bulunan frontend ve backend projelerinizi nasıl çalıştırıp bağlayacağınızı açıklar.

## 📋 Ön Gereksinimler

- Node.js ve npm yüklü olmalı
- Backend projeniz hazır ve çalışır durumda olmalı
- Her iki proje için ayrı terminal penceresi açabilmelisiniz

## 🚀 Adım Adım Kurulum

### 1. Backend Projesini Çalıştırma

Backend projenizin bulunduğu klasöre gidin ve çalıştırın:

```bash
# Backend klasörüne gidin (örnek)
cd /path/to/backend/project

# Bağımlılıkları yükleyin (ilk kez çalıştırıyorsanız)
npm install

# Backend'i başlatın
npm start
# veya
node server.js
# veya backend'inizin kullandığı komut
```

**Önemli:** Backend'in hangi portta çalıştığını not edin (örn: `http://localhost:5000` veya `http://localhost:8000`)

### 2. Frontend Projesini Yapılandırma

Frontend projenizin klasörüne gidin:

```bash
cd /Users/nese/Desktop/frontend/Web_Mobil_Akilli_Kampus_FINAL_PROJECT_FRONTEND
```

#### 2.1. Environment Variables Ayarlama

Proje kök dizininde `.env` dosyası oluşturun (yoksa):

```bash
# .env dosyası oluşturun
touch .env
```

`.env` dosyasına şu içeriği ekleyin (backend'inizin portuna göre düzenleyin):

```env
# Backend API Base URL
# Backend'inizin çalıştığı portu buraya yazın
REACT_APP_API_BASE_URL=http://localhost:5000/api/v1

# Uygulama Adı
REACT_APP_APP_NAME=Akıllı Kampüs Platformu
```

**Port Değiştirme:**
- Backend 5000 portunda çalışıyorsa: `REACT_APP_API_BASE_URL=http://localhost:5000/api/v1`
- Backend 8000 portunda çalışıyorsa: `REACT_APP_API_BASE_URL=http://localhost:8000/api/v1`
- Backend farklı bir portta çalışıyorsa: `REACT_APP_API_BASE_URL=http://localhost:PORT/api/v1`

#### 2.2. Bağımlılıkları Yükleme

```bash
npm install
```

### 3. Frontend'i Çalıştırma

Yeni bir terminal penceresi açın ve frontend'i başlatın:

```bash
cd /Users/nese/Desktop/frontend/Web_Mobil_Akilli_Kampus_FINAL_PROJECT_FRONTEND
npm start
```

Frontend genellikle `http://localhost:3000` adresinde açılacaktır.

## 🔧 CORS (Cross-Origin Resource Sharing) Ayarları

Backend'inizde CORS ayarlarının yapılmış olması gerekiyor. Backend'inizde şu ayarların olması gerekir:

### Express.js Örneği:

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL'i
  credentials: true
}));
```

### Fastify Örneği:

```javascript
await fastify.register(require('@fastify/cors'), {
  origin: 'http://localhost:3000',
  credentials: true
});
```

## 📝 Çalışma Senaryosu

1. **Terminal 1 - Backend:**
   ```bash
   cd /path/to/backend
   npm start
   # Backend http://localhost:5000 adresinde çalışıyor
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   cd /Users/nese/Desktop/frontend/Web_Mobil_Akilli_Kampus_FINAL_PROJECT_FRONTEND
   npm start
   # Frontend http://localhost:3000 adresinde açılıyor
   ```

3. Tarayıcıda `http://localhost:3000` adresine gidin ve uygulamayı kullanın.

## ✅ Bağlantıyı Test Etme

1. Backend'in çalıştığını kontrol edin:
   ```bash
   curl http://localhost:5000/api/v1/health
   # veya backend'inizin health check endpoint'i
   ```

2. Frontend'den API çağrısı yapın (örneğin login sayfasından).

3. Browser Developer Tools (F12) > Network sekmesinden API isteklerini kontrol edin.

## 🐛 Sorun Giderme

### Backend'e Bağlanılamıyor

1. Backend'in çalıştığından emin olun
2. `.env` dosyasındaki `REACT_APP_API_BASE_URL` değerini kontrol edin
3. Backend'in portunu kontrol edin
4. Firewall ayarlarını kontrol edin

### CORS Hatası

1. Backend'de CORS ayarlarının yapıldığından emin olun
2. Frontend URL'inin (`http://localhost:3000`) backend CORS ayarlarında olduğundan emin olun

### Environment Variable Değişiklikleri Algılanmıyor

1. `.env` dosyasını değiştirdikten sonra frontend'i yeniden başlatın:
   ```bash
   # Ctrl+C ile durdurun
   npm start
   ```

## 📚 Ek Notlar

- Frontend varsayılan olarak `http://localhost:3000` portunda çalışır
- Backend portu projenize göre değişebilir (5000, 8000, vb.)
- Production'da environment variable'ları deployment platformunuzda ayarlamanız gerekir
- `.env` dosyası git'e commit edilmemelidir (`.gitignore`'da olmalı)

## 🔗 API Endpoint Yapısı

Frontend, backend API'lerini şu base URL üzerinden çağırır:
- Base URL: `REACT_APP_API_BASE_URL` (varsayılan: `http://localhost:5000/api/v1`)
- Örnek endpoint: `http://localhost:5000/api/v1/auth/login`

API endpoint'leri `src/utils/constants.js` dosyasında tanımlıdır.

