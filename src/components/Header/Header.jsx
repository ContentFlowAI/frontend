import React, { useState, useEffect } from 'react';
import './Header.css';
import { ChevronDown, Settings, LogOut, Menu, X, Plus, Building } from 'lucide-react';

const Header = ({
  currentPage,
  onNavigate,
  user = null,
  onLogout
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showBusinessMenu, setShowBusinessMenu] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [loading, setLoading] = useState(false);

  // Загрузка бизнесов пользователя
  useEffect(() => {
    if (user?.id) {
      loadUserBusinesses();
    }
  }, [user]);

  useEffect(() => {
    if (businesses.length > 0 && !selectedBusiness) {
      setSelectedBusiness(businesses[0]);
    }
  }, [businesses]);

  const loadUserBusinesses = () => {
    setLoading(true);
    try {
      const storedBusinesses = JSON.parse(localStorage.getItem(`businesses_${user.id}`) || '[]');
      setBusinesses(storedBusinesses);
      
      if (storedBusinesses.length > 0) {
        // Восстанавливаем выбранный бизнес из localStorage или берем первый
        const savedSelectedBusinessId = localStorage.getItem(`selected_business_${user.id}`);
        const businessToSelect = savedSelectedBusinessId 
          ? storedBusinesses.find(b => b.id === savedSelectedBusinessId)
          : storedBusinesses[0];
        
        if (businessToSelect) {
          setSelectedBusiness(businessToSelect);
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки бизнесов:', error);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBusiness = (business) => {
    setSelectedBusiness(business);
    setShowBusinessMenu(false);
    
    // Сохраняем выбор в localStorage
    if (user?.id) {
      localStorage.setItem(`selected_business_${user.id}`, business.id);
    }
    
    // Можно добавить обработку смены бизнеса в приложении
    console.log('Выбран бизнес:', business.name);
  };

  const handleAddBusiness = () => {
    setShowBusinessMenu(false);
    onNavigate('add-business');
  };

  const handleLogoClick = () => {
    // Если есть выбранный бизнес - показываем его дашборд
    // Если нет - общий дашборд
    if (selectedBusiness) {
      onNavigate(`business-${selectedBusiness.id}`);
    } else {
      onNavigate('dashboard');
    }
  };

  const getIndustryColor = (industry) => {
    const colors = {
      'Технологии': '#3b82f6',
      'Еда и рестораны': '#ef4444',
      'Розничная торговля': '#10b981',
      'Образование': '#f59e0b',
      'Здоровье и красота': '#ec4899',
      'Недвижимость': '#8b5cf6',
      'Финансы': '#059669',
      'Маркетинг и реклама': '#0ea5e9',
      'Развлечения': '#f97316',
      'Спорт и фитнес': '#84cc16',
      'Мода и стиль': '#8b5cf6',
      'Автомобили': '#64748b',
      'Строительство': '#92400e',
      'Туризм и путешествия': '#06b6d4',
      'Другое': '#6b7280'
    };
    return colors[industry] || '#6b7280';
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getBusinessInitials = (businessName) => {
    return getInitials(businessName);
  };

  const formatBusinessName = (name) => {
    if (name.length > 20) {
      return name.substring(0, 20) + '...';
    }
    return name;
  };

  const navItems = [
    { id: 'dashboard', label: 'Дашборд', icon: null },
    { id: 'create-post', label: 'Создать пост', icon: null },
    { id: 'content-plan', label: 'Контент-план', icon: null },
    { id: 'telegram-analysis', label: 'Аналитика', icon: null },
    { id: 'pricing', label: 'Цены', icon: null },
  ];

  return (
    <header className="header">
      <div className="header-container">
        {/* Лого и переключатель бизнеса */}
        <div className="header-left">
          <h1 className="header-logo" onClick={handleLogoClick}>
            ContentAI
          </h1>
          
          {user && (
            <div className="business-switcher">
              <button
                className="business-switcher-btn"
                onClick={() => setShowBusinessMenu(!showBusinessMenu)}
                disabled={loading}
              >
                {selectedBusiness ? (
                  <>
                    <div 
                      className="business-avatar"
                      style={{ 
                        background: getIndustryColor(selectedBusiness.industry) + '20',
                        color: getIndustryColor(selectedBusiness.industry)
                      }}
                    >
                      {selectedBusiness.logo || getBusinessInitials(selectedBusiness.name)}
                    </div>
                    <div className="business-info">
                      <span className="business-name">
                        {formatBusinessName(selectedBusiness.name)}
                      </span>
                      <span className="business-industry">
                        {selectedBusiness.industry || 'Без категории'}
                      </span>
                    </div>
                  </>
                ) : businesses.length === 0 ? (
                  <>
                    <div className="business-avatar empty">
                      <Building size={20} />
                    </div>
                    <div className="business-info">
                      <span className="business-name">Добавить бизнес</span>
                      <span className="business-industry">Начать работу</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="business-avatar loading">
                      <div className="loading-spinner" />
                    </div>
                    <div className="business-info">
                      <span className="business-name">Загрузка...</span>
                      <span className="business-industry">Пожалуйста, подождите</span>
                    </div>
                  </>
                )}
                <ChevronDown className="chevron-icon" size={16} />
              </button>
              
              {showBusinessMenu && (
                <div className="business-dropdown">
                  <div className="dropdown-header">
                    <h3>Ваши бизнесы</h3>
                    <span className="businesses-count">{businesses.length}</span>
                  </div>
                  
                  {businesses.length === 0 ? (
                    <div className="empty-businesses">
                      <Building size={24} />
                      <p>У вас пока нет бизнесов</p>
                      <button 
                        className="add-business-btn-primary"
                        onClick={handleAddBusiness}
                      >
                        <Plus size={16} />
                        Создать первый бизнес
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="businesses-list">
                        {businesses.map(business => (
                          <button
                            key={business.id}
                            className={`business-option ${selectedBusiness?.id === business.id ? 'selected' : ''}`}
                            onClick={() => handleSelectBusiness(business)}
                          >
                            <div 
                              className="business-option-avatar"
                              style={{ 
                                background: getIndustryColor(business.industry) + '20',
                                color: getIndustryColor(business.industry)
                              }}
                            >
                              {business.logo || getBusinessInitials(business.name)}
                            </div>
                            <div className="business-option-info">
                              <div className="business-option-name">
                                {formatBusinessName(business.name)}
                              </div>
                              <div className="business-option-industry">
                                {business.industry || 'Без категории'}
                              </div>
                            </div>
                            {selectedBusiness?.id === business.id && (
                              <div className="business-selected-indicator" />
                            )}
                          </button>
                        ))}
                      </div>
                      
                      <div className="dropdown-divider" />
                      
                      <div className="dropdown-footer">
                        <button 
                          className="add-business-btn"
                          onClick={handleAddBusiness}
                        >
                          <Plus size={16} />
                          Добавить новый бизнес
                        </button>
                        <button 
                          className="manage-businesses-btn"
                          onClick={() => {
                            setShowBusinessMenu(false);
                            onNavigate('dashboard');
                          }}
                        >
                          Управление бизнесами
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Навигация для десктопа */}
        {user && (
          <nav className="header-nav desktop">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`nav-btn ${currentPage === item.id ? 'active' : ''}`}
              >
                {item.icon && <item.icon size={18} />}
                {item.label}
              </button>
            ))}
            <button
              onClick={() => onNavigate('settings')}
              className={`nav-btn ${currentPage === 'settings' ? 'active' : ''}`}
            >
              <Settings size={18} />
            </button>
          </nav>
        )}

        {/* Кнопка меню для мобильных */}
        {user && (
          <button
            className="mobile-menu-btn"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}

        {/* Меню пользователя */}
        <div className="header-right">
          {user ? (
            <div className="user-menu">
              <button
                className="user-avatar"
                onClick={() => setShowUserMenu(!showUserMenu)}
                title={user.name || 'Пользователь'}
              >
                <span className="avatar-initials">
                  {getInitials(user.name)}
                </span>
              </button>
              
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <div className="user-avatar-small">
                      <span className="avatar-initials">
                        {getInitials(user.name)}
                      </span>
                    </div>
                    <div>
                      <div className="user-name">{user.name || 'Пользователь'}</div>
                      <div className="user-email">{user.email || 'email@example.com'}</div>
                    </div>
                  </div>
                  
                  <div className="user-businesses-summary">
                    <div className="summary-item">
                      <span className="summary-label">Бизнесы:</span>
                      <span className="summary-value">{businesses.length}</span>
                    </div>
                    {selectedBusiness && (
                      <div className="summary-item">
                        <span className="summary-label">Текущий:</span>
                        <span className="summary-value business-name">
                          {formatBusinessName(selectedBusiness.name)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="dropdown-divider" />
                  
                  <button
                    className="dropdown-item"
                    onClick={() => { 
                      onNavigate('dashboard'); 
                      setShowUserMenu(false); 
                    }}
                  >
                    <Settings className="item-icon" size={16} />
                    Настройки аккаунта
                  </button>
                  
                  <button
                    className="dropdown-item"
                    onClick={() => { 
                      setShowUserMenu(false);
                      setShowBusinessMenu(true);
                    }}
                  >
                    <Building className="item-icon" size={16} />
                    Сменить бизнес
                  </button>
                  
                  <div className="dropdown-divider" />
                  
                  <button
                    className="dropdown-item logout"
                    onClick={() => {
                      onLogout?.();
                      setShowUserMenu(false);
                    }}
                  >
                    <LogOut className="item-icon" size={16} />
                    Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="login-btn"
            >
              Войти
            </button>
          )}
        </div>
      </div>

      {/* Мобильное меню */}
      {showMobileMenu && user && (
        <nav className="header-nav mobile">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setShowMobileMenu(false);
              }}
              className={`nav-btn ${currentPage === item.id ? 'active' : ''}`}
            >
              {item.icon && <item.icon size={18} />}
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              onNavigate('settings');
              setShowMobileMenu(false);
            }}
            className={`nav-btn ${currentPage === 'settings' ? 'active' : ''}`}
          >
            <Settings size={18} />
            Настройки
          </button>
        </nav>
      )}
    </header>
  );
};

export default Header;