import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Layout,
  BarChart3,
  Settings,
  LogOut,
  Layers,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';

export default function AdminSidebar({ isOpen, setIsOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Manage Users', path: '/admin/users', icon: Users },
    { name: 'Templates Editor', path: '/admin/templates', icon: Layout },
    { name: 'System Analytics', path: '/admin/analytics', icon: BarChart3 },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className={`pb-admin-sidebar ${isOpen ? 'pb-sidebar-open' : 'pb-sidebar-collapsed'}`}>
      <style>{`
        .pb-admin-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          background-color: hsl(232, 25%, 8%);
          border-right: 1px solid rgba(239, 68, 68, 0.15);
          display: flex;
          flex-direction: column;
          z-index: var(--z-sticky);
          transition: var(--transition-base);
          width: 260px;
        }
        .pb-sidebar-open { width: 260px; }
        .pb-sidebar-collapsed { width: 70px; }

        @media (max-width: 768px) {
          .pb-admin-sidebar {
            transform: translateX(-100%);
          }
          .pb-sidebar-open {
            transform: translateX(0);
            width: 260px;
          }
          .pb-sidebar-collapsed {
            transform: translateX(-100%);
            width: 260px;
          }
        }

        .pb-sidebar-header {
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--space-4);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .pb-sidebar-logo {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-weight: var(--fw-bold);
          color: var(--text-primary);
          overflow: hidden;
          white-space: nowrap;
        }
        .pb-sidebar-logo-text {
          transition: opacity 0.2s ease;
          opacity: 1;
        }
        .pb-sidebar-collapsed .pb-sidebar-logo-text {
          opacity: 0;
          width: 0;
          pointer-events: none;
        }
        .pb-sidebar-logo-icon {
          color: var(--error);
          flex-shrink: 0;
        }
        .pb-sidebar-toggle-btn {
          color: var(--text-secondary);
          cursor: pointer;
          padding: var(--space-1);
          border-radius: var(--radius-sm);
          transition: var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pb-sidebar-toggle-btn:hover {
          background-color: rgba(255,255,255,0.08);
          color: var(--text-primary);
        }

        .pb-sidebar-menu {
          flex-grow: 1;
          padding: var(--space-4) var(--space-3);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .pb-sidebar-link {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          color: var(--text-secondary);
          border-radius: var(--radius-md);
          font-weight: var(--fw-medium);
          font-size: var(--font-size-sm);
          transition: var(--transition-fast);
          white-space: nowrap;
        }
        .pb-sidebar-link:hover {
          color: var(--text-primary);
          background-color: rgba(255, 255, 255, 0.05);
        }
        .pb-sidebar-link-active {
          color: white !important;
          background: linear-gradient(135deg, var(--error) 0%, var(--warning) 100%) !important;
          box-shadow: 0 8px 24px rgba(239,68,68,0.25);
        }
        .pb-sidebar-link-text {
          transition: opacity 0.2s ease;
        }
        .pb-sidebar-collapsed .pb-sidebar-link-text {
          opacity: 0;
          width: 0;
          pointer-events: none;
        }

        .pb-sidebar-footer {
          padding: var(--space-4);
          border-top: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          gap: var(--space-3);
          overflow: hidden;
        }
        .pb-sidebar-user-info {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          white-space: nowrap;
        }
        .pb-sidebar-user-name {
          font-size: var(--font-size-sm);
          font-weight: var(--fw-semibold);
          color: var(--text-primary);
        }
        .pb-sidebar-user-email {
          font-size: var(--font-size-xs);
          color: var(--error);
          font-weight: bold;
        }
        .pb-sidebar-collapsed .pb-sidebar-user-info {
          display: none;
        }
      `}</style>
      <div className="pb-sidebar-header">
        <NavLink to="/admin" className="pb-sidebar-logo">
          <Layers className="pb-sidebar-logo-icon" size={24} />
          <span className="pb-sidebar-logo-text gradient-text" style={{ background: 'linear-gradient(135deg, var(--error) 0%, var(--warning) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AdminPanel</span>
        </NavLink>
        <button
          className="pb-sidebar-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle sidebar"
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      <nav className="pb-sidebar-menu">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              `pb-sidebar-link ${isActive ? 'pb-sidebar-link-active' : ''}`
            }
          >
            <item.icon size={20} />
            <span className="pb-sidebar-link-text">{item.name}</span>
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="pb-sidebar-link"
          style={{ width: '100%', textAlign: 'left', marginTop: 'auto', background: 'none', border: 'none' }}
        >
          <LogOut size={20} />
          <span className="pb-sidebar-link-text">Logout</span>
        </button>
      </nav>

      <div className="pb-sidebar-footer">
        <Avatar src={user?.avatar} name={user?.name || 'Admin'} size="sm" />
        <div className="pb-sidebar-user-info">
          <span className="pb-sidebar-user-name truncate">{user?.name || 'Administrator'}</span>
          <span className="pb-sidebar-user-email truncate">SYSTEM ADMIN</span>
        </div>
      </div>
    </aside>
  );
}
