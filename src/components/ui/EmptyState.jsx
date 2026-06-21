import React from 'react';
import Button from './Button';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`pb-empty-state ${className}`}>
      <style>{`
        .pb-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: var(--space-12) var(--space-6);
          background-color: var(--bg-card);
          border: 1px dashed var(--border);
          border-radius: var(--radius-lg);
          max-width: 500px;
          margin: 0 auto;
        }
        .pb-empty-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          border-radius: var(--radius-full);
          background: var(--gradient-card);
          color: var(--primary);
          margin-bottom: var(--space-4);
        }
        .pb-empty-title {
          font-size: var(--font-size-lg);
          font-weight: var(--fw-bold);
          color: var(--text-primary);
          margin-bottom: var(--space-2);
        }
        .pb-empty-description {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          margin-bottom: var(--space-6);
          line-height: 1.5;
        }
      `}</style>
      <div className="pb-empty-icon-wrapper">
        {Icon && <Icon size={28} />}
      </div>
      <h3 className="pb-empty-title">{title}</h3>
      <p className="pb-empty-description">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
