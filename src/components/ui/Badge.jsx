import React from 'react';

export default function Badge({
  children,
  variant = 'primary',
  className = '',
  ...props
}) {
  return (
    <span className={`pb-badge pb-badge-${variant.toLowerCase()} ${className}`} {...props}>
      <style>{`
        .pb-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-1) var(--space-3);
          font-size: 11px;
          font-weight: var(--fw-semibold);
          line-height: 1;
          border-radius: var(--radius-full);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: 1px solid transparent;
        }
        .pb-badge-primary {
          background-color: var(--primary-50);
          color: var(--primary);
          border-color: rgba(79,110,247,0.15);
        }
        .pb-badge-success {
          background-color: var(--success-bg);
          color: var(--success);
          border-color: rgba(34,197,94,0.15);
        }
        .pb-badge-warning {
          background-color: var(--warning-bg);
          color: var(--warning);
          border-color: rgba(245,158,11,0.15);
        }
        .pb-badge-error {
          background-color: var(--error-bg);
          color: var(--error);
          border-color: rgba(239,68,68,0.15);
        }
        .pb-badge-info {
          background-color: var(--info-bg);
          color: var(--info);
          border-color: rgba(6,182,212,0.15);
        }
        /* Status Maps */
        .pb-badge-draft {
          background-color: var(--warning-bg);
          color: var(--warning);
        }
        .pb-badge-completed {
          background-color: var(--success-bg);
          color: var(--success);
        }
        .pb-badge-downloaded {
          background-color: var(--primary-50);
          color: var(--primary);
        }
        .pb-badge-active {
          background-color: var(--success-bg);
          color: var(--success);
        }
        .pb-badge-blocked {
          background-color: var(--error-bg);
          color: var(--error);
        }
      `}</style>
      {children}
    </span>
  );
}
