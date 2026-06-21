import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger',
}) {
  return (
    <Modal isOpen={isOpen} title={title} onClose={onCancel} size="sm">
      <style>{`
        .pb-confirm-body {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: var(--space-4);
          font-family: var(--font-family);
        }
        .pb-confirm-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          border-radius: var(--radius-full);
          background-color: var(--error-bg);
          color: var(--error);
        }
        .pb-confirm-icon-wrapper-warning {
          background-color: var(--warning-bg);
          color: var(--warning);
        }
        .pb-confirm-message {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .pb-confirm-actions {
          display: flex;
          gap: var(--space-3);
          width: 100%;
          margin-top: var(--space-2);
        }
      `}</style>
      <div className="pb-confirm-body">
        <div className={`pb-confirm-icon-wrapper ${variant === 'warning' ? 'pb-confirm-icon-wrapper-warning' : ''}`}>
          <AlertTriangle size={28} />
        </div>
        <p className="pb-confirm-message">{message}</p>
        <div className="pb-confirm-actions">
          <Button onClick={onCancel} variant="secondary" fullWidth>
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            variant={variant === 'danger' ? 'danger' : 'primary'}
            fullWidth
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
