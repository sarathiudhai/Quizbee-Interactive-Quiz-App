import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { HiCheckCircle, HiXCircle, HiExclamation, HiInformationCircle } from 'react-icons/hi';
import './Toast.css';

const ToastContext = createContext(null);

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type, duration }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container" id="toast-container">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onClose }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onClose, 300);
    }, toast.duration - 300);
    return () => clearTimeout(timer);
  }, [toast.duration, onClose]);

  const icons = {
    success: <HiCheckCircle />,
    error: <HiXCircle />,
    warning: <HiExclamation />,
    info: <HiInformationCircle />
  };

  return (
    <div className={`toast toast-${toast.type} ${exiting ? 'toast-exit' : ''}`}>
      <span className="toast-icon">{icons[toast.type]}</span>
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close" onClick={() => { setExiting(true); setTimeout(onClose, 300); }}>×</button>
    </div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
