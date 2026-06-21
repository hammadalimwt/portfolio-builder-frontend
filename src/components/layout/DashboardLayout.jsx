import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import ToastContainer from '../ui/Toast';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="pb-dashboard-layout">
      <style>{`
        .pb-dashboard-layout {
          min-height: 100vh;
          background-color: var(--bg-primary);
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
        .pb-dashboard-content {
          padding: var(--space-8) var(--space-6);
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: var(--space-8);
        }
        .pb-sidebar-backdrop {
          display: none;
        }

        @media (max-width: 768px) {
          .pb-main-container {
            padding-left: 0;
          }
          .pb-main-container-collapsed {
            padding-left: 0;
          }
          .pb-sidebar-backdrop {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.4);
            z-index: calc(var(--z-sticky) - 1);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            animation: fadeIn 0.2s ease;
          }
        }
      `}</style>
      {isSidebarOpen && (
        <div className="pb-sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />
      )}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className={`pb-main-container ${!isSidebarOpen ? 'pb-main-container-collapsed' : ''}`}>
        <Topbar onMenuClick={toggleSidebar} />
        <main className="pb-dashboard-content animate-fadeIn">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
