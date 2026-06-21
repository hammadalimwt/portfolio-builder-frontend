import React from 'react';

export default function Avatar({
  src,
  name = '',
  size = 'md',
  className = '',
  ...props
}) {
  const getInitials = (n) => {
    if (!n) return '';
    const parts = n.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.substring(0, 2).toUpperCase();
  };

  return (
    <div className={`pb-avatar pb-avatar-${size} ${className}`} {...props}>
      <style>{`
        .pb-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-full);
          font-weight: var(--fw-semibold);
          color: white;
          overflow: hidden;
          background: var(--gradient-primary);
          flex-shrink: 0;
        }
        .pb-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .pb-avatar-xs { width: 24px; height: 24px; font-size: 10px; }
        .pb-avatar-sm { width: 32px; height: 32px; font-size: var(--font-size-xs); }
        .pb-avatar-md { width: 40px; height: 40px; font-size: var(--font-size-sm); }
        .pb-avatar-lg { width: 56px; height: 56px; font-size: var(--font-size-base); }
        .pb-avatar-xl { width: 80px; height: 80px; font-size: var(--font-size-2xl); }
      `}</style>
      {src ? (
        <img src={src} alt={name || 'User avatar'} onError={(e) => { e.target.style.display = 'none'; }} />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}
