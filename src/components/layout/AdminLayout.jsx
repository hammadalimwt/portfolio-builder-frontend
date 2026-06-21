import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import Topbar from './Topbar';
import ToastContainer from '../ui/Toast';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="pb-admin-layout">
      <style>{`
        .pb-admin-layout {
          min-height: 100vh;
          background-color: hsl(232, 23%, 5%);
          color: var(--text-primary);
          display: flex;
          position: relative;
        }
        .pb-main-container {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          min-height: 100vh;
          transition: padding-left 0.25s ease;
          padding-left: 260px;
        }
        .pb-main-container-collapsed {
          padding-left: 70px;
        }
        .pb-admin-content {
          padding: var(--space-8) var(--space-6);
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: var(--space-8);
        }

        @media (max-width: 768px) {
          .pb-main-container {
            padding-left: 0;
          }
          .pb-main-container-collapsed {
            padding-left: 0;
          }
        }
      `}</style>
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className={`pb-main-container ${!isSidebarOpen ? 'pb-main-container-collapsed' : ''}`}>
        <Topbar onMenuClick={toggleSidebar} />
        <main className="pb-admin-content animate-fadeIn">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
