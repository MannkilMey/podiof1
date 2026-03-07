import { useEffect } from 'react';
import { useToastStore } from '../stores/toastStore';
import { useThemeStore } from '../stores/themeStore';

const TOAST_CSS = `
/* Variables para temas */
[data-theme="dark"] {
  --toast-bg: #111114;
  --toast-bg-hover: #18181D;
  --toast-border: rgba(255,255,255,0.13);
  --toast-text: #F0F0F0;
  --toast-muted: rgba(240,240,240,0.40);
  --toast-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  --toast-red: #E8002D;
  --toast-green: #00D4A0;
  --toast-gold: #C9A84C;
  --toast-blue: #4A9EFF;
}

[data-theme="light"] {
  --toast-bg: #FFFFFF;
  --toast-bg-hover: #F5F6F8;
  --toast-border: rgba(0,0,0,0.18);
  --toast-text: #1A1B1E;
  --toast-muted: rgba(26,27,30,0.55);
  --toast-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  --toast-red: #D40029;
  --toast-green: #007F5F;
  --toast-gold: #9C6F10;
  --toast-blue: #2563EB;
}

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
  background: var(--toast-bg);
  border: 1px solid var(--toast-border);
  border-left: 4px solid var(--toast-red);
  border-radius: 12px;
  padding: 16px 20px;
  min-width: 320px;
  max-width: 400px;
  box-shadow: var(--toast-shadow);
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
  background: var(--toast-bg-hover);
}

.toast.success {
  border-left-color: var(--toast-green);
}

.toast.error {
  border-left-color: var(--toast-red);
}

.toast.warning {
  border-left-color: var(--toast-gold);
}

.toast.info {
  border-left-color: var(--toast-blue);
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
  color: var(--toast-text);
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}

.toast-close {
  background: transparent;
  border: none;
  color: var(--toast-muted);
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
  color: var(--toast-text);
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
  const theme = useThemeStore((state) => state.theme);

  if (toasts.length === 0) return null;

  return (
    <>
      <style>{TOAST_CSS}</style>
      <div className="toast-container" data-theme={theme}>
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