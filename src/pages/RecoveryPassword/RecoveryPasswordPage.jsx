import React, { useState } from 'react';
import './RecoveryPasswordPage.css';
import { ArrowLeft, Mail, CheckCircle, Loader } from 'lucide-react';

const RecoveryPasswordPage = ({ 
  onBack, 
  onForgotPassword, 
  loading, 
  error, 
  successMessage,
  onClearMessages 
}) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSendCode = async (e) => {
    e.preventDefault();
    onClearMessages?.();
    setLocalError('');
    
    if (!email) {
      setLocalError('Введите email');
      return;
    }
    
    try {
      const result = await onForgotPassword(email);
      if (result?.success) {
        setStep(2);
      }
    } catch (err) {
      setLocalError('Ошибка отправки кода');
    }
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    onClearMessages?.();
    setLocalError('');
    
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setLocalError('Введите полный 6-значный код');
      return;
    }
    
    // В моковой версии всегда переходим к шагу 3
    setStep(3);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    onClearMessages?.();
    setLocalError('');
    
    if (!newPassword || !confirmPassword) {
      setLocalError('Заполните все поля');
      return;
    }
    
    if (newPassword.length < 6) {
      setLocalError('Пароль должен содержать минимум 6 символов');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setLocalError('Пароли не совпадают');
      return;
    }
    
    // В моковой версии просто переходим к успеху
    setStep(4);
  };

  const handleCodeInput = (index, value) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    // Автопереход к следующему полю
    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  return (
    <div className="recovery-page">
      <div className="recovery-container">
        <button 
          onClick={onBack} 
          className="back-button"
          disabled={loading}
        >
          <ArrowLeft size={20} />
          Назад ко входу
        </button>

        <div className="recovery-card">
          <div className="recovery-header">
            <div className="recovery-icon">
              <Mail size={32} />
            </div>
            <h1>Восстановление пароля</h1>
            <p className="recovery-subtitle">
              {step === 1 && "Введите ваш email, чтобы получить код подтверждения"}
              {step === 2 && "Введите 6-значный код, отправленный на ваш email"}
              {step === 3 && "Создайте ваш новый пароль"}
              {step === 4 && "Пароль успешно сброшен!"}
            </p>
          </div>

          {/* Сообщения */}
          {(error || localError) && (
            <div className="recovery-error">
              <span>{error || localError}</span>
              <button onClick={() => { setLocalError(''); onClearMessages?.(); }} className="error-close">×</button>
            </div>
          )}

          {successMessage && (
            <div className="recovery-success">
              <CheckCircle size={16} />
              <span>{successMessage}</span>
              <button onClick={onClearMessages} className="success-close">×</button>
            </div>
          )}

          <div className="recovery-progress">
            <div className="progress-steps">
              <div className={`step ${step >= 1 ? 'active' : ''}`}>
                <div className="step-number">1</div>
                <span className="step-label">Email</span>
              </div>
              <div className="progress-line"></div>
              <div className={`step ${step >= 2 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <span className="step-label">Код</span>
              </div>
              <div className="progress-line"></div>
              <div className={`step ${step >= 3 ? 'active' : ''}`}>
                <div className="step-number">3</div>
                <span className="step-label">Пароль</span>
              </div>
              <div className="progress-line"></div>
              <div className={`step ${step >= 4 ? 'active' : ''}`}>
                <div className="step-number">4</div>
                <span className="step-label">Готово</span>
              </div>
            </div>
          </div>

          {step === 1 && (
            <form onSubmit={handleSendCode} className="recovery-form">
              <div className="form-group">
                <label className="form-label">Адрес электронной почты</label>
                <input
                  type="email"
                  placeholder="ваш@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  required
                  disabled={loading}
                />
              </div>
              <button 
                type="submit" 
                className="recovery-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="spinner" size={20} />
                    Отправка...
                  </>
                ) : (
                  'Отправить код подтверждения'
                )}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="recovery-form">
              <div className="form-group">
                <label className="form-label">Код подтверждения</label>
                <div className="code-inputs">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleCodeInput(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`code-input ${digit ? 'filled' : ''}`}
                      disabled={loading}
                    />
                  ))}
                </div>
                <p className="code-hint">
                  Код отправлен на: <strong>{email}</strong>
                </p>
              </div>
              <div className="form-actions">
                <button 
                  type="button" 
                  className="resend-btn"
                  onClick={handleSendCode}
                  disabled={loading}
                >
                  Отправить код повторно
                </button>
                <button 
                  type="submit" 
                  className="recovery-submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader className="spinner" size={20} />
                      Проверка...
                    </>
                  ) : (
                    'Подтвердить код'
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleReset} className="recovery-form">
              <div className="form-group">
                <label className="form-label">Новый пароль</label>
                <input
                  type="password"
                  placeholder="Введите новый пароль"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field"
                  required
                  disabled={loading}
                />
                <div className="password-strength">
                  <div 
                    className={`strength-bar ${
                      newPassword.length === 0 ? 'empty' :
                      newPassword.length < 6 ? 'weak' :
                      newPassword.length < 8 ? 'medium' : 'strong'
                    }`}
                  />
                  <span className="strength-text">
                    {newPassword.length === 0 ? 'Введите пароль' :
                     newPassword.length < 6 ? 'Слабый' :
                     newPassword.length < 8 ? 'Средний' : 'Сильный'}
                  </span>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Подтвердите новый пароль</label>
                <input
                  type="password"
                  placeholder="Повторите новый пароль"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`input-field ${
                    confirmPassword && newPassword !== confirmPassword ? 'error' : ''
                  }`}
                  required
                  disabled={loading}
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <div className="password-error">Пароли не совпадают</div>
                )}
              </div>
              
              <div className="password-requirements">
                <p className="requirements-title">Требования к паролю:</p>
                <ul className="requirements-list">
                  <li className={`requirement ${newPassword.length >= 6 ? 'met' : ''}`}>
                    Минимум 6 символов
                  </li>
                  <li className={`requirement ${/[A-Z]/.test(newPassword) ? 'met' : ''}`}>
                    Хотя бы одна заглавная буква
                  </li>
                  <li className={`requirement ${/\d/.test(newPassword) ? 'met' : ''}`}>
                    Хотя бы одна цифра
                  </li>
                  <li className={`requirement ${/[!@#$%^&*]/.test(newPassword) ? 'met' : ''}`}>
                    Хотя бы один специальный символ (!@#$%^&*)
                  </li>
                </ul>
              </div>
              
              <button 
                type="submit" 
                className="recovery-submit-btn"
                disabled={loading || newPassword !== confirmPassword || newPassword.length < 6}
              >
                {loading ? (
                  <>
                    <Loader className="spinner" size={20} />
                    Сохранение...
                  </>
                ) : (
                  'Установить новый пароль'
                )}
              </button>
            </form>
          )}

          {step === 4 && (
            <div className="success-screen">
              <div className="success-icon">
                <CheckCircle size={64} />
              </div>
              <h2 className="success-title">Пароль успешно изменен!</h2>
              <p className="success-message">
                Ваш пароль был успешно сброшен. Теперь вы можете войти в систему с новым паролем.
              </p>
              <div className="success-actions">
                <button 
                  onClick={onBack} 
                  className="success-btn primary"
                >
                  Войти в систему
                </button>
                <button 
                  onClick={() => {
                    setStep(1);
                    setEmail('');
                    setCode(['', '', '', '', '', '']);
                    setNewPassword('');
                    setConfirmPassword('');
                    setLocalError('');
                    onClearMessages?.();
                  }}
                  className="success-btn secondary"
                >
                  Сбросить другой пароль
                </button>
              </div>
            </div>
          )}

          <div className="recovery-footer">
            <p className="footer-text">
              Возникли проблемы?{' '}
              <button 
                className="support-link" 
                onClick={() => window.open('mailto:support@contentai.com')}
              >
                Свяжитесь с поддержкой
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecoveryPasswordPage;