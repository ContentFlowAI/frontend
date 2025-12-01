import React, { useState, useEffect } from 'react';
import './EmailConfirmationPage.css';
import { Mail, CheckCircle, ArrowLeft, Loader } from 'lucide-react';

const EmailConfirmationPage = ({ 
  email, 
  onBack, 
  onSendCode, 
  onConfirmCode, 
  loading, 
  error, 
  successMessage,
  onClearMessages
}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [canResend, setCanResend] = useState(true);
  const [resendTimer, setResendTimer] = useState(0);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    // Отправляем код при загрузке страницы
    if (canResend && email) {
      handleSendCode();
    }
  }, []);

  useEffect(() => {
    // Таймер для повторной отправки
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleSendCode = async () => {
    onClearMessages?.();
    setLocalError('');
    setCanResend(false);
    setResendTimer(60);
    
    try {
      await onSendCode(email);
    } catch (err) {
      setLocalError('Ошибка отправки кода');
      setCanResend(true);
      setResendTimer(0);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    onClearMessages?.();
    setLocalError('');
    
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setLocalError('Введите полный 6-значный код');
      return;
    }
    
    await onConfirmCode(fullCode, email);
  };

  const handleCodeInput = (index, value) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }
    
    // Разрешаем только цифры
    if (value && !/^\d+$/.test(value)) {
      return;
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
    // Обработка Backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  return (
    <div className="email-confirmation-page">
      <div className="confirmation-container">
        <button 
          onClick={onBack} 
          className="back-button"
          disabled={loading}
        >
          <ArrowLeft size={20} />
          Назад
        </button>

        <div className="confirmation-card">
          <div className="confirmation-header">
            <div className="confirmation-icon">
              <Mail size={40} />
            </div>
            <h1>Подтверждение Email</h1>
            <p className="confirmation-subtitle">
              Мы отправили 6-значный код подтверждения на адрес:
            </p>
            <div className="confirmation-email">{email}</div>
            <p className="confirmation-hint">
              Введите код из письма для завершения регистрации
            </p>
          </div>

          {/* Сообщения об ошибках и успехе */}
          {(error || localError) && (
            <div className="confirmation-error">
              <span>{error || localError}</span>
              <button onClick={() => { setLocalError(''); onClearMessages?.(); }} className="error-close">×</button>
            </div>
          )}

          {successMessage && (
            <div className="confirmation-success">
              <CheckCircle size={16} />
              <span>{successMessage}</span>
              <button onClick={onClearMessages} className="success-close">×</button>
            </div>
          )}

          <form onSubmit={handleConfirm} className="confirmation-form">
            <div className="form-group">
              <label className="form-label">Код подтверждения</label>
              <div className="code-inputs">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleCodeInput(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`code-input ${digit ? 'filled' : ''}`}
                    disabled={loading}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              
              <div className="code-actions">
                <button
                  type="button"
                  className="resend-btn"
                  onClick={handleSendCode}
                  disabled={!canResend || loading}
                >
                  {canResend ? 'Отправить код повторно' : `Повторно через ${resendTimer}с`}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="confirmation-submit-btn"
              disabled={loading || code.join('').length !== 6}
            >
              {loading ? (
                <>
                  <Loader className="spinner" size={20} />
                  Проверка...
                </>
              ) : (
                'Подтвердить Email'
              )}
            </button>
          </form>

          <div className="confirmation-info">
            <div className="info-card">
              <h3>Не получили код?</h3>
              <ul>
                <li>Проверьте папку "Спам" или "Рассылки"</li>
                <li>Убедитесь, что ввели правильный email</li>
                <li>Подождите несколько минут, письмо может идти с задержкой</li>
                <li>Если проблема сохраняется, попробуйте другой email</li>
              </ul>
            </div>
            
            <div className="demo-hint">
              <strong>Для тестирования:</strong> используйте любой 6-значный код (например: <code>000000</code> или <code>123456</code>)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmationPage;