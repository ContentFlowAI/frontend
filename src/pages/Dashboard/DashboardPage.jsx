import React, { useState, useEffect } from 'react';
import './DashboardPage.css';
import { 
  FileText, 
  Calendar,
  BarChart3,
  Plus,
  Zap,
  Users,
  Sparkles,
  Target
} from 'lucide-react';

const DashboardPage = ({ 
  onNavigate,
  user = null
}) => {
  const [loading, setLoading] = useState(true);
  const [userBusinesses, setUserBusinesses] = useState([]);

  // Загрузка бизнесов пользователя
  useEffect(() => {
    const loadUserBusinesses = () => {
      setLoading(true);
      try {
        if (user?.id) {
          const storedBusinesses = JSON.parse(localStorage.getItem(`businesses_${user.id}`) || '[]');
          setUserBusinesses(storedBusinesses);
        }
      } catch (error) {
        console.error('Ошибка загрузки бизнесов:', error);
        setUserBusinesses([]);
      } finally {
        setLoading(false);
      }
    };

    loadUserBusinesses();
  }, [user]);

  const handleQuickAction = (action) => {
    switch(action) {
      case 'create-post':
        onNavigate('create-post');
        break;
      case 'content-plan':
        onNavigate('content-plan');
        break;
      case 'telegram-analysis':
        onNavigate('telegram-analysis');
        break;
      case 'pricing':
        onNavigate('pricing');
        break;
      default:
        break;
    }
  };

  const getIndustryIcon = (industry) => {
    const icons = {
      'Технологии': '💻',
      'Еда и рестораны': '🍽️',
      'Розничная торговля': '🛍️',
      'Образование': '🎓',
      'Здоровье и красота': '💄',
      'Недвижимость': '🏠',
      'Финансы': '💰',
      'Маркетинг и реклама': '📈',
      'Развлечения': '🎬',
      'Спорт и фитнес': '🏋️',
      'Мода и стиль': '👗',
      'Автомобили': '🚗',
      'Строительство': '🏗️',
      'Туризм и путешествия': '✈️',
      'Другое': '🏢'
    };
    return icons[industry] || '🏢';
  };

  if (loading) {
    return (
      <div className="dashboard-page loading">
        <div className="loading-content">
          <div className="loading-spinner" />
          <p>Загрузка дашборда...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Приветствие */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <h1>Привет, {user?.name || 'Пользователь'}! 👋</h1>
          <p className="hero-subtitle">
            Управляйте контентом для ваших бизнесов с помощью искусственного интеллекта
          </p>
        </div>
      </div>

      {/* Краткая статистика */}
      <div className="quick-stats">
        <div className="quick-stat">
          <div className="stat-icon">
            <Target size={24} />
          </div>
          <div className="stat-info">
            <h3>Активных бизнесов</h3>
            <div className="stat-value">{userBusinesses.length}</div>
          </div>
        </div>
        <div className="quick-stat">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>Готовы к работе</h3>
            <div className="stat-value">{userBusinesses.length > 0 ? 'Да' : 'Нет'}</div>
          </div>
        </div>
        <div className="quick-stat">
          <div className="stat-icon">
            <Sparkles size={24} />
          </div>
          <div className="stat-info">
            <h3>ИИ помощник</h3>
            <div className="stat-value">Активен</div>
          </div>
        </div>
      </div>

      {/* Основные возможности */}
      <div className="capabilities-section">
        <h2>Что вы можете сделать</h2>
        <p className="section-description">
          Выберите действие для вашего бизнеса или начните с создания нового контента
        </p>
        
        <div className="capabilities-grid">
          <button 
            onClick={() => handleQuickAction('create-post')} 
            className="capability-card"
          >
            <div className="capability-icon" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}>
              <FileText size={28} />
            </div>
            <h3>Создать пост</h3>
            <p>Сгенерируйте уникальный контент для выбранного бизнеса с помощью ИИ</p>
          </button>
          
          <button 
            onClick={() => handleQuickAction('content-plan')} 
            className="capability-card"
          >
            <div className="capability-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
              <Calendar size={28} />
            </div>
            <h3>Контент-план</h3>
            <p>Создайте план публикаций на неделю или месяц вперед</p>
          </button>
          
          <button 
            onClick={() => handleQuickAction('telegram-analysis')} 
            className="capability-card"
          >
            <div className="capability-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
              <BarChart3 size={28} />
            </div>
            <h3>Анализ Telegram</h3>
            <p>Проанализируйте канал и получите идеи для контента</p>
          </button>
          
          <button 
            onClick={() => handleQuickAction('pricing')} 
            className="capability-card"
          >
            <div className="capability-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
              <Zap size={28} />
            </div>
            <h3>Тарифы и возможности</h3>
            <p>Узнайте о доступных функциях и тарифных планах</p>
          </button>
        </div>
      </div>

      {/* Информация о текущем состоянии */}
      {userBusinesses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Plus size={48} />
          </div>
          <h3>У вас пока нет бизнесов</h3>
          <p>
            Добавьте ваш первый бизнес через меню в верхней части страницы, 
            чтобы начать создавать контент с помощью ИИ
          </p>
          <div className="empty-steps">
            <div className="step">
              <div className="step-number">1</div>
              <p>Нажмите на переключатель бизнесов в хедере</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <p>Выберите "Добавить новый бизнес"</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <p>Заполните информацию о вашем бизнесе</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="current-business-info">
          <h3>Ваши бизнесы готовы к работе</h3>
          <p>Вы можете начать создавать контент для любого из ваших бизнесов</p>
          
          <div className="businesses-preview">
            {userBusinesses.slice(0, 3).map((business) => (
              <div key={business.id} className="business-preview-card">
                <div className="preview-logo">
                  {getIndustryIcon(business.industry)}
                </div>
                <div className="preview-info">
                  <h4>{business.name}</h4>
                  <span className="preview-industry">{business.industry}</span>
                </div>
              </div>
            ))}
            {userBusinesses.length > 3 && (
              <div className="more-businesses">
                +{userBusinesses.length - 3} еще
              </div>
            )}
          </div>
          
          <button 
            className="start-creating-btn"
            onClick={() => handleQuickAction('create-post')}
          >
            <FileText size={20} />
            Начать создавать контент
          </button>
        </div>
      )}

      {/* Быстрые ссылки */}
      <div className="quick-links">
        <h3>Полезные ссылки</h3>
        <div className="links-grid">
          <a href="#" className="link-card">
            <span className="link-icon">📚</span>
            <span>Документация</span>
          </a>
          <a href="#" className="link-card">
            <span className="link-icon">🎥</span>
            <span>Видеоуроки</span>
          </a>
          <a href="#" className="link-card">
            <span className="link-icon">💬</span>
            <span>Поддержка</span>
          </a>
          <a href="#" className="link-card">
            <span className="link-icon">📈</span>
            <span>Примеры работ</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;