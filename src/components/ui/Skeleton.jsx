import React from 'react';

export default function Skeleton({
  variant = 'line',
  width,
  height,
  borderRadius = 'var(--radius-sm)',
  count = 1,
  className = '',
}) {
  const items = Array.from({ length: count });

  return (
    <>
      <style>{`
        .pb-skeleton {
          background: linear-gradient(
            90deg,
            var(--bg-secondary) 25%,
            var(--border) 37%,
            var(--bg-secondary) 63%
          );
          background-size: 400% 100%;
          animation: shimmer 1.4s ease infinite;
        }
        .pb-skeleton-line {
          height: 16px;
          margin-bottom: 8px;
          width: 100%;
        }
        .pb-skeleton-avatar {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-full) !important;
        }
        .pb-skeleton-card {
          height: 200px;
          width: 100%;
          border-radius: var(--radius-lg);
        }
        .pb-skeleton-table-row {
          height: 40px;
          margin-bottom: 4px;
          width: 100%;
        }
      `}</style>
      {items.map((_, i) => (
        <div
          key={i}
          className={`pb-skeleton pb-skeleton-${variant} ${className}`}
          style={{
            width: width,
            height: height,
            borderRadius: borderRadius,
          }}
        />
      ))}
    </>
  );
}
