import React, { useState } from 'react';
import './Header.css';
import { ChevronDown, Settings, LogOut, Menu, X } from 'lucide-react';

const Header = ({
  currentPage,
  onNavigate,
  businesses = [],
  selectedBusiness,
  onSelectBusiness,
  onLogout,
  user = null
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showBusinessMenu, setShowBusinessMenu] = useState(false);

  const selectedBusinessData = businesses.find(b => b.id === selectedBusiness) || businesses[0];

  const navItems = [
    { id: 'dashboard', label: 'Дашборд' },
    { id: 'create-post', label: 'Создать пост' },
    { id: 'content-plan', label: 'Контент-план' },
    { id: 'telegram-analysis', label: 'Аналитика' },
    { id: 'pricing', label: 'Цены' },
  ];

  return (
    <header className="header">
      <div className="header-container">
        {/* Лого и переключатель бизнеса */}
        <div className="header-left">
          <h1 className="header-logo" onClick={() => onNavigate('dashboard')}>
            ContentAI
          </h1>
          
          {businesses.length > 0 && (
            <div className="business-switcher">
              <button
                className="business-switcher-btn"
                onClick={() => setShowBusinessMenu(!showBusinessMenu)}
              >
                <span className="business-logo">{selectedBusinessData?.logo || '🏢'}</span>
                <span className="business-name">{selectedBusinessData?.name || 'Бизнес'}</span>
                <ChevronDown className="chevron-icon" size={16} />
              </button>
              
              {showBusinessMenu && (
                <div className="business-dropdown">
                  {businesses.map(business => (
                    <button
                      key={business.id}
                      className="business-option"
                      onClick={() => {
                        onSelectBusiness?.(business.id);
                        setShowBusinessMenu(false);
                      }}
                    >
                      <span className="business-option-logo">{business.logo}</span>
                      <div className="business-option-info">
                        <div className="business-option-name">{business.name}</div>
                        <div className="business-option-industry">{business.industry}</div>
                      </div>
                    </button>
                  ))}
                  <div className="dropdown-divider"></div>
                  <button className="add-business-btn">
                    + Добавить бизнес
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Навигация для десктопа */}
        <nav className="header-nav desktop">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`nav-btn ${currentPage === item.id ? 'active' : ''}`}
            >
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

        {/* Кнопка меню для мобильных */}
        <button
          className="mobile-menu-btn"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Меню пользователя */}
        <div className="header-right">
          <div className="user-menu">
            <button
              className="user-avatar"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <span className="avatar-initials">
                {user?.name?.split(' ').map(n => n[0]).join('') || 'JD'}
              </span>
            </button>
            
            {showUserMenu && (
              <div className="user-dropdown">
                {user && (
                  <div className="user-info">
                    <div className="user-avatar-small">
                      <span className="avatar-initials">
                        {user.name?.split(' ').map(n => n[0]).join('') || 'JD'}
                      </span>
                    </div>
                    <div>
                      <div className="user-name">{user.name || 'Пользователь'}</div>
                      <div className="user-email">{user.email || 'email@example.com'}</div>
                    </div>
                  </div>
                )}
                
                <div className="dropdown-divider"></div>
                
                <button
                  className="dropdown-item"
                  onClick={() => { onNavigate('settings'); setShowUserMenu(false); }}
                >
                  <Settings className="item-icon" size={16} />
                  Настройки аккаунта
                </button>
                
                <div className="dropdown-divider"></div>
                
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
        </div>
      </div>

      {/* Мобильное меню */}
      {showMobileMenu && (
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