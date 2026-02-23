import { useEffect } from 'react';
import { useToastStore } from '../stores/toastStore';

const TOAST_CSS = `
.toast-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}

.toast {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-left: 4px solid var(--red);
  border-radius: 12px;
  padding: 16px 20px;
  min-width: 320px;
  max-width: 400px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  animation: slideInRight 0.3s ease-out;
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toast:hover {
  transform: translateX(-4px);
}

.toast.success {
  border-left-color: var(--green);
}

.toast.error {
  border-left-color: var(--red);
}

.toast.warning {
  border-left-color: var(--gold);
}

.toast.info {
  border-left-color: #4A9EFF;
}

.toast-icon {
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.toast-content {
  flex: 1;
}

.toast-message {
  color: var(--white);
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}

.toast-close {
  background: transparent;
  border: none;
  color: var(--muted);
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: color 0.2s;
}

.toast-close:hover {
  color: var(--white);
}

@keyframes slideInRight {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(400px);
    opacity: 0;
  }
}

.toast.removing {
  animation: slideOutRight 0.2s ease-out forwards;
}

@media (max-width: 768px) {
  .toast-container {
    top: 60px;
    right: 12px;
    left: 12px;
  }
  
  .toast {
    min-width: unset;
    max-width: unset;
  }
}
`;

function ToastItem({ toast, onRemove }) {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <div 
      className={`toast ${toast.type}`}
      onClick={() => onRemove(toast.id)}
    >
      <div className="toast-icon">
        {icons[toast.type] || icons.info}
      </div>
      <div className="toast-content">
        <div className="toast-message">{toast.message}</div>
      </div>
      <button 
        className="toast-close"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(toast.id);
        }}
      >
        ×
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  if (toasts.length === 0) return null;

  return (
    <>
      <style>{TOAST_CSS}</style>
      <div className="toast-container">
        {toasts.map(toast => (
          <ToastItem 
            key={toast.id} 
            toast={toast} 
            onRemove={removeToast}
          />
        ))}
      </div>
    </>
  );
}