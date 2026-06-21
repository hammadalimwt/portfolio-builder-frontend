import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

let toastIndex = 0;
const listeners = new Set();

export const toast = {
  show(message, type = 'info', duration = 4000) {
    const id = ++toastIndex;
    listeners.forEach((listener) => listener({ id, message, type, duration }));
  },
  success(message, duration) { this.show(message, 'success', duration); },
  error(message, duration) { this.show(message, 'error', duration); },
  info(message, duration) { this.show(message, 'info', duration); },
  warning(message, duration) { this.show(message, 'warning', duration); },
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (newToast) => {
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, newToast.duration);
    };

    listeners.add(handleToast);
    return () => listeners.delete(handleToast);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={18} className="toast-icon-success" />;
      case 'warning': return <AlertTriangle size={18} className="toast-icon-warning" />;
      case 'error': return <AlertCircle size={18} className="toast-icon-error" />;
      default: return <Info size={18} className="toast-icon-info" />;
    }
  };

  return (
    <div className="pb-toast-container">
      <style>{`
        .pb-toast-container {
          position: fixed;
          top: var(--space-6);
          right: var(--space-6);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          z-index: var(--z-toast);
          max-width: 380px;
          width: calc(100% - var(--space-12));
          pointer-events: none;
        }
        .pb-toast {
          display: flex;
          align-items: flex-start;
          gap: var(--space-3);
          padding: var(--space-4);
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-xl);
          pointer-events: auto;
          animation: toastIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          position: relative;
        }
        .pb-toast::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          border-radius: var(--radius-sm) 0 0 var(--radius-sm);
        }
        .pb-toast-success::before { background-color: var(--success); }
        .pb-toast-error::before { background-color: var(--error); }
        .pb-toast-warning::before { background-color: var(--warning); }
        .pb-toast-info::before { background-color: var(--info); }

        .toast-icon-success { color: var(--success); }
        .toast-icon-error { color: var(--error); }
        .toast-icon-warning { color: var(--warning); }
        .toast-icon-info { color: var(--info); }

        .pb-toast-content {
          flex-grow: 1;
          font-family: var(--font-family);
          font-size: var(--font-size-sm);
          color: var(--text-primary);
          line-height: 1.4;
        }
        .pb-toast-close {
          color: var(--text-muted);
          cursor: pointer;
          transition: var(--transition-fast);
          padding: 2px;
          border-radius: var(--radius-sm);
        }
        .pb-toast-close:hover {
          background-color: var(--border);
          color: var(--text-primary);
        }
      `}</style>
      {toasts.map((t) => (
        <div key={t.id} className={`pb-toast pb-toast-${t.type}`}>
          {getIcon(t.type)}
          <div className="pb-toast-content">{t.message}</div>
          <button className="pb-toast-close" onClick={() => removeToast(t.id)}>
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
