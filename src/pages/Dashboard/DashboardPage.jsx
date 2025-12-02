import React from 'react';
import './DashboardPage.css';

const DashboardPage = ({ onNavigate, onAddBusiness, businesses = [] }) => {
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Дашборд</h1>
      </div>
      
      <div className="stats">
        <div className="stat-card">
          <h3>Всего постов</h3>
          <div className="stat-value">280</div>
        </div>
        <div className="stat-card">
          <h3>Активные бизнесы</h3>
          <div className="stat-value">{businesses.length}</div>
        </div>
      </div>
      
      <div className="businesses-section">
        <h2>Мои бизнесы</h2>
        <div className="businesses-grid">
          {businesses.map(business => (
            <div key={business.id} className="business-card">
              <div className="business-logo">{business.logo}</div>
              <h3>{business.name}</h3>
              <p>{business.description}</p>
              <button onClick={() => onNavigate('create-post')}>
                Создать пост
              </button>
            </div>
          ))}
          <div className="business-card add-new">
            <button onClick={onAddBusiness}>
              + Добавить новый бизнес
            </button>
          </div>
        </div>
      </div>
      
      <div className="quick-actions">
        <h2>Быстрые действия</h2>
        <div className="actions-grid">
          <button onClick={() => onNavigate('create-post')} className="action-btn">
            Создать пост
          </button>
          <button onClick={() => onNavigate('content-plan')} className="action-btn">
            Контент-план
          </button>
          <button onClick={() => onNavigate('telegram-analysis')} className="action-btn">
            Аналитика
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;