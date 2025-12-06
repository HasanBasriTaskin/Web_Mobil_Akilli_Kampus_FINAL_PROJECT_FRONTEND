# Akıllı Kampüs Ekosistem Yönetim Platformu - Frontend

## Proje Hakkında

Bu proje, bir üniversite kampüsünün günlük operasyonlarını dijitalleştiren ve optimize eden kapsamlı bir web uygulamasının frontend kısmıdır.

## Teknoloji Stack

- **React 18+** (Hooks kullanımı zorunlu)
- **React Router v6** (Client-side routing)
- **State Management**: Context API + useReducer
- **HTTP Client**: Axios
- **Styling**: Material-UI (@mui/material)
- **Form Handling**: React Hook Form + Yup validation
- **Build Tool**: Create React App

## Proje Yapısı

```
frontend/
├── public/          # Static dosyalar
├── src/
│   ├── assets/      # Resimler, iconlar vb.
│   ├── components/  # Reusable components
│   │   ├── Navbar.js
│   │   ├── Sidebar.js
│   │   ├── ProtectedRoute.js
│   │   ├── LoadingSpinner.js
│   │   ├── TextInput.js
│   │   └── SelectInput.js
│   ├── context/     # Context providers
│   │   ├── AuthContext.js
│   │   └── ToastContext.js
│   ├── pages/       # Page components
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── ForgotPassword.js
│   │   ├── EmailVerification.js
│   │   ├── ResetPassword.js
│   │   ├── Dashboard.js
│   │   ├── Profile.js
│   │   └── NotFound.js
│   ├── services/    # API services
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── userService.js
│   ├── utils/       # Helper functions
│   │   └── constants.js
│   ├── App.js       # Main app component
│   └── index.js     # Entry point
├── .env.example     # Environment variables example
├── package.json
└── README.md
```

## Kurulum

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **Environment variables ayarlayın:**
   `.env.example` dosyasını `.env` olarak kopyalayın ve gerekli değerleri doldurun:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:5000/api/v1
   REACT_APP_APP_NAME=Akıllı Kampüs Platformu
   ```

3. **Uygulamayı çalıştırın:**
   ```bash
   npm start
   ```
   Uygulama `http://localhost:3000` adresinde açılacaktır.

## Özellikler (Part 1)

### Authentication & User Management

- ✅ Kullanıcı kaydı (Öğrenci/Öğretim Üyesi)
- ✅ Email doğrulama sistemi
- ✅ JWT tabanlı login/logout
- ✅ Refresh token mekanizması
- ✅ Şifre sıfırlama (Forgot Password)
- ✅ Profil yönetimi (CRUD)
- ✅ Profil fotoğrafı yükleme

### Sayfalar

- **Login** (`/login`) - Kullanıcı girişi
- **Register** (`/register`) - Kullanıcı kaydı
- **Forgot Password** (`/forgot-password`) - Şifre sıfırlama isteği
- **Email Verification** (`/verify-email/:token`) - Email doğrulama
- **Reset Password** (`/reset-password/:token`) - Şifre sıfırlama
- **Dashboard** (`/dashboard`) - Ana sayfa (role-based)
- **Profile** (`/profile`) - Kullanıcı profili

### Components

- **Navbar** - Üst navigasyon menüsü
- **Sidebar** - Yan menü (role-based)
- **ProtectedRoute** - Route guard (authentication kontrolü)
- **LoadingSpinner** - Yükleme göstergesi
- **Toast Notifications** - Bildirim sistemi
- **Form Inputs** - Reusable form bileşenleri

## API Entegrasyonu

Backend API ile iletişim için `src/services/` klasöründeki servisler kullanılmaktadır:

- `api.js` - Axios instance ve interceptors
- `authService.js` - Authentication işlemleri
- `userService.js` - Kullanıcı işlemleri

## Environment Variables

| Variable | Açıklama | Varsayılan |
|----------|----------|------------|
| `REACT_APP_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api/v1` |
| `REACT_APP_APP_NAME` | Uygulama adı | `Akıllı Kampüs Platformu` |

## Scripts

- `npm start` - Development server başlatır
- `npm build` - Production build oluşturur
- `npm test` - Testleri çalıştırır

## Notlar

- Backend API'nin çalışıyor olması gerekmektedir
- Token yönetimi localStorage'da yapılmaktadır
- Auto token refresh özelliği mevcuttur
- Responsive design ile mobil uyumludur

## Geliştirme

### Part 1 (Mevcut)
- Authentication & User Management ✅

### Part 2 (Sonraki)
- Academic Management
- GPS-Based Attendance System

### Part 3 (Sonraki)
- Meal Reservation System
- Event Management
- Course Scheduling

### Part 4 (Final)
- Analytics & Reporting
- Notification System
- Final Integration

## Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

