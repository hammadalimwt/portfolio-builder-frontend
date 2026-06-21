import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout.jsx';
import AdminLayout from './components/layout/AdminLayout.jsx';

// Public Pages
import Landing from './pages/public/Landing.jsx';
import NotFound from './pages/public/NotFound.jsx';

// Auth Pages
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';

// User Dashboard
import DashboardHome from './pages/dashboard/DashboardHome.jsx';
import MyPortfolios from './pages/dashboard/MyPortfolios.jsx';
import Downloads from './pages/dashboard/Downloads.jsx';
import ProfileSettings from './pages/dashboard/ProfileSettings.jsx';

// Portfolio Wizard & Preview
import PortfolioWizard from './pages/wizard/PortfolioWizard.jsx';
import LivePreview from './pages/preview/LivePreview.jsx';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import AdminTemplates from './pages/admin/AdminTemplates.jsx';
import AdminAnalytics from './pages/admin/AdminAnalytics.jsx';

/* ---- Route Guards ---- */
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="loading-screen"><div className="spinner" /></div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { isAuthenticated, user, isLoading } = useAuth();
  if (isLoading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return children;
}

function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <>
      <style>{`
        .loading-screen {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary);
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
      `}</style>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />

          {/* User Dashboard */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<DashboardHome />} />
            <Route path="portfolios" element={<MyPortfolios />} />
            <Route path="create" element={<PortfolioWizard />} />
            <Route path="edit/:id" element={<PortfolioWizard />} />
            <Route path="preview/:id" element={<LivePreview />} />
            <Route path="downloads" element={<Downloads />} />
            <Route path="settings" element={<ProfileSettings />} />
          </Route>

          {/* Admin Panel */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="templates" element={<AdminTemplates />} />
            <Route path="analytics" element={<AdminAnalytics />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
