import React, { useState, useEffect } from 'react';
import AuthPage from './pages/Auth/AuthPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
// import CreatePostPage from './pages/CreatePost/CreatePostPage';
// import ContentPlanPage from './pages/ContentPlan/ContentPlanPage';
// import TelegramAnalysisPage from './pages/TelegramAnalysis/TelegramAnalysisPage';
// import PricingPage from './pages/Pricing/PricingPage';
// import SettingsPage from './pages/Settings/SettingsPage';
import RecoveryPasswordPage from './pages/RecoveryPassword/RecoveryPasswordPage';
import EmailConfirmationPage from './pages/Auth/EmailConfirmationPage';
import Header from './components/Header/Header';
// import BusinessProfileModal from './components/BusinessProfileModal/BusinessProfileModal';
import './App.css';

// Моковые данные
const mockBusinesses = [
  { id: '1', name: 'TechCorp', logo: '🚀', description: 'Technology solutions for modern businesses', industry: 'Technology' },
  { id: '2', name: 'MarketPlace', logo: '🛍️', description: 'E-commerce platform for artisans', industry: 'E-commerce' },
  { id: '3', name: 'CreativeStudio', logo: '🎨', description: 'Design and creative services', industry: 'Creative' },
];

// Сервис для работы с localStorage (можно вынести в отдельный файл позже)
const storage = {
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

  // Для подтверждения email
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
  
  // Состояния приложения
  const [businesses, setBusinesses] = useState(mockBusinesses);
  const [selectedBusiness, setSelectedBusiness] = useState(mockBusinesses[0]?.id || '');
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  
  // Состояния для UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Пользователь
  const [user, setUser] = useState(storage.getAuthData().user || null);

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

  // Вход (моковая версия)
  const handleLogin = async (email, password) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      // Моковая задержка
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Моковая проверка
      if (email === 'demo@example.com' && password === 'password123') {
        const mockUser = {
          id: '1',
          email: 'demo@example.com',
          name: 'Демо Пользователь',
          role: 'admin',
          businesses: ['1', '2', '3']
        };
        
        storage.setAuthData({
          token: 'mock_jwt_token_demo',
          user: mockUser
        });
        
        setUser(mockUser);
        setIsAuthenticated(true);
        setSuccessMessage('Вход выполнен успешно!');
      } else if (email === 'unconfirmed@example.com') {
        // Симуляция пользователя, которому нужно подтвердить email
        storage.setEmailConfirmationData(email);
        setNeedsEmailConfirmation(true);
        setSuccessMessage('Требуется подтверждение email');
      } else {
        throw new Error('Неверный email или пароль');
      }
    } catch (err) {
      setError(err.message || 'Ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  // Регистрация (моковая версия)
  const handleRegister = async (userData) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      // Моковая задержка
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Проверка паролей
      if (userData.password !== userData.confirmPassword) {
        throw new Error('Пароли не совпадают');
      }
      
      // Проверка длины пароля
      if (userData.password.length < 6) {
        throw new Error('Пароль должен содержать минимум 6 символов');
      }
      
      // Симуляция 50% шанса, что нужно подтвердить email
      const needsConfirmation = Math.random() > 0.5;
      
      if (needsConfirmation) {
        // Нужно подтвердить email
        storage.setEmailConfirmationData(userData.email);
        setNeedsEmailConfirmation(true);
        setSuccessMessage('Регистрация успешна! Проверьте email для подтверждения.');
      } else {
        // Автоматически входим
        const mockUser = {
          id: Date.now().toString(),
          email: userData.email,
          name: userData.name,
          role: 'user',
          businesses: []
        };
        
        storage.setAuthData({
          token: `mock_jwt_token_${Date.now()}`,
          user: mockUser
        });
        
        setUser(mockUser);
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

  // Восстановление пароля
  const handleForgotPassword = async (email) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      // Моковая задержка
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSuccessMessage('Ссылка для восстановления пароля отправлена на email');
      return { success: true };
    } catch (err) {
      setError('Ошибка при восстановлении пароля');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Отправка кода подтверждения
  const handleSendVerificationCode = async (email) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      // Моковая задержка
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSuccessMessage('Код подтверждения отправлен на email');
      return { success: true };
    } catch (err) {
      setError('Ошибка при отправке кода');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Подтверждение кода
  const handleConfirmVerificationCode = async (code, email) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      // Моковая задержка
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Моковая проверка кода (всегда успешно для кода "000000")
      if (code === '000000' || code.length === 6) {
        const mockUser = {
          id: Date.now().toString(),
          email: email,
          name: 'Подтверждённый Пользователь',
          role: 'user',
          businesses: []
        };
        
        storage.setAuthData({
          token: `mock_jwt_token_confirmed_${Date.now()}`,
          user: mockUser
        });
        
        storage.clearEmailConfirmationData();
        
        setUser(mockUser);
        setIsAuthenticated(true);
        setNeedsEmailConfirmation(false);
        setSuccessMessage('Email подтвержден успешно!');
        
        return { success: true, confirmed: true };
      } else {
        setError('Неверный код подтверждения');
        return { success: false, confirmed: false };
      }
    } catch (err) {
      setError('Ошибка при подтверждении кода');
      return { success: false, confirmed: false };
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
    setCurrentPage('dashboard');
    setSuccessMessage('Выход выполнен успешно');
    
    // Очищаем сообщение через 2 секунды
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
        onSendCode={handleSendVerificationCode}
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
        onNavigate={setCurrentPage}
        businesses={businesses}
        selectedBusiness={selectedBusiness}
        onSelectBusiness={setSelectedBusiness}
        onLogout={handleLogout}
        user={user}
      />
      
      <main className="main-content">
        {currentPage === 'dashboard' && (
          <DashboardPage
            onNavigate={setCurrentPage}
            onAddBusiness={() => setShowBusinessModal(true)}
            businesses={businesses}
          />
        )}
        {currentPage === 'create-post' && <CreatePostPage businesses={businesses} />}
        {currentPage === 'content-plan' && <ContentPlanPage businesses={businesses} />}
        {currentPage === 'telegram-analysis' && <TelegramAnalysisPage />}
        {currentPage === 'pricing' && <PricingPage />}
        {currentPage === 'settings' && <SettingsPage user={user} />}
      </main>

      {showBusinessModal && (
        <BusinessProfileModal
          onClose={() => setShowBusinessModal(false)}
          business={businesses.find(b => b.id === selectedBusiness)}
        />
      )}
    </div>
  );
}