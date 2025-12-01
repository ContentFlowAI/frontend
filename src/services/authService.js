// Конфигурация API
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000', // Твой FastAPI порт
  USE_MOCK_API: process.env.REACT_APP_USE_MOCK_API === 'true' || false, // По умолчанию false - используем реальный API
};

// Сервис для работы с аутентификацией
export const authService = {
  // Регистрация пользователя
  async register(userData) {
    if (API_CONFIG.USE_MOCK_API) {
      // Моковая логика для тестирования
      return this._mockRegister(userData);
    }
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username || userData.name,
          email: userData.email,
          password: userData.password,
          repeat_password: userData.confirmPassword || userData.password
        }),
        credentials: 'include' // Важно для получения cookies
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка регистрации');
      }
      
      const data = await response.json();
      
      // Сохраняем флаг, что нужно подтвердить email
      if (!data.confirmed) {
        localStorage.setItem('needs_email_confirmation', 'true');
        localStorage.setItem('user_email', userData.email);
      }
      
      return {
        success: true,
        data: {
          confirmed: data.confirmed,
          message: data.message,
          requiresEmailConfirmation: !data.confirmed
        }
      };
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      throw new Error(error.message || 'Ошибка сети при регистрации');
    }
  },

  // Вход пользователя
  async login(username, password) {
    if (API_CONFIG.USE_MOCK_API) {
      return this._mockLogin(username, password);
    }
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password
        }),
        credentials: 'include' // Важно для cookies
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка входа');
      }
      
      const data = await response.json();
      
      // Если не подтвержден email, сохраняем информацию
      if (!data.confirmed) {
        localStorage.setItem('needs_email_confirmation', 'true');
        localStorage.setItem('user_email', username); // username может быть email
      } else {
        // Успешный вход, токены в cookies
        localStorage.setItem('is_authenticated', 'true');
        localStorage.removeItem('needs_email_confirmation');
      }
      
      return {
        success: true,
        data: {
          confirmed: data.confirmed,
          message: data.message,
          requiresEmailConfirmation: !data.confirmed
        }
      };
    } catch (error) {
      console.error('Ошибка входа:', error);
      throw new Error(error.message || 'Ошибка сети при входе');
    }
  },

  // Отправка кода подтверждения
  async sendVerificationCode(email) {
    if (API_CONFIG.USE_MOCK_API) {
      return this._mockSendVerificationCode(email);
    }
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/send_code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email
        }),
        credentials: 'include' // Cookies с email_token
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка отправки кода');
      }
      
      const data = await response.json();
      
      return {
        success: true,
        data: {
          message: data.message
        }
      };
    } catch (error) {
      console.error('Ошибка отправки кода:', error);
      throw new Error(error.message || 'Ошибка сети при отправке кода');
    }
  },

  // Подтверждение кода
  async confirmVerificationCode(code, email) {
    if (API_CONFIG.USE_MOCK_API) {
      return this._mockConfirmVerificationCode(code, email);
    }
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/confirm_code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          email: email
        }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка подтверждения кода');
      }
      
      const data = await response.json();
      
      if (data.confirmed) {
        localStorage.setItem('is_authenticated', 'true');
        localStorage.removeItem('needs_email_confirmation');
        localStorage.removeItem('user_email');
      }
      
      return {
        success: true,
        data: {
          confirmed: data.confirmed,
          message: data.message
        }
      };
    } catch (error) {
      console.error('Ошибка подтверждения кода:', error);
      throw new Error(error.message || 'Ошибка сети при подтверждении кода');
    }
  },

  // Выход пользователя
  async logout() {
    if (API_CONFIG.USE_MOCK_API) {
      return this._mockLogout();
    }
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка выхода');
      }
      
      return {
        success: true,
        data: await response.json()
      };
    } catch (error) {
      console.error('Ошибка выхода:', error);
      throw new Error(error.message || 'Ошибка сети при выходе');
    }
  },

  // Обновление токена
  async refreshToken() {
    if (API_CONFIG.USE_MOCK_API) {
      return this._mockRefreshToken();
    }
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/refresh`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка обновления токена');
      }
      
      const data = await response.json();
      
      return {
        success: true,
        data: {
          message: data.message
        }
      };
    } catch (error) {
      console.error('Ошибка обновления токена:', error);
      throw new Error(error.message || 'Ошибка сети при обновлении токена');
    }
  },

  // Восстановление пароля (еще не реализовано в бэкенде)
  async forgotPassword(email) {
    // TODO: Реализовать, когда будет эндпоинт в бэкенде
    console.log('Восстановление пароля для:', email);
    return {
      success: true,
      data: {
        message: 'Ссылка для восстановления отправлена на email'
      }
    };
  },

  // Проверка авторизации
  async checkAuth() {
    if (API_CONFIG.USE_MOCK_API) {
      return this._mockCheckAuth();
    }
    
    // Проверяем наличие cookies и пытаемся обновить токен если нужно
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/refresh`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        return {
          success: true,
          authenticated: true
        };
      }
      
      return {
        success: false,
        authenticated: false
      };
    } catch (error) {
      return {
        success: false,
        authenticated: false,
        error: error.message
      };
    }
  },

  // ========== МОКОВЫЕ МЕТОДЫ (для тестирования без бэкенда) ==========
  
  _mockRegister(userData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Проверка паролей
        if (userData.password !== userData.confirmPassword) {
          reject({
            success: false,
            error: 'Пароли не совпадают'
          });
          return;
        }
        
        // Имитация успешной регистрации с подтверждением email
        const needsConfirmation = Math.random() > 0.5; // 50% шанс что нужно подтвердить
        
        if (needsConfirmation) {
          localStorage.setItem('needs_email_confirmation', 'true');
          localStorage.setItem('user_email', userData.email);
        } else {
          localStorage.setItem('is_authenticated', 'true');
        }
        
        resolve({
          success: true,
          data: {
            confirmed: !needsConfirmation,
            message: needsConfirmation 
              ? 'Регистрация успешна. Проверьте email для подтверждения.' 
              : 'Регистрация успешна!',
            requiresEmailConfirmation: needsConfirmation
          }
        });
      }, 800);
    });
  },

  _mockLogin(username, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === 'demo@example.com' && password === 'password123') {
          localStorage.setItem('is_authenticated', 'true');
          resolve({
            success: true,
            data: {
              confirmed: true,
              message: 'Вход выполнен успешно',
              requiresEmailConfirmation: false
            }
          });
        } else {
          reject({
            success: false,
            error: 'Неверный email или пароль'
          });
        }
      }, 600);
    });
  },

  _mockSendVerificationCode(email) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            message: 'Код подтверждения отправлен на email'
          }
        });
      }, 500);
    });
  },

  _mockConfirmVerificationCode(code) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (code.length === 6) {
          localStorage.setItem('is_authenticated', 'true');
          localStorage.removeItem('needs_email_confirmation');
          resolve({
            success: true,
            data: {
              confirmed: true,
              message: 'Email подтвержден успешно!'
            }
          });
        } else {
          resolve({
            success: false,
            data: {
              confirmed: false,
              message: 'Неверный код'
            }
          });
        }
      }, 500);
    });
  },

  _mockLogout() {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem('is_authenticated');
        localStorage.removeItem('needs_email_confirmation');
        localStorage.removeItem('user_email');
        resolve({
          success: true,
          data: {
            message: 'Выход выполнен успешно'
          }
        });
      }, 300);
    });
  },

  _mockRefreshToken() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            message: 'Токен обновлен'
          }
        });
      }, 300);
    });
  },

  _mockCheckAuth() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isAuth = localStorage.getItem('is_authenticated') === 'true';
        resolve({
          success: true,
          authenticated: isAuth
        });
      }, 200);
    });
  }
};

// Утилиты для работы с аутентификацией
export const authUtils = {
  // Проверка авторизации
  isAuthenticated() {
    if (API_CONFIG.USE_MOCK_API) {
      return localStorage.getItem('is_authenticated') === 'true';
    }
    
    // В реальном приложении проверяем через бэкенд или токен
    const hasAccessToken = document.cookie.includes('access_token');
    const isAuth = localStorage.getItem('is_authenticated') === 'true';
    return hasAccessToken || isAuth;
  },

  // Проверка необходимости подтверждения email
  needsEmailConfirmation() {
    return localStorage.getItem('needs_email_confirmation') === 'true';
  },

  // Получение email для подтверждения
  getEmailForConfirmation() {
    return localStorage.getItem('user_email');
  },

  // Очистка данных аутентификации
  clearAuth() {
    localStorage.removeItem('is_authenticated');
    localStorage.removeItem('needs_email_confirmation');
    localStorage.removeItem('user_email');
    
    // Удаляем cookies
    document.cookie = 'access_token=; Max-Age=0; path=/';
    document.cookie = 'refresh_token=; Max-Age=0; path=/';
    document.cookie = 'email_token=; Max-Age=0; path=/';
  },

  // Сохранение состояния аутентификации
  setAuth(confirmed = true) {
    if (confirmed) {
      localStorage.setItem('is_authenticated', 'true');
      localStorage.removeItem('needs_email_confirmation');
    } else {
      localStorage.setItem('needs_email_confirmation', 'true');
    }
  }
};