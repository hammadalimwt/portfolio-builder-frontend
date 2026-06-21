import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Input({
  label,
  error,
  hint,
  icon: Icon = null,
  type = 'text',
  fullWidth = false,
  className = '',
  id,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`pb-input-wrapper ${fullWidth ? 'pb-input-full' : ''} ${className}`}>
      <style>{`
        .pb-input-wrapper {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
          margin-bottom: var(--space-4);
          font-family: var(--font-family);
          text-align: left;
        }
        .pb-input-full {
          width: 100%;
        }
        .pb-label {
          font-size: var(--font-size-xs);
          font-weight: var(--fw-semibold);
          color: var(--text-secondary);
        }
        .pb-input-container {
          position: relative;
          display: flex;
          align-items: center;
        }
        .pb-input-field {
          width: 100%;
          padding: var(--space-3) var(--space-4);
          background-color: var(--bg-input);
          border: 1px solid var(--border);
          color: var(--text-primary);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          transition: var(--transition-base);
          outline: none;
        }
        .pb-input-field-icon {
          padding-left: var(--space-10);
        }
        .pb-input-field:focus {
          border-color: var(--primary);
          background-color: var(--bg-card);
          box-shadow: 0 0 0 3px rgba(79,110,247,0.15);
        }
        .pb-input-field-error {
          border-color: var(--error);
        }
        .pb-input-field-error:focus {
          border-color: var(--error);
          box-shadow: 0 0 0 3px rgba(239,68,68,0.15);
        }
        .pb-input-icon-left {
          position: absolute;
          left: var(--space-3);
          color: var(--text-muted);
          pointer-events: none;
        }
        .pb-input-toggle-right {
          position: absolute;
          right: var(--space-3);
          color: var(--text-muted);
          cursor: pointer;
          background: none;
          border: none;
          padding: var(--space-1);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pb-input-toggle-right:hover {
          color: var(--text-secondary);
        }
        .pb-error-text {
          font-size: var(--font-size-xs);
          color: var(--error);
          margin-top: 2px;
        }
        .pb-hint-text {
          font-size: var(--font-size-xs);
          color: var(--text-muted);
          margin-top: 2px;
        }
      `}</style>
      {label && <label htmlFor={id} className="pb-label">{label}</label>}
      <div className="pb-input-container">
        {Icon && <Icon className="pb-input-icon-left" size={18} />}
        <input
          id={id}
          type={inputType}
          className={`pb-input-field ${Icon ? 'pb-input-field-icon' : ''} ${error ? 'pb-input-field-error' : ''}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="pb-input-toggle-right"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <span className="pb-error-text">{error}</span>}
      {!error && hint && <span className="pb-hint-text">{hint}</span>}
    </div>
  );
}
