import React from 'react';

export default function ProgressBar({
  value = 0,
  label = '',
  showValue = false,
  color = 'var(--primary)',
  className = '',
}) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={`pb-progress-wrapper ${className}`}>
      <style>{`
        .pb-progress-wrapper {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          width: 100%;
          font-family: var(--font-family);
        }
        .pb-progress-info {
          display: flex;
          justify-content: space-between;
          font-size: var(--font-size-xs);
          font-weight: var(--fw-semibold);
          color: var(--text-secondary);
        }
        .pb-progress-track {
          width: 100%;
          height: 8px;
          background-color: var(--border);
          border-radius: var(--radius-full);
          overflow: hidden;
        }
        .pb-progress-fill {
          height: 100%;
          border-radius: var(--radius-full);
          transition: width 0.4s ease-out;
        }
      `}</style>
      {(label || showValue) && (
        <div className="pb-progress-info">
          {label && <span>{label}</span>}
          {showValue && <span>{Math.round(clampedValue)}%</span>}
        </div>
      )}
      <div className="pb-progress-track">
        <div
          className="pb-progress-fill animate-pulse"
          style={{
            width: `${clampedValue}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
