import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  title,
  onClose,
  children,
  size = 'md',
  className = '',
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="pb-modal-overlay animate-fadeIn" onClick={onClose}>
      <style>{`
        .pb-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(10,11,20,0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: var(--space-4);
          transition: left 0.3s ease;
        }
        @media (min-width: 1024px) {
          .pb-modal-overlay {
            left: 240px; /* Offset overlay by dashboard sidebar width on desktop */
          }
        }
        .pb-modal-card {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-2xl);
          width: 100%;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          outline: none;
          position: relative;
        }
        .pb-modal-card-sm { max-width: 480px; }
        .pb-modal-card-md { max-width: 640px; }
        .pb-modal-card-lg { max-width: 800px; }
        .pb-modal-card-xl { max-width: 1024px; }
        .pb-modal-card-xxl { max-width: 1400px; width: 95%; height: 90vh; }

        .pb-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4) var(--space-6);
          border-bottom: 1px solid var(--border);
        }
        .pb-modal-title {
          font-size: var(--font-size-lg);
          font-weight: var(--fw-bold);
          color: var(--text-primary);
        }
        .pb-modal-close-btn {
          color: var(--text-secondary);
          padding: var(--space-1);
          border-radius: var(--radius-sm);
          transition: var(--transition-fast);
        }
        .pb-modal-close-btn:hover {
          background-color: var(--border);
          color: var(--text-primary);
        }
        .pb-modal-body {
          padding: var(--space-6);
          overflow-y: auto;
          flex-grow: 1;
        }
      `}</style>
      <div
        className={`pb-modal-card pb-modal-card-${size} animate-scaleIn ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pb-modal-header">
          <h3 className="pb-modal-title">{title}</h3>
          <button className="pb-modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>
        <div className="pb-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
