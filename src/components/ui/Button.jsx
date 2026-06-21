import React from 'react';

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon = null,
  fullWidth = false,
  onClick,
  type = 'button',
  children,
  className = '',
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`pb-btn pb-btn-${variant} pb-btn-${size} ${fullWidth ? 'pb-btn-full' : ''} ${className}`}
      {...props}
    >
      <style>{`
        .pb-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-family);
          font-weight: var(--fw-semibold);
          border-radius: var(--radius-md);
          transition: var(--transition-bounce);
          cursor: pointer;
          border: 1px solid transparent;
          gap: var(--space-2);
          text-decoration: none;
          outline: none;
        }
        .pb-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        /* Variants */
        .pb-btn-primary {
          background: var(--gradient-primary);
          color: white;
          box-shadow: var(--shadow-primary);
        }
        .pb-btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(79,110,247,0.45);
        }
        .pb-btn-primary:active:not(:disabled) {
          transform: translateY(0);
        }
        .pb-btn-secondary {
          background: var(--bg-card);
          color: var(--text-primary);
          border-color: var(--border);
        }
        .pb-btn-secondary:hover:not(:disabled) {
          background: var(--bg-card-hover);
          border-color: var(--text-muted);
        }
        .pb-btn-ghost {
          background: transparent;
          color: var(--text-secondary);
        }
        .pb-btn-ghost:hover:not(:disabled) {
          background: var(--border);
          color: var(--text-primary);
        }
        .pb-btn-danger {
          background: var(--error);
          color: white;
        }
        .pb-btn-danger:hover:not(:disabled) {
          filter: brightness(1.1);
        }
        .pb-btn-outline {
          background: transparent;
          color: var(--primary);
          border-color: var(--primary);
        }
        .pb-btn-outline:hover:not(:disabled) {
          background: var(--primary-50);
          color: var(--primary-600);
        }
        /* Sizes */
        .pb-btn-sm {
          padding: var(--space-2) var(--space-4);
          font-size: var(--font-size-xs);
        }
        .pb-btn-md {
          padding: var(--space-3) var(--space-6);
          font-size: var(--font-size-sm);
        }
        .pb-btn-lg {
          padding: var(--space-4) var(--space-8);
          font-size: var(--font-size-base);
        }
        .pb-btn-full {
          width: 100%;
        }
        .btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
      `}</style>
      {loading && <span className="btn-spinner" />}
      {!loading && Icon && <Icon size={16} />}
      {children}
    </button>
  );
}
