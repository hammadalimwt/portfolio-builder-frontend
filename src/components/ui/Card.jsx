import React from 'react';

export default function Card({
  children,
  className = '',
  hoverable = false,
  glass = false,
  gradient = false,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`pb-card ${hoverable ? 'pb-card-hoverable' : ''} ${glass ? 'pb-glass' : ''} ${gradient ? 'pb-card-gradient' : ''} ${className}`}
      style={onClick ? { cursor: 'pointer' } : {}}
      {...props}
    >
      <style>{`
        .pb-card {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--space-6);
          box-shadow: var(--shadow-md);
          transition: var(--transition-base);
          overflow: hidden;
          position: relative;
        }
        .pb-card-hoverable:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary-300);
          background-color: var(--bg-card-hover);
        }
        .pb-glass {
          background: var(--gradient-glass);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .pb-card-gradient::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--gradient-primary);
        }
      `}</style>
      {children}
    </div>
  );
}
