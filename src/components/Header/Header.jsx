import React, { useState } from 'react';
// import './Header.css';
import { ChevronDown, Settings, LogOut } from 'lucide-react';

const Header = ({ currentPage, onNavigate, businesses, selectedBusiness, onSelectBusiness, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showBusinessMenu, setShowBusinessMenu] = useState(false);

  const selectedBusinessData = businesses.find(b => b.id === selectedBusiness);

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="header-left">
          <h1 className="header-logo" onClick={() => onNavigate('dashboard')}>
            ContentAI
          </h1>
          
          {/* Business Switcher */}
          <div className="business-switcher">
            <button 
              className="business-switcher-btn"
              onClick={() => setShowBusinessMenu(!showBusinessMenu)}
            >
              <span className="business-logo">{selectedBusinessData?.logo}</span>
              <span className="business-name">{selectedBusinessData?.name}</span>
              <ChevronDown className="chevron-icon" />
            </button>
            
            {showBusinessMenu && (
              <div className="business-dropdown">
                {businesses.map(business => (
                  <button
                    key={business.id}
                    className="business-option"
                    onClick={() => {
                      onSelectBusiness(business.id);
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
        </div>

        {/* Navigation */}
        <nav className="header-nav">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
          >
            Дашборд
          </button>
          <button
            onClick={() => onNavigate('create-post')}
            className={`nav-btn ${currentPage === 'create-post' ? 'active' : ''}`}
          >
            Создать пост
          </button>
          <button
            onClick={() => onNavigate('content-plan')}
            className={`nav-btn ${currentPage === 'content-plan' ? 'active' : ''}`}
          >
            Контент-план
          </button>
          <button
            onClick={() => onNavigate('telegram-analysis')}
            className={`nav-btn ${currentPage === 'telegram-analysis' ? 'active' : ''}`}
          >
            Аналитика
          </button>
          <button
            onClick={() => onNavigate('pricing')}
            className={`nav-btn ${currentPage === 'pricing' ? 'active' : ''}`}
          >
            Pricing
          </button>
        </nav>

        {/* User Menu */}
        <div className="header-right">
          <div className="user-menu">
            <button
              className="user-avatar"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <span className="avatar-initials">JD</span>
            </button>
            
            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-info">
                  <div className="user-avatar-small">
                    <span className="avatar-initials">JD</span>
                  </div>
                  <div>
                    <div className="user-name">John Doe</div>
                    <div className="user-email">john@example.com</div>
                  </div>
                </div>
                
                <div className="dropdown-divider"></div>
                
                <button
                  className="dropdown-item"
                  onClick={() => { onNavigate('settings'); setShowUserMenu(false); }}
                >
                  <Settings className="item-icon" />
                  Account Settings
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    // Handle API docs
                    setShowUserMenu(false);
                  }}
                >
                  <span className="item-icon">📚</span>
                  API Documentation
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    // Handle help
                    setShowUserMenu(false);
                  }}
                >
                  <span className="item-icon">❓</span>
                  Help & Support
                </button>
                
                <div className="dropdown-divider"></div>
                
                <button
                  className="dropdown-item logout"
                  onClick={() => {
                    onLogout();
                    setShowUserMenu(false);
                  }}
                >
                  <LogOut className="item-icon" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;