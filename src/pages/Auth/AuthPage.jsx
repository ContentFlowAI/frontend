import React, { useState } from 'react';
import './AuthPage.css';
import { Loader } from 'lucide-react';

const AuthPage = ({ 
  onLogin, 
  onRegister, 
  onForgotPassword, 
  mode, 
  onModeChange, 
  loading,
  error,
  successMessage,
  onClearMessages
}) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [localError, setLocalError] = useState('');

  // Очистка сообщений при переключении режима
  const handleModeChange = (newMode) => {
    onClearMessages?.();
    setLocalError('');
    setFormData({
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    onModeChange(newMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onClearMessages?.();
    setLocalError('');
    
    // Валидация
    if (!formData.email || !formData.password) {
      setLocalError('Заполните все обязательные поля');
      return;
    }
    
    if (mode === 'signup') {
      if (!formData.username) {
        setLocalError('Введите имя пользователя');
        return;
      }
      if (!formData.name) {
        setLocalError('Введите ваше полное имя');
        return;
      }
      if (formData.password.length < 6) {
        setLocalError('Пароль должен содержать минимум 6 символов');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setLocalError('Пароли не совпадают');
        return;
      }
    }

    try {
      if (mode === 'login') {
        await onLogin(formData.email, formData.password);
      } else {
        await onRegister({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          name: formData.name
        });
      }
    } catch (err) {
      setLocalError(err.message || 'Произошла ошибка');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (localError) setLocalError('');
  };

  const handleDemoLogin = (demoEmail, demoPassword) => {
    onClearMessages?.();
    setLocalError('');
    setFormData({
      name: 'Демо Пользователь',
      username: 'demo',
      email: demoEmail,
      password: demoPassword,
      confirmPassword: demoPassword
    });
    onLogin(demoEmail, demoPassword);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          {(error || localError) && (
            <div className="auth-error">
              <span>{error || localError}</span>
              <button onClick={() => { setLocalError(''); onClearMessages?.(); }} className="error-close">×</button>
            </div>
          )}

          {successMessage && (
            <div className="auth-success">
              <span>{successMessage}</span>
              <button onClick={onClearMessages} className="success-close">×</button>
            </div>
          )}

          {/* Logo */}
          <div className="auth-header">
            <h1 className="auth-logo">ContentAI</h1>
            <p className="auth-subtitle">Платформа генерации контента на основе ИИ</p>
          </div>

          {/* Toggle Tabs */}
          <div className="auth-tabs">
            <button
              onClick={() => handleModeChange('login')}
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              disabled={loading}
            >
              Вход
            </button>
            <button
              onClick={() => handleModeChange('signup')}
              className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
              disabled={loading}
            >
              Регистрация
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'signup' && (
              <>
                <div className="form-group">
                  <label className="form-label">Имя пользователя *</label>
                  <input
                    type="text"
                    name="username"
                    placeholder="ivanov"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Полное имя *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Иван Иванов"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                    disabled={loading}
                  />
                </div>
              </>
            )}
            
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                name="email"
                placeholder="ваш@email.com"
                value={formData.email}
                onChange={handleInputChange}
                className="input-field"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Пароль *</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                className="input-field"
                required
                disabled={loading}
              />
            </div>

            {mode === 'signup' && (
              <div className="form-group">
                <label className="form-label">Подтверждение пароля *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                  disabled={loading}
                />
              </div>
            )}

            {mode === 'login' && (
              <div className="form-options">
                <button 
                  type="button"
                  className="forgot-password"
                  onClick={onForgotPassword}
                  disabled={loading}
                >
                  Забыли пароль?
                </button>
              </div>
            )}

            <button 
              type="submit" 
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="spinner" size={20} />
                  {mode === 'login' ? 'Вход...' : 'Регистрация...'}
                </>
              ) : (
                mode === 'login' ? 'Войти' : 'Создать аккаунт'
              )}
            </button>
          </form>

          {/* Social Auth */}
          <div className="social-auth">
            <div className="divider">
              <span>Или продолжить через</span>
            </div>

            <button className="google-auth-btn" disabled={loading}>
              <svg className="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Продолжить через Google
            </button>
          </div>

          {/* Demo Accounts */}
          <div className="demo-accounts">
            <p className="demo-title">Попробуйте демо-аккаунт:</p>
            <div className="demo-grid">
              <div className="demo-card">
                <div className="demo-role">Контент-менеджер</div>
                <div className="demo-info">
                  <div className="demo-email">demo@example.com</div>
                  <div className="demo-password">password123</div>
                </div>
                <button 
                  className="demo-btn"
                  onClick={() => handleDemoLogin('demo@example.com', 'password123')}
                  disabled={loading}
                >
                  Быстрый вход
                </button>
              </div>
              <div className="demo-card">
                <div className="demo-role">Тест подтверждения</div>
                <div className="demo-info">
                  <div className="demo-email">unconfirmed@example.com</div>
                  <div className="demo-password">anypassword</div>
                </div>
                <button 
                  className="demo-btn"
                  onClick={() => handleDemoLogin('unconfirmed@example.com', 'anypassword')}
                  disabled={loading}
                >
                  Тест подтверждения
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="feature-highlights">
          <div className="feature-card">
            <div className="feature-icon">✨</div>
            <h3>Контент на основе ИИ</h3>
            <p>Создавайте вовлекающие посты с помощью продвинутых AI-моделей</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Умная аналитика</h3>
            <p>Отслеживайте показатели и оптимизируйте стратегию</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Мультиплатформенность</h3>
            <p>Публикуйте в Telegram, VK, Instagram и другие</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;