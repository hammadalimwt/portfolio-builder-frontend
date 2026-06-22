import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, Bell, Search, User, Settings, LogOut, ChevronDown, Menu, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';

export default function Topbar({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.pb-notif-wrapper') && !event.target.closest('.pb-profile-dropdown-wrapper')) {
        setShowDropdown(false);
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard Overview';
    if (path.startsWith('/dashboard/portfolios')) return 'My Portfolios';
    if (path.startsWith('/dashboard/create') || path.startsWith('/dashboard/edit')) return 'Portfolio Editor';
    if (path.startsWith('/dashboard/preview')) return 'Live Preview';
    if (path.startsWith('/dashboard/downloads')) return 'ZIP Downloads';
    if (path.startsWith('/dashboard/settings')) return 'Profile Settings';
    if (path.startsWith('/admin')) return 'Admin Control Panel';
    return 'Portfolio Maker';
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const notifications = [
    { id: 1, text: 'Portfolio "My Resume" ZIP generation complete!', time: '10 mins ago', unread: true },
    { id: 2, text: 'Welcome to PortfolioMaker SaaS!', time: '1 day ago', unread: false },
  ];

  return (
    <header className="pb-topbar">
      <style>{`
        .pb-topbar {
          position: sticky;
          top: 0;
          height: 70px;
          background-color: var(--topbar-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--space-6);
          z-index: var(--z-sticky);
        }
        .pb-topbar-left {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }
        .pb-menu-toggle {
          color: var(--text-primary);
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        .pb-page-title {
          font-size: var(--font-size-md);
          font-weight: var(--fw-bold);
          color: var(--text-primary);
          display: none;
        }
        .pb-search-container {
          position: relative;
          display: none;
          align-items: center;
          max-width: 300px;
          width: 100%;
        }
        .pb-search-input {
          width: 100%;
          padding: var(--space-2) var(--space-4) var(--space-2) var(--space-10);
          background-color: var(--bg-input);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          font-size: var(--font-size-xs);
          color: var(--text-primary);
          outline: none;
        }
        .pb-search-input:focus {
          border-color: var(--primary);
        }
        .pb-search-icon {
          position: absolute;
          left: var(--space-3);
          color: var(--text-muted);
        }

        .pb-topbar-actions {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }
        .pb-icon-btn {
          color: var(--text-secondary);
          cursor: pointer;
          padding: var(--space-2);
          border-radius: var(--radius-full);
          transition: var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: none;
          border: none;
        }
        .pb-icon-btn:hover {
          background-color: var(--border);
          color: var(--text-primary);
        }
        .pb-badge-count {
          position: absolute;
          top: 2px;
          right: 2px;
          width: 8px;
          height: 8px;
          background-color: var(--error);
          border-radius: 50%;
        }

        /* Profile Dropdown */
        .pb-profile-dropdown-trigger {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          cursor: pointer;
          background: none;
          border: none;
          padding: var(--space-1);
          border-radius: var(--radius-md);
          transition: var(--transition-fast);
        }
        .pb-profile-dropdown-trigger:hover {
          background-color: var(--border);
        }
        .pb-dropdown-panel {
          position: absolute;
          top: 60px;
          right: var(--space-6);
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-xl);
          width: 220px;
          padding: var(--space-2);
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
          animation: scaleIn 0.2s ease forwards;
        }
        .pb-dropdown-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
          border-radius: var(--radius-sm);
          transition: var(--transition-fast);
          width: 100%;
          text-align: left;
        }
        .pb-dropdown-item:hover {
          background-color: var(--bg-secondary);
          color: var(--text-primary);
        }
        .pb-dropdown-divider {
          height: 1px;
          background-color: var(--border);
          margin: var(--space-1) 0;
        }

        /* Notifications Panel */
        .pb-notif-panel {
          position: absolute;
          top: 60px;
          right: 0;
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-xl);
          width: 300px;
          max-height: 400px;
          overflow-y: auto;
          padding: var(--space-3);
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          animation: scaleIn 0.2s ease forwards;
        }
        @media (max-width: 480px) {
          .pb-notif-panel {
            right: -60px;
            width: 280px;
          }
        }
        .pb-notif-header {
          font-size: var(--font-size-xs);
          font-weight: var(--fw-bold);
          color: var(--text-secondary);
          text-transform: uppercase;
          border-bottom: 1px solid var(--border);
          padding-bottom: var(--space-2);
          margin-bottom: var(--space-1);
        }
        .pb-notif-item {
          padding: var(--space-3);
          border-radius: var(--radius-sm);
          background-color: var(--bg-secondary);
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
          font-size: var(--font-size-xs);
        }
        .pb-notif-item-unread {
          border-left: 3px solid var(--primary);
        }
        .pb-notif-time {
          color: var(--text-muted);
          font-size: 10px;
        }

        @media (min-width: 768px) {
          .pb-page-title { display: block; }
          .pb-search-container { display: flex; }
        }
      `}</style>
      <div className="pb-topbar-left">
        {onMenuClick && (
          <button className="pb-menu-toggle pb-icon-btn" onClick={onMenuClick}>
            <Menu size={20} />
          </button>
        )}
        <h2 className="pb-page-title">{getPageTitle()}</h2>
        <div className="pb-search-container">
          <Search className="pb-search-icon" size={16} />
          <input className="pb-search-input" type="text" placeholder="Search portfolios, files..." />
        </div>
      </div>

      <div className="pb-topbar-actions">
        <button className="pb-icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative pb-notif-wrapper">
          <button className="pb-icon-btn" onClick={() => { setShowNotifications(!showNotifications); setShowDropdown(false); }} aria-label="Notifications">
            <Bell size={20} />
            <span className="pb-badge-count" />
          </button>
          {showNotifications && (
            <div className="pb-notif-panel">
              <div className="pb-notif-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Notifications</span>
                <button 
                  onClick={() => setShowNotifications(false)} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', padding: '2px' }}
                  aria-label="Close notifications"
                >
                  <X size={14} />
                </button>
              </div>
              {notifications.map((n) => (
                <div key={n.id} className={`pb-notif-item ${n.unread ? 'pb-notif-item-unread' : ''}`}>
                  <span>{n.text}</span>
                  <span className="pb-notif-time">{n.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative pb-profile-dropdown-wrapper">
          <button className="pb-profile-dropdown-trigger" onClick={() => { setShowDropdown(!showDropdown); setShowNotifications(false); }}>
            <Avatar src={user?.avatar} name={user?.name || 'User'} size="sm" />
            <ChevronDown size={16} className="pb-profile-chevron" style={{ color: 'var(--text-secondary)' }} />
          </button>

          {showDropdown && (
            <div className="pb-dropdown-panel">
              <div style={{ padding: 'var(--space-2) var(--space-4)' }}>
                <div style={{ fontWeight: 'bold', fontSize: '13px', color: 'var(--text-primary)' }}>{user?.name || 'SaaS Professional'}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user?.role === 'ADMIN' ? 'Administrator' : 'User Account'}</div>
              </div>
              <div className="pb-dropdown-divider" />
              <Link to="/dashboard/settings" className="pb-dropdown-item" onClick={() => setShowDropdown(false)}>
                <User size={16} />
                <span>My Profile</span>
              </Link>
              <Link to="/dashboard/settings" className="pb-dropdown-item" onClick={() => setShowDropdown(false)}>
                <Settings size={16} />
                <span>Account Settings</span>
              </Link>
              {user?.role === 'ADMIN' && (
                <Link to="/admin" className="pb-dropdown-item" onClick={() => setShowDropdown(false)}>
                  <Layers size={16} style={{ color: 'var(--error)' }} />
                  <span style={{ color: 'var(--error)', fontWeight: 'bold' }}>Admin Panel</span>
                </Link>
              )}
              <div className="pb-dropdown-divider" />
              <button onClick={handleLogout} className="pb-dropdown-item" style={{ background: 'none', border: 'none' }}>
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
