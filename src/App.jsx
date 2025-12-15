import React, { useState, useEffect } from 'react';
import AuthPage from './pages/Auth/AuthPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import CreateBusinessPage from './pages/Business/CreateBusinessPage';
// import CreatePostPage from './pages/CreatePost/CreatePostPage';
// import ContentPlanPage from './pages/ContentPlan/ContentPlanPage';
// import TelegramAnalysisPage from './pages/TelegramAnalysis/TelegramAnalysisPage';
// import PricingPage from './pages/Pricing/PricingPage';
// import SettingsPage from './pages/Settings/SettingsPage';
import RecoveryPasswordPage from './pages/RecoveryPassword/RecoveryPasswordPage';
import EmailConfirmationPage from './pages/Auth/EmailConfirmationPage';
import Header from './components/Header/Header';
import './App.css';

// Сервис для работы с localStorage
const storage = {
  // ========== АУТЕНТИФИКАЦИЯ ==========
  setAuthData(data) {
    localStorage.setItem('auth_token', data.token || 'mock_token');
    localStorage.setItem('user_data', JSON.stringify(data.user));
  },

  getAuthData() {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    return {
      token,
      user: userData ? JSON.parse(userData) : null
    };
  },

  clearAuthData() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  },

  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  },

  // ========== EMAIL ПОДТВЕРЖДЕНИЕ ==========
  setEmailConfirmationData(email) {
    localStorage.setItem('pending_email', email);
    localStorage.setItem('needs_email_confirmation', 'true');
  },

  getEmailConfirmationData() {
    return {
      email: localStorage.getItem('pending_email'),
      needsConfirmation: localStorage.getItem('needs_email_confirmation') === 'true'
    };
  },

  clearEmailConfirmationData() {
    localStorage.removeItem('pending_email');
    localStorage.removeItem('needs_email_confirmation');
  },

  // ========== БИЗНЕСЫ ==========
  // Сохранение бизнесов привязанных к пользователю
  saveBusinessesForUser(userId, businesses) {
    localStorage.setItem(`businesses_${userId}`, JSON.stringify(businesses));
  },

  getBusinessesForUser(userId) {
    const businesses = localStorage.getItem(`businesses_${userId}`);
    return businesses ? JSON.parse(businesses) : [];
  },

  addBusinessForUser(userId, business) {
    const existingBusinesses = this.getBusinessesForUser(userId);
    const updatedBusinesses = [...existingBusinesses, business];
    this.saveBusinessesForUser(userId, updatedBusinesses);
    return updatedBusinesses;
  },

  // ========== ПОЛЬЗОВАТЕЛИ ==========
  // Сохранение зарегистрированных пользователей
  saveRegisteredUser(userData) {
    const users = this.getRegisteredUsers();
    const existingIndex = users.findIndex(u => u.email === userData.email);
    
    if (existingIndex >= 0) {
      users[existingIndex] = userData;
    } else {
      users.push(userData);
    }
    
    localStorage.setItem('registered_users', JSON.stringify(users));
    return userData;
  },

  getRegisteredUsers() {
    const users = localStorage.getItem('registered_users');
    return users ? JSON.parse(users) : [];
  },

  findUserByEmail(email) {
    const users = this.getRegisteredUsers();
    return users.find(u => u.email === email);
  },

  updateUserPassword(email, newPassword) {
    const users = this.getRegisteredUsers();
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex >= 0) {
      users[userIndex].password = newPassword;
      localStorage.setItem('registered_users', JSON.stringify(users));
      return true;
    }
    return false;
  },

  removeDefaultBusinesses(userId) {
    const businesses = this.getBusinessesForUser(userId);
    const filteredBusinesses = businesses.filter(business => 
      !business.id.includes('default') && 
      !business.id.includes('demo')
    );
    this.saveBusinessesForUser(userId, filteredBusinesses);
    return filteredBusinesses;
  }
};

export default function App() {
  // Состояния для аутентификации
  const [isAuthenticated, setIsAuthenticated] = useState(storage.isAuthenticated());
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(
    storage.getEmailConfirmationData().needsConfirmation
  );
  
  // Состояния для навигации
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [showRecovery, setShowRecovery] = useState(false);
  const [showCreateBusiness, setShowCreateBusiness] = useState(false);
  
  // Состояния приложения
  const [user, setUser] = useState(storage.getAuthData().user || null);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState('');
  
  // Состояния для UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Загрузка бизнесов пользователя при смене пользователя
  useEffect(() => {
    if (user?.id) {
      const cleanedBusinesses = storage.removeDefaultBusinesses(user.id);
      setBusinesses(cleanedBusinesses);
      
      if (cleanedBusinesses.length > 0) {
        const savedSelectedBusinessId = localStorage.getItem(`selected_business_${user.id}`);
        const businessToSelect = savedSelectedBusinessId 
          ? cleanedBusinesses.find(b => b.id === savedSelectedBusinessId)
          : cleanedBusinesses[0];
        
        if (businessToSelect) {
          setSelectedBusiness(businessToSelect.id);
        }
      }
    } else {
      setBusinesses([]);
      setSelectedBusiness('');
    }
  }, [user]);

  // Инициализация при загрузке
  useEffect(() => {
    const checkAuth = () => {
      if (storage.isAuthenticated()) {
        const authData = storage.getAuthData();
        setUser(authData.user);
        setIsAuthenticated(true);
      }
    };
    
    checkAuth();
  }, []);

  // ========== ОБРАБОТЧИКИ АУТЕНТИФИКАЦИИ ==========

  // Вход с проверкой зарегистрированных пользователей
  const handleLogin = async (email, password) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Проверяем в зарегистрированных пользователях
      const registeredUser = storage.findUserByEmail(email);
      
      if (registeredUser) {
        if (registeredUser.password === password) {
          if (!registeredUser.emailConfirmed && email === 'unconfirmed@example.com') {
            // Пользователь без подтвержденного email
            storage.setEmailConfirmationData(email);
            setNeedsEmailConfirmation(true);
            setSuccessMessage('Требуется подтверждение email');
          } else {
            // Успешный вход
            storage.setAuthData({
              token: `mock_jwt_token_${Date.now()}`,
              user: {
                id: registeredUser.id,
                email: registeredUser.email,
                name: registeredUser.name,
                username: registeredUser.username,
                emailConfirmed: registeredUser.emailConfirmed || true
              }
            });
            
            setUser({
              id: registeredUser.id,
              email: registeredUser.email,
              name: registeredUser.name,
              username: registeredUser.username,
              emailConfirmed: registeredUser.emailConfirmed || true
            });
            
            setIsAuthenticated(true);
            setSuccessMessage('Вход выполнен успешно!');
          }
        } else {
          throw new Error('Неверный пароль');
        }
      } else if (email === 'demo@example.com' && password === 'Demo123!@#') {
        // Демо пользователь - создаем без дефолтных бизнесов
        const demoUser = {
          id: `demo_user_${Date.now()}`,
          email: 'demo@example.com',
          name: 'Демо Пользователь',
          username: 'demo',
          emailConfirmed: true
        };
        
        // Сохраняем демо пользователя
        storage.saveRegisteredUser({
          ...demoUser,
          password: 'Demo123!@#'
        });
        
        // Очищаем дефолтные бизнесы для демо пользователя
        storage.saveBusinessesForUser(demoUser.id, []);
        
        storage.setAuthData({
          token: 'mock_jwt_token_demo',
          user: demoUser
        });
        
        setUser(demoUser);
        setIsAuthenticated(true);
        setSuccessMessage('Вход выполнен успешно! Добро пожаловать в демо-режим!');
      } else {
        throw new Error('Пользователь с таким email не найден');
      }
    } catch (err) {
      setError(err.message || 'Ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  // Регистрация с сохранением пользователя
  const handleRegister = async (userData) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Проверка существования пользователя
      const existingUser = storage.findUserByEmail(userData.email);
      if (existingUser) {
        throw new Error('Пользователь с таким email уже существует');
      }
      
      if (userData.password.length < 6) {
        throw new Error('Пароль должен содержать минимум 6 символов');
      }
      
      if (userData.password !== userData.confirmPassword) {
        throw new Error('Пароли не совпадают');
      }
      
      // Создаем нового пользователя
      const newUser = {
        id: `user_${Date.now()}`,
        email: userData.email,
        name: userData.name,
        username: userData.username,
        password: userData.password,
        emailConfirmed: false,
        createdAt: new Date().toISOString()
      };
      
      // Сохраняем пользователя
      storage.saveRegisteredUser(newUser);
      
      // Создаем пустой список бизнесов для нового пользователя
      storage.saveBusinessesForUser(newUser.id, []);
      
      // Симуляция 50% шанса, что нужно подтвердить email
      const needsConfirmation = Math.random() > 0.5;
      
      if (needsConfirmation) {
        storage.setEmailConfirmationData(userData.email);
        setNeedsEmailConfirmation(true);
        setSuccessMessage('Регистрация успешна! Проверьте email для подтверждения.');
      } else {
        // Автоматически подтверждаем email
        newUser.emailConfirmed = true;
        storage.saveRegisteredUser(newUser);
        
        storage.setAuthData({
          token: `mock_jwt_token_${Date.now()}`,
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            username: newUser.username,
            emailConfirmed: true
          }
        });
        
        setUser({
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          username: newUser.username,
          emailConfirmed: true
        });
        
        setIsAuthenticated(true);
        setSuccessMessage('Регистрация успешна! Вы вошли в систему.');
      }
      
      return true;
    } catch (err) {
      setError(err.message || 'Ошибка при регистрации');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Восстановление пароля с сохранением
  const handleForgotPassword = async (email) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const user = storage.findUserByEmail(email);
      if (!user) {
        throw new Error('Пользователь с таким email не найден');
      }
      
      setSuccessMessage('Ссылка для восстановления пароля отправлена на email');
      return { success: true };
    } catch (err) {
      setError(err.message || 'Ошибка при восстановлении пароля');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Подтверждение кода и обновление emailConfirmed
  const handleConfirmVerificationCode = async (code, email) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (code === '000000' || code.length === 6) {
        const registeredUser = storage.findUserByEmail(email);
        
        if (!registeredUser) {
          throw new Error('Пользователь не найден');
        }
        
        // Обновляем статус подтверждения
        registeredUser.emailConfirmed = true;
        storage.saveRegisteredUser(registeredUser);
        
        storage.clearEmailConfirmationData();
        
        // Создаем пустой список бизнесов для подтвержденного пользователя
        storage.saveBusinessesForUser(registeredUser.id, []);
        
        // Входим в систему
        storage.setAuthData({
          token: `mock_jwt_token_confirmed_${Date.now()}`,
          user: {
            id: registeredUser.id,
            email: registeredUser.email,
            name: registeredUser.name,
            username: registeredUser.username,
            emailConfirmed: true
          }
        });
        
        setUser({
          id: registeredUser.id,
          email: registeredUser.email,
          name: registeredUser.name,
          username: registeredUser.username,
          emailConfirmed: true
        });
        
        setIsAuthenticated(true);
        setNeedsEmailConfirmation(false);
        setSuccessMessage('Email подтвержден успешно!');
        
        return { success: true, confirmed: true };
      } else {
        setError('Неверный код подтверждения');
        return { success: false, confirmed: false };
      }
    } catch (err) {
      setError(err.message || 'Ошибка при подтверждении кода');
      return { success: false, confirmed: false };
    } finally {
      setLoading(false);
    }
  };

  // Создание бизнеса
  const handleCreateBusiness = async (businessData) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!user?.id) {
        throw new Error('Пользователь не авторизован');
      }
      
      const newBusiness = {
        id: `business_${Date.now()}`,
        userId: user.id,
        name: businessData.name,
        logo: businessData.logoPreview || '🏢',
        description: businessData.description,
        industry: businessData.industry,
        audienceReach: businessData.audienceReach || '',
        region: businessData.region || '',
        communicationStyle: businessData.communicationStyle,
        createdAt: new Date().toISOString()
      };
      
      // Сохраняем бизнес для пользователя
      const updatedBusinesses = storage.addBusinessForUser(user.id, newBusiness);
      setBusinesses(updatedBusinesses);
      setSelectedBusiness(newBusiness.id);
      
      // Сохраняем выбор в localStorage
      localStorage.setItem(`selected_business_${user.id}`, newBusiness.id);
      
      setShowCreateBusiness(false);
      setCurrentPage('dashboard');
      
      setSuccessMessage('Бизнес успешно создан!');
      
      return { success: true, business: newBusiness };
    } catch (err) {
      setError(err.message || 'Ошибка при создании бизнеса');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Выход
  const handleLogout = () => {
    storage.clearAuthData();
    storage.clearEmailConfirmationData();
    setIsAuthenticated(false);
    setNeedsEmailConfirmation(false);
    setUser(null);
    setBusinesses([]);
    setSelectedBusiness('');
    setCurrentPage('dashboard');
    setSuccessMessage('Выход выполнен успешно');
    
    setTimeout(() => {
      setSuccessMessage('');
    }, 2000);
  };

  // ========== ОТОБРАЖЕНИЕ СТРАНИЦ ==========

  // Если нужно подтверждение email
  if (needsEmailConfirmation) {
    const emailData = storage.getEmailConfirmationData();
    return (
      <EmailConfirmationPage
        email={emailData.email || ''}
        onBack={() => {
          storage.clearEmailConfirmationData();
          setNeedsEmailConfirmation(false);
          setAuthMode('login');
        }}
        onSendCode={async () => {
          setLoading(true);
          try {
            await new Promise(resolve => setTimeout(resolve, 800));
            setSuccessMessage('Код подтверждения отправлен на email');
            return { success: true };
          } catch {
            return { success: false };
          } finally {
            setLoading(false);
          }
        }}
        onConfirmCode={handleConfirmVerificationCode}
        loading={loading}
        error={error}
        successMessage={successMessage}
        onClearMessages={() => {
          setError('');
          setSuccessMessage('');
        }}
      />
    );
  }

  // Если не авторизован
  if (!isAuthenticated) {
    if (showRecovery) {
      return (
        <RecoveryPasswordPage
          onBack={() => setShowRecovery(false)}
          onForgotPassword={handleForgotPassword}
          loading={loading}
          error={error}
          successMessage={successMessage}
          onClearMessages={() => {
            setError('');
            setSuccessMessage('');
          }}
        />
      );
    }
    
    return (
      <AuthPage
        onLogin={handleLogin}
        onRegister={handleRegister}
        onForgotPassword={() => setShowRecovery(true)}
        mode={authMode}
        onModeChange={setAuthMode}
        loading={loading}
        error={error}
        successMessage={successMessage}
        onClearMessages={() => {
          setError('');
          setSuccessMessage('');
        }}
      />
    );
  }

  // Если открыта страница создания бизнеса
  if (showCreateBusiness) {
    return (
      <CreateBusinessPage
        onBack={() => {
          setShowCreateBusiness(false);
          setCurrentPage('dashboard');
        }}
        onCreateBusiness={handleCreateBusiness}
        loading={loading}
        error={error}
        successMessage={successMessage}
        onClearMessages={() => {
          setError('');
          setSuccessMessage('');
        }}
      />
    );
  }

  // Главное приложение (авторизован)
  return (
    <div className="app">
      {/* Глобальные уведомления */}
      {error && (
        <div className="global-notification error">
          <span>{error}</span>
          <button onClick={() => setError('')} className="notification-close">×</button>
        </div>
      )}
      
      {successMessage && (
        <div className="global-notification success">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage('')} className="notification-close">×</button>
        </div>
      )}
      
      <Header
        currentPage={currentPage}
        onNavigate={(page) => {
          if (page === 'add-business') {
            setShowCreateBusiness(true);
          } else {
            setCurrentPage(page);
          }
        }}
        businesses={businesses}
        selectedBusiness={selectedBusiness}
        onSelectBusiness={(businessId) => {
          setSelectedBusiness(businessId);
          // Сохраняем выбор в localStorage
          if (user?.id) {
            localStorage.setItem(`selected_business_${user.id}`, businessId);
          }
        }}
        onLogout={handleLogout}
        user={user}
      />
      
      <main className="main-content">
        {currentPage === 'dashboard' && (
          <DashboardPage
            onNavigate={setCurrentPage}
            user={user}
          />
        )}
        {/* Другие страницы будут добавлены позже */}
        {currentPage === 'pricing' && (
          <div className="container">
            <h1>Страница тарифов (в разработке)</h1>
          </div>
        )}
        {currentPage === 'settings' && (
          <div className="container">
            <h1>Настройки (в разработке)</h1>
          </div>
        )}
      </main>
    </div>
  );
}