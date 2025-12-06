const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory storage (gerçek uygulamada database kullanılır)
const users = [];
let userIdCounter = 1;

// Helper function to generate JWT-like tokens
const generateToken = () => {
  return 'mock_token_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Helper function to generate user object
const generateUser = (data) => {
  return {
    id: userIdCounter++,
    name: data.name,
    email: data.email,
    role: data.userType === 'student' ? 'student' : 'faculty',
    studentNumber: data.studentNumber || null,
    departmentId: data.departmentId,
    isEmailVerified: false,
    createdAt: new Date().toISOString(),
  };
};

// Routes

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mock API Server is running' });
});

// Register
app.post('/api/v1/auth/register', (req, res) => {
  try {
    const { name, email, password, userType, studentNumber, departmentId } = req.body;

    // Validation
    if (!name || !email || !password || !userType || !departmentId) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Tüm alanlar zorunludur',
        },
      });
    }

    // Check if user already exists
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Bu email adresi zaten kullanılıyor',
        },
      });
    }

    // Create user
    const user = generateUser({ name, email, userType, studentNumber, departmentId });
    users.push({
      ...user,
      password, // Gerçek uygulamada hash'lenmeli
    });

    // Generate tokens
    const accessToken = generateToken();
    const refreshToken = generateToken();

    res.status(201).json({
      success: true,
      data: {
        message: 'Kayıt başarılı! Lütfen email adresinizi doğrulayın.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          studentNumber: user.studentNumber,
          departmentId: user.departmentId,
          isEmailVerified: user.isEmailVerified,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Kayıt sırasında bir hata oluştu',
      },
    });
  }
});

// Login
app.post('/api/v1/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Email ve şifre zorunludur',
        },
      });
    }

    // Find user
    const userData = users.find((u) => u.email === email);
    if (!userData || userData.password !== password) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Email veya şifre hatalı',
        },
      });
    }

    // Generate tokens
    const accessToken = generateToken();
    const refreshToken = generateToken();

    const user = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      studentNumber: userData.studentNumber,
      departmentId: userData.departmentId,
      isEmailVerified: userData.isEmailVerified,
    };

    res.json({
      success: true,
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Giriş sırasında bir hata oluştu',
      },
    });
  }
});

// Refresh Token
app.post('/api/v1/auth/refresh', (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Refresh token gerekli',
        },
      });
    }

    // Generate new access token
    const accessToken = generateToken();

    res.json({
      success: true,
      data: {
        accessToken,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Token yenileme başarısız',
      },
    });
  }
});

// Logout
app.post('/api/v1/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Çıkış başarılı',
  });
});

// Get Current User
app.get('/api/v1/users/me', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Token gerekli',
        },
      });
    }

    // Mock: İlk kullanıcıyı döndür (gerçek uygulamada token'dan user bilgisi alınır)
    const user = users[0];
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Kullanıcı bulunamadı',
        },
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentNumber: user.studentNumber,
        departmentId: user.departmentId,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Kullanıcı bilgileri alınamadı',
      },
    });
  }
});

// Update Profile
app.put('/api/v1/users/me', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Token gerekli',
        },
      });
    }

    // Mock: İlk kullanıcıyı güncelle
    if (users.length > 0) {
      users[0] = { ...users[0], ...req.body };
      res.json({
        success: true,
        data: {
          id: users[0].id,
          name: users[0].name,
          email: users[0].email,
          role: users[0].role,
          studentNumber: users[0].studentNumber,
          departmentId: users[0].departmentId,
          isEmailVerified: users[0].isEmailVerified,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        error: {
          message: 'Kullanıcı bulunamadı',
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Profil güncellenemedi',
      },
    });
  }
});

// Email Verification
app.post('/api/v1/auth/verify-email', (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Token gerekli',
        },
      });
    }

    // Mock: İlk kullanıcının email'ini doğrula
    if (users.length > 0) {
      users[0].isEmailVerified = true;
      res.json({
        success: true,
        message: 'Email başarıyla doğrulandı',
      });
    } else {
      res.status(404).json({
        success: false,
        error: {
          message: 'Kullanıcı bulunamadı',
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Email doğrulama başarısız',
      },
    });
  }
});

// Forgot Password
app.post('/api/v1/auth/forgot-password', (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Email gerekli',
        },
      });
    }

    // Mock: Her zaman başarılı döndür
    res.json({
      success: true,
      message: 'Şifre sıfırlama linki email adresinize gönderildi',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Şifre sıfırlama isteği başarısız',
      },
    });
  }
});

// Reset Password
app.post('/api/v1/auth/reset-password', (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Token ve şifre gerekli',
        },
      });
    }

    // Mock: İlk kullanıcının şifresini güncelle
    if (users.length > 0) {
      users[0].password = password;
      res.json({
        success: true,
        message: 'Şifre başarıyla sıfırlandı',
      });
    } else {
      res.status(404).json({
        success: false,
        error: {
          message: 'Kullanıcı bulunamadı',
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Şifre sıfırlama başarısız',
      },
    });
  }
});

// Upload Profile Picture (mock - sadece başarılı response döner)
app.post('/api/v1/users/me/profile-picture', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Token gerekli',
        },
      });
    }

    res.json({
      success: true,
      data: {
        profilePictureUrl: 'https://via.placeholder.com/150',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Profil fotoğrafı yüklenemedi',
      },
    });
  }
});

// Change Password
app.put('/api/v1/users/me/password', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const { currentPassword, newPassword } = req.body;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Token gerekli',
        },
      });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Mevcut şifre ve yeni şifre gerekli',
        },
      });
    }

    // Mock: İlk kullanıcının şifresini kontrol et ve güncelle
    if (users.length > 0) {
      if (users[0].password !== currentPassword) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Mevcut şifre hatalı',
          },
        });
      }

      users[0].password = newPassword;
      res.json({
        success: true,
        message: 'Şifre başarıyla değiştirildi',
      });
    } else {
      res.status(404).json({
        success: false,
        error: {
          message: 'Kullanıcı bulunamadı',
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Şifre değiştirme başarısız',
      },
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mock API Server is running on http://localhost:${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api/v1`);
  console.log(`\n✨ Test için örnek kullanıcı oluşturabilirsiniz!`);
});

