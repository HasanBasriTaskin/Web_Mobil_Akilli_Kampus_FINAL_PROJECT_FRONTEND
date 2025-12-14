# 🎓 SmartCampus API Dokümantasyonu

> **Base URL:** `https://your-domain.com/api/v1`  
> **API Version:** v1  
> **Son Güncelleme:** 2025-12-14

---

## 📋 İçindekiler

1. [Genel Bilgiler](#genel-bilgiler)
2. [Response Yapıları](#response-yapıları)
3. [Auth Controller](#1-auth-controller)
4. [Users Controller](#2-users-controller)
5. [Courses Controller](#3-courses-controller)
6. [Sections Controller](#4-sections-controller)
7. [Enrollments Controller](#5-enrollments-controller)
8. [Grades Controller](#6-grades-controller)
9. [Attendance Controller](#7-attendance-controller)
10. [Excuse Requests Controller](#8-excuse-requests-controller)
11. [Announcements Controller](#9-announcements-controller)
12. [Academic Calendars Controller](#10-academic-calendars-controller)
13. [Transcript Controller](#11-transcript-controller)

---

## Genel Bilgiler

### 🔐 Authentication
Tüm endpoint'ler (Auth hariç) **JWT Bearer Token** gerektirir.

```
Authorization: Bearer <access_token>
```

### 👥 Roller
| Rol | Açıklama |
|-----|----------|
| `Student` | Öğrenci |
| `Faculty` | Akademik Personel/Öğretim Üyesi |
| `Admin` | Sistem Yöneticisi |

---

## Response Yapıları

### ✅ Standart Response
Tüm API yanıtları bu yapıyı kullanır:

```json
{
  "data": { ... },
  "isSuccessful": true,
  "errors": null
}
```

| Alan | Tip | Açıklama |
|------|-----|----------|
| `data` | `T` / `null` | İşlem sonucu dönen veri |
| `isSuccessful` | `boolean` | İşlem başarılı mı? |
| `errors` | `string[]` / `null` | Hata mesajları listesi |

### ❌ Hata Response
```json
{
  "data": null,
  "isSuccessful": false,
  "errors": ["Hata mesajı 1", "Hata mesajı 2"]
}
```

### 📄 Sayfalanmış Response (PagedResponse)
Liste getiren endpoint'ler için:

```json
{
  "data": [ ... ],
  "pageNumber": 1,
  "pageSize": 10,
  "totalPages": 5,
  "totalRecords": 47,
  "hasNext": true,
  "hasPrevious": false
}
```

| Alan | Tip | Açıklama |
|------|-----|----------|
| `data` | `T[]` | Sayfa verileri |
| `pageNumber` | `int` | Mevcut sayfa numarası |
| `pageSize` | `int` | Sayfa başına kayıt |
| `totalPages` | `int` | Toplam sayfa sayısı |
| `totalRecords` | `int` | Toplam kayıt sayısı |
| `hasNext` | `boolean` | Sonraki sayfa var mı? |
| `hasPrevious` | `boolean` | Önceki sayfa var mı? |

---

## 1. Auth Controller

**Base Path:** `/api/v1/Auth`

### 1.1 Login
Kullanıcı girişi yapar.

| Method | Endpoint | Auth |
|--------|----------|------|
| `POST` | `/login` | ❌ |

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "abc123...",
    "accessTokenExpiration": "2025-12-14T16:00:00Z",
    "refreshTokenExpiration": "2025-12-21T15:00:00Z",
    "user": {
      "id": "guid-string",
      "email": "user@example.com",
      "fullName": "Ahmet Yılmaz",
      "userType": "Student",
      "role": "Student",
      "roles": ["Student"],
      "isEmailVerified": true,
      "isActive": true,
      "phoneNumber": "+905551234567",
      "profilePictureUrl": "/uploads/profiles/abc.jpg",
      "createdAt": "2025-01-01T10:00:00Z",
      "student": {
        "id": 1,
        "studentNumber": "2021000123",
        "departmentId": 1,
        "departmentName": "Bilgisayar Mühendisliği"
      },
      "faculty": null
    }
  },
  "isSuccessful": true,
  "errors": null
}
```

---

### 1.2 Register
Yeni kullanıcı kaydı oluşturur.

| Method | Endpoint | Auth |
|--------|----------|------|
| `POST` | `/register` | ❌ |

**Request Body:**
```json
{
  "userType": "Student",
  "fullName": "Ahmet Yılmaz",
  "email": "ahmet@example.com",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "departmentId": 1,
  "studentNumber": "2021000123",
  "employeeNumber": null,
  "title": null,
  "officeLocation": null
}
```

| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| `userType` | `string` | ✅ | `"Student"` veya `"Faculty"` |
| `fullName` | `string` | ✅ | Tam isim |
| `email` | `string` | ✅ | E-posta adresi |
| `password` | `string` | ✅ | Şifre |
| `confirmPassword` | `string` | ✅ | Şifre tekrarı |
| `departmentId` | `int` | ✅ | Bölüm ID |
| `studentNumber` | `string` | ⚠️ | Student için zorunlu |
| `employeeNumber` | `string` | ⚠️ | Faculty için zorunlu |
| `title` | `string` | ❌ | Unvan (Faculty) |
| `officeLocation` | `string` | ❌ | Ofis konumu (Faculty) |

**Response (201):** Başarılı kayıt mesajı

---

### 1.3 Forgot Password
Şifre sıfırlama e-postası gönderir.

| Method | Endpoint | Auth |
|--------|----------|------|
| `POST` | `/forgot-password` | ❌ |

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

---

### 1.4 Reset Password
Şifre sıfırlama işlemi.

| Method | Endpoint | Auth |
|--------|----------|------|
| `POST` | `/reset-password` | ❌ |

**Request Body:**
```json
{
  "email": "user@example.com",
  "token": "reset-token-from-email",
  "newPassword": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

---

### 1.5 Verify Email
E-posta doğrulama.

| Method | Endpoint | Auth |
|--------|----------|------|
| `POST` | `/verify-email?userId={userId}&token={token}` | ❌ |

**Query Parameters:**
| Param | Tip | Açıklama |
|-------|-----|----------|
| `userId` | `string` | Kullanıcı ID |
| `token` | `string` | Doğrulama token |

---

### 1.6 Refresh Token
Access token yenileme.

| Method | Endpoint | Auth |
|--------|----------|------|
| `POST` | `/refresh-token` | ❌ |

**Request Body:**
```json
{
  "token": "refresh-token-string"
}
```

**Response (200):**
```json
{
  "data": {
    "accessToken": "new-access-token",
    "accessTokenExpiration": "2025-12-14T17:00:00Z",
    "refreshToken": "new-refresh-token",
    "refreshTokenExpiration": "2025-12-21T16:00:00Z"
  },
  "isSuccessful": true,
  "errors": null
}
```

---

### 1.7 Revoke Token
Refresh token iptal etme.

| Method | Endpoint | Auth |
|--------|----------|------|
| `POST` | `/revoke-token` | ❌ |

**Request Body:**
```json
{
  "token": "refresh-token-string"
}
```

---

### 1.8 Logout
Çıkış yapma.

| Method | Endpoint | Auth |
|--------|----------|------|
| `POST` | `/logout` | ❌ |

**Request Body:**
```json
{
  "token": "refresh-token-string"
}
```

---

### 1.9 Change Password
Şifre değiştirme (giriş yapmış kullanıcı için).

| Method | Endpoint | Auth |
|--------|----------|------|
| `POST` | `/change-password` | ✅ |

**Request Body:**
```json
{
  "userId": "user-guid",
  "oldPassword": "CurrentPassword123!",
  "newPassword": "NewPassword123!",
  "confirmNewPassword": "NewPassword123!"
}
```

> ⚠️ `userId` sadece token'daki kullanıcının kendi ID'si olabilir.

---

## 2. Users Controller

**Base Path:** `/api/v1/Users`  
**Auth:** ✅ Tüm endpoint'ler authentication gerektirir

### 2.1 Get My Profile
Giriş yapmış kullanıcının profilini getirir.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/me` | Herkes |

**Response (200):**
```json
{
  "data": {
    "id": "guid-string",
    "email": "user@example.com",
    "fullName": "Ahmet Yılmaz",
    "userType": "Student",
    "role": "Student",
    "roles": ["Student"],
    "isEmailVerified": true,
    "isActive": true,
    "phoneNumber": "+905551234567",
    "profilePictureUrl": "/uploads/profiles/abc.jpg",
    "createdAt": "2025-01-01T10:00:00Z",
    "student": {
      "id": 1,
      "studentNumber": "2021000123",
      "departmentId": 1,
      "departmentName": "Bilgisayar Mühendisliği"
    },
    "faculty": null
  },
  "isSuccessful": true,
  "errors": null
}
```

---

### 2.2 Update My Profile
Profil güncelleme.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `PUT` | `/me` | Herkes |

**Request Body:**
```json
{
  "fullName": "Ahmet Yılmaz",
  "email": "ahmet@example.com",
  "phoneNumber": "+905551234567"
}
```

---

### 2.3 Upload Profile Picture
Profil fotoğrafı yükleme.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `POST` | `/me/profile-picture` | Herkes |

**Request:** `multipart/form-data`
| Field | Tip | Açıklama |
|-------|-----|----------|
| `file` | `IFormFile` | Resim dosyası |

---

### 2.4 Get Users (Paginated)
Tüm kullanıcıları listeler.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/` | 🔒 Admin |

**Query Parameters:**
| Param | Tip | Varsayılan | Açıklama |
|-------|-----|------------|----------|
| `page` | `int` | 1 | Sayfa numarası |
| `limit` | `int` | 10 | Sayfa başına kayıt (max: 50) |
| `role` | `string` | - | Rol ile filtrele |
| `departmentId` | `int` | - | Bölüm ile filtrele |
| `search` | `string` | - | İsim veya e-posta ara |

**Response:** PagedResponse formatında UserListDto listesi

---

### 2.5 Get User By ID
Belirli kullanıcıyı getirir.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/{id}` | Admin veya Kendi |

---

### 2.6 Update User
Kullanıcı güncelleme.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `PUT` | `/{id}` | Admin veya Kendi |

---

### 2.7 Delete User
Kullanıcı silme.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `DELETE` | `/{id}` | 🔒 Admin |

---

### 2.8 Assign Roles
Kullanıcıya rol atama.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `POST` | `/{id}/roles` | 🔒 Admin |

**Request Body:**
```json
["Student", "Faculty"]
```

---

## 3. Courses Controller

**Base Path:** `/api/v1/Courses`  
**Auth:** ✅ Tüm endpoint'ler authentication gerektirir

### 3.1 Get Courses (Paginated)
Ders listesi.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/` | Herkes |

**Query Parameters:**
| Param | Tip | Varsayılan | Açıklama |
|-------|-----|------------|----------|
| `pageNumber` | `int` | 1 | Sayfa numarası |
| `pageSize` | `int` | 10 | Sayfa başına kayıt (max: 100) |
| `search` | `string` | - | Kod, isim veya açıklamada ara |
| `departmentId` | `int` | - | Bölüm ile filtrele |
| `minCredits` | `int` | - | Minimum kredi |
| `maxCredits` | `int` | - | Maksimum kredi |
| `sortBy` | `string` | - | `"code"`, `"name"`, `"credits"` |
| `sortOrder` | `string` | - | `"asc"`, `"desc"` |

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "code": "BIL101",
      "name": "Programlamaya Giriş",
      "description": "Temel programlama kavramları",
      "credits": 4,
      "ects": 6,
      "syllabusUrl": "/files/syllabus/bil101.pdf",
      "departmentId": 1,
      "departmentName": "Bilgisayar Mühendisliği",
      "departmentCode": "BM",
      "prerequisites": ["MAT101"]
    }
  ],
  "pageNumber": 1,
  "pageSize": 10,
  "totalPages": 3,
  "totalRecords": 25,
  "hasNext": true,
  "hasPrevious": false
}
```

---

### 3.2 Get Course By ID
Belirli dersi getirir.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/{id}` | Herkes |

---

### 3.3 Get Course By Code
Ders koduna göre getirir.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/code/{code}` | Herkes |

---

### 3.4 Get Courses By Department
Bölüme göre ders listesi.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/department/{departmentId}` | Herkes |

---

### 3.5 Get Course Sections
Dersin bölümlerini (section) getirir.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/{courseId}/sections` | Herkes |

---

### 3.6 Get Section By ID
Belirli section'ı getirir.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/sections/{sectionId}` | Herkes |

---

### 3.7 Create Course
Yeni ders oluşturur.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `POST` | `/` | 🔒 Admin |

**Request Body:**
```json
{
  "code": "BIL201",
  "name": "Veri Yapıları",
  "description": "Veri yapıları ve algoritmalar",
  "credits": 4,
  "ects": 6,
  "syllabusUrl": "/files/syllabus/bil201.pdf",
  "departmentId": 1,
  "prerequisiteCodes": ["BIL101"]
}
```

---

### 3.8 Update Course
Ders güncelleme.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `PUT` | `/{id}` | 🔒 Admin |

---

### 3.9 Delete Course
Ders silme.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `DELETE` | `/{id}` | 🔒 Admin |

---

## 4. Sections Controller

**Base Path:** `/api/v1/Sections`  
**Auth:** ✅ Tüm endpoint'ler authentication gerektirir

### 4.1 Get Sections (Paginated)
Section listesi.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/` | Herkes |

**Query Parameters:**
| Param | Tip | Açıklama |
|-------|-----|----------|
| `pageNumber` | `int` | Sayfa numarası |
| `pageSize` | `int` | Sayfa başına kayıt |
| `courseId` | `int` | Ders ID |
| `semester` | `string` | Dönem (`"Fall"`, `"Spring"`, `"Summer"`) |
| `year` | `int` | Yıl |
| `instructorId` | `string` | Öğretim üyesi ID |

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "courseId": 1,
    "courseCode": "BIL101",
    "courseName": "Programlamaya Giriş",
    "sectionNumber": "01",
    "semester": "Fall",
    "year": 2025,
    "instructorId": "guid-string",
    "instructorName": "Dr. Mehmet Demir",
    "capacity": 50,
    "enrolledCount": 45,
    "scheduleJson": "[{\"day\":\"Monday\",\"startTime\":\"09:00\",\"endTime\":\"11:00\"}]",
    "classroomId": 1,
    "classroomInfo": "A-Block-101",
    "isFull": false
  },
  "isSuccessful": true,
  "errors": null
}
```

---

### 4.2 Get Section By ID
Belirli section'ı getirir.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/{id}` | Herkes |

---

### 4.3 Create Section
Yeni section oluşturur.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `POST` | `/` | 🔒 Admin |

**Request Body:**
```json
{
  "courseId": 1,
  "sectionNumber": "02",
  "semester": "Fall",
  "year": 2025,
  "instructorId": "instructor-guid",
  "capacity": 50,
  "scheduleJson": "[{\"day\":\"Tuesday\",\"startTime\":\"13:00\",\"endTime\":\"15:00\"}]",
  "classroomId": 2
}
```

---

### 4.4 Update Section
Section güncelleme.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `PUT` | `/{id}` | 🔒 Admin |

---

## 5. Enrollments Controller

**Base Path:** `/api/v1/Enrollments`  
**Auth:** ✅ Tüm endpoint'ler authentication gerektirir

### 5.1 Enroll (Ders Kaydı)
Derse kayıt olma.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `POST` | `/` | Student |

**Request Body:**
```json
{
  "sectionId": 1
}
```

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "studentId": 123,
    "studentNumber": "2021000123",
    "studentName": "Ahmet Yılmaz",
    "sectionId": 1,
    "courseCode": "BIL101",
    "courseName": "Programlamaya Giriş",
    "sectionNumber": "01",
    "status": "Enrolled",
    "enrollmentDate": "2025-09-01T10:00:00Z",
    "midtermGrade": null,
    "finalGrade": null,
    "letterGrade": null,
    "gradePoint": null
  },
  "isSuccessful": true,
  "errors": null
}
```

---

### 5.2 Drop Course (Ders Bırakma)
Dersten çekilme.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `DELETE` | `/{id}` | Student |

---

### 5.3 Get My Courses
Öğrencinin kayıtlı derslerini getirir.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/my-courses` | Student |

---

### 5.4 Get Section Enrollments
Section'a kayıtlı öğrencileri getirir.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/students/{sectionId}` | 🔒 Faculty, Admin |

---

### 5.5 Check Prerequisites
Ön koşul kontrolü.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/check-prerequisites/{courseId}/{studentId}` | Herkes |

---

### 5.6 Check Schedule Conflict
Ders çakışması kontrolü.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/check-conflict/{sectionId}/{studentId}` | Herkes |

---

### 5.7 Get My Schedule
Kişisel ders programı.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/my-schedule` | Student |

**Query Parameters:**
| Param | Tip | Açıklama |
|-------|-----|----------|
| `semester` | `string` | Dönem |
| `year` | `int` | Yıl |

---

## 6. Grades Controller

**Base Path:** `/api/v1/Grades`  
**Auth:** ✅ Tüm endpoint'ler authentication gerektirir

### 6.1 Get My Grades
Öğrencinin notlarını getirir.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/my-grades` | Student |

**Response (200):**
```json
{
  "data": [
    {
      "enrollmentId": 1,
      "studentId": 123,
      "studentNumber": "2021000123",
      "studentName": "Ahmet Yılmaz",
      "courseCode": "BIL101",
      "courseName": "Programlamaya Giriş",
      "midtermGrade": 85.50,
      "finalGrade": 90.00,
      "letterGrade": "AA",
      "gradePoint": 4.0
    }
  ],
  "isSuccessful": true,
  "errors": null
}
```

---

### 6.2 Get Section Grades
Section'daki tüm öğrenci notları.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/section/{sectionId}` | 🔒 Faculty, Admin |

---

### 6.3 Get Student Grade
Tek öğrenci notu.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/enrollment/{enrollmentId}` | Herkes |

---

### 6.4 Update Grade
Not güncelleme.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `PUT` | `/enrollment/{enrollmentId}` | 🔒 Faculty, Admin |

**Request Body:**
```json
{
  "enrollmentId": 1,
  "midtermGrade": 85.50,
  "finalGrade": 90.00
}
```

---

### 6.5 Bulk Update Grades
Toplu not güncelleme.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `PUT` | `/section/{sectionId}/bulk` | 🔒 Faculty, Admin |

**Request Body:**
```json
{
  "grades": [
    { "enrollmentId": 1, "midtermGrade": 85.50, "finalGrade": 90.00 },
    { "enrollmentId": 2, "midtermGrade": 75.00, "finalGrade": 80.00 }
  ]
}
```

---

### 6.6 Create Grade
Yeni not oluşturma.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `POST` | `/` | 🔒 Faculty, Admin |

**Request Body:**
```json
{
  "enrollmentId": 1,
  "midtermGrade": 85.50,
  "finalGrade": null
}
```

---

### 6.7 Calculate Letter Grade
Harf notu hesaplama.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `POST` | `/calculate-letter` | 🔒 Faculty, Admin |

**Request Body:**
```json
{
  "midtermGrade": 85.50,
  "finalGrade": 90.00
}
```

---

### 6.8 Get Transcript
Transkript bilgisi.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/transcript` | Student |

---

### 6.9 Get Transcript PDF
Transkript PDF indirme.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/transcript/pdf` | Student |

**Response:** `application/pdf` dosyası

---

## 7. Attendance Controller

**Base Path:** `/api/v1/Attendance`  
**Auth:** ✅ Tüm endpoint'ler authentication gerektirir

### 7.1 Create Session
Yeni yoklama oturumu oluşturur.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `POST` | `/sessions` | 🔒 Faculty, Admin |

**Request Body:**
```json
{
  "sectionId": 1,
  "date": "2025-12-14",
  "startTime": "09:00:00",
  "endTime": "10:50:00",
  "latitude": 40.12345,
  "longitude": 29.12345,
  "geofenceRadius": 15.0
}
```

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "sectionId": 1,
    "courseCode": "BIL101",
    "courseName": "Programlamaya Giriş",
    "instructorId": "guid",
    "instructorName": "Dr. Mehmet Demir",
    "date": "2025-12-14",
    "startTime": "09:00:00",
    "endTime": "10:50:00",
    "latitude": 40.12345,
    "longitude": 29.12345,
    "geofenceRadius": 15.0,
    "qrCode": "unique-qr-code-string",
    "qrCodeGeneratedAt": "2025-12-14T09:00:00Z",
    "qrCodeExpiresAt": "2025-12-14T09:05:00Z",
    "status": "Active",
    "totalStudents": 45,
    "presentCount": 0,
    "absentCount": 45
  },
  "isSuccessful": true,
  "errors": null
}
```

---

### 7.2 Check In (Yoklama Girişi)
Öğrenci yoklama girişi yapar.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `POST` | `/sessions/{sessionId}/checkin` | Student |

**Request Body:**
```json
{
  "latitude": 40.12340,
  "longitude": 29.12340,
  "accuracy": 5.0,
  "isMockLocation": false,
  "deviceInfo": "{\"browser\":\"Chrome\",\"os\":\"Android\"}",
  "qrCode": "scanned-qr-code"
}
```

---

### 7.3 Get Session
Oturum bilgisi.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/sessions/{sessionId}` | Herkes |

---

### 7.4 Get Session Records
Oturuma katılan öğrenciler.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/sessions/{sessionId}/records` | 🔒 Faculty, Admin |

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "sessionId": 1,
      "studentId": 123,
      "studentNumber": "2021000123",
      "studentName": "Ahmet Yılmaz",
      "checkInTime": "2025-12-14T09:02:30Z",
      "latitude": 40.12340,
      "longitude": 29.12340,
      "distanceFromCenter": 5.2,
      "ipAddress": "192.168.1.1",
      "isMockLocation": false,
      "velocity": null,
      "deviceInfo": "{\"browser\":\"Chrome\"}",
      "fraudScore": 0,
      "isFlagged": false,
      "flagReason": null
    }
  ],
  "isSuccessful": true,
  "errors": null
}
```

---

### 7.5 Get Student Attendance
Öğrencinin tüm yoklamaları.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/students/{studentId}` | Herkes |

---

### 7.6 Close Session
Yoklama oturumunu kapatır.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `PUT` | `/sessions/{id}/close` | 🔒 Faculty, Admin |

---

### 7.7 Get My Sessions
Öğretim üyesinin oturumları.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/sessions/my-sessions` | 🔒 Faculty, Admin |

---

### 7.8 Get Attendance Report
Section yoklama raporu.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/report/{sectionId}` | 🔒 Faculty, Admin |

---

### 7.9 Refresh QR Code
QR kodu yenileme.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/sessions/{id}/qr-code` | Herkes |

**Response (200):**
```json
{
  "data": {
    "qrCode": "new-unique-qr-code",
    "expiresAt": "2025-12-14T09:10:00Z"
  },
  "isSuccessful": true,
  "errors": null
}
```

---

### 7.10 Get My Attendance
Öğrencinin kendi yoklamaları.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/my-attendance` | Student |

---

## 8. Excuse Requests Controller

**Base Path:** `/api/v1/attendance/excuse-requests`  
**Auth:** ✅ Tüm endpoint'ler authentication gerektirir

### 8.1 Create Excuse Request
Mazeret talebi oluşturur.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `POST` | `/` | Student |

**Request Body:**
```json
{
  "sessionId": 1,
  "reason": "Sağlık problemi nedeniyle katılamadım",
  "documentUrl": "/uploads/documents/health-report.pdf"
}
```

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "studentId": 123,
    "studentNumber": "2021000123",
    "studentName": "Ahmet Yılmaz",
    "sessionId": 1,
    "sessionDate": "2025-12-14T09:00:00Z",
    "courseCode": "BIL101",
    "reason": "Sağlık problemi nedeniyle katılamadım",
    "documentUrl": "/uploads/documents/health-report.pdf",
    "status": "Pending",
    "reviewedBy": null,
    "reviewedAt": null,
    "notes": null
  },
  "isSuccessful": true,
  "errors": null
}
```

---

### 8.2 Get Excuse Requests
Mazeret taleplerini listeler.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/` | 🔒 Faculty, Admin |

---

### 8.3 Approve Excuse Request
Mazeret talebini onaylar.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `PUT` | `/{id}/approve` | 🔒 Faculty, Admin |

**Request Body:**
```json
{
  "requestId": 1,
  "status": "Approved",
  "notes": "Sağlık raporu kontrol edildi, onaylandı."
}
```

---

### 8.4 Reject Excuse Request
Mazeret talebini reddeder.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `PUT` | `/{id}/reject` | 🔒 Faculty, Admin |

**Request Body:**
```json
{
  "requestId": 1,
  "status": "Rejected",
  "notes": "Belge yetersiz."
}
```

---

## 9. Announcements Controller

**Base Path:** `/api/v1/Announcements`  
**Auth:** ✅ Tüm endpoint'ler authentication gerektirir

### 9.1 Get Announcements
Duyuru listesi.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/` | Herkes |

**Query Parameters:**
| Param | Tip | Açıklama |
|-------|-----|----------|
| `targetAudience` | `string` | Hedef kitle |
| `departmentId` | `int` | Bölüm ID |

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Yeni Dönem Başlangıcı",
      "content": "2025-2026 Güz dönemi başlamıştır...",
      "targetAudience": "All",
      "departmentId": null,
      "departmentName": null,
      "isImportant": true,
      "viewCount": 245,
      "publishedAt": "2025-09-01T08:00:00Z",
      "createdBy": "Admin",
      "createdAt": "2025-08-30T15:00:00Z"
    }
  ],
  "isSuccessful": true,
  "errors": null
}
```

---

### 9.2 Get Important Announcements
Önemli duyurular.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/important` | Herkes |

---

### 9.3 Get Announcement By ID
Belirli duyuru.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/{id}` | Herkes |

---

### 9.4 Increment View Count
Görüntülenme sayısını artırır.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `POST` | `/{id}/view` | Herkes |

---

## 10. Academic Calendars Controller

**Base Path:** `/api/v1/AcademicCalendars`  
**Auth:** ✅ Tüm endpoint'ler authentication gerektirir

### 10.1 Get Calendars
Akademik takvim.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/` | Herkes |

**Query Parameters:**
| Param | Tip | Açıklama |
|-------|-----|----------|
| `year` | `int` | Yıl |
| `semester` | `string` | Dönem |

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Ders Kayıtları Başlangıcı",
      "description": "2025-2026 Güz dönemi ders kayıtları",
      "startDate": "2025-09-01T00:00:00Z",
      "endDate": "2025-09-10T23:59:59Z",
      "eventType": "Registration",
      "semester": "Fall",
      "year": 2025
    }
  ],
  "isSuccessful": true,
  "errors": null
}
```

---

### 10.2 Get Calendars By Date Range
Tarih aralığına göre.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/date-range` | Herkes |

**Query Parameters:**
| Param | Tip | Açıklama |
|-------|-----|----------|
| `startDate` | `DateTime` | Başlangıç tarihi |
| `endDate` | `DateTime` | Bitiş tarihi |

---

### 10.3 Get Upcoming Events
Yaklaşan etkinlikler.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/upcoming` | Herkes |

**Query Parameters:**
| Param | Tip | Varsayılan | Açıklama |
|-------|-----|------------|----------|
| `days` | `int` | 30 | Kaç gün sonrasına kadar |

---

## 11. Transcript Controller

**Base Path:** `/api/v1/Transcript`  
**Auth:** ✅ Tüm endpoint'ler authentication gerektirir

### 11.1 Get Transcript
Öğrenci transkripti.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/students/{studentId}` | Herkes |

**Response (200):**
```json
{
  "data": {
    "studentId": 123,
    "studentNumber": "2021000123",
    "studentName": "Ahmet Yılmaz",
    "departmentName": "Bilgisayar Mühendisliği",
    "totalCredits": 120,
    "totalEcts": 180,
    "gpa": 3.45,
    "semesters": [
      {
        "semester": "Fall",
        "year": 2021,
        "courses": [
          {
            "courseCode": "BIL101",
            "courseName": "Programlamaya Giriş",
            "credits": 4,
            "letterGrade": "AA",
            "gradePoint": 4.0
          }
        ],
        "semesterGpa": 3.50,
        "semesterCredits": 30
      }
    ]
  },
  "isSuccessful": true,
  "errors": null
}
```

---

### 11.2 Download Transcript PDF
Transkript PDF.

| Method | Endpoint | Rol |
|--------|----------|-----|
| `GET` | `/students/{studentId}/pdf` | Herkes |

**Response:** `application/pdf` dosyası

---

## 📝 HTTP Status Kodları

| Kod | Anlamı |
|-----|--------|
| `200` | Başarılı |
| `201` | Oluşturuldu |
| `400` | Geçersiz istek |
| `401` | Yetkisiz (Authentication gerekli) |
| `403` | Erişim reddedildi (Yetki yok) |
| `404` | Bulunamadı |
| `500` | Sunucu hatası |

---

## 🔗 Frontend Entegrasyon İpuçları

### Token Yönetimi
```javascript
// Axios interceptor örneği
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Token yenileme
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      const { data } = await axios.post('/api/v1/Auth/refresh-token', { token: refreshToken });
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      error.config.headers.Authorization = `Bearer ${data.data.accessToken}`;
      return axios(error.config);
    }
    return Promise.reject(error);
  }
);
```

### Sayfalama Kullanımı
```javascript
const fetchCourses = async (page = 1, pageSize = 10, filters = {}) => {
  const params = new URLSearchParams({
    pageNumber: page,
    pageSize,
    ...filters
  });
  const { data } = await axios.get(`/api/v1/Courses?${params}`);
  return data;
};
```

---

> 📌 **Not:** Bu dokümantasyon backend controller'larından otomatik olarak oluşturulmuştur. Daha detaylı bilgi için backend kaynak kodlarını inceleyebilirsiniz.
