import React, { useEffect, useState } from 'react';


export default function AppToast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (event) => {
      const detail = event.detail || {};
      const id = Date.now() + Math.random();

      const newToast = {
        id,
        message: detail.message || 'Thông báo',
        type: detail.type || 'info',
      };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 2800);
    };

    window.addEventListener('app-toast', handler);
    return () => window.removeEventListener('app-toast', handler);
  }, []);

  const getStyle = (type) => {
    switch (type) {
      case 'success':
        return {
          box: 'bg-green-50 border-green-200 text-green-700',
          icon: '✅',
        };
      case 'error':
        return {
          box: 'bg-red-50 border-red-200 text-red-600',
          icon: '❌',
        };
      case 'warning':
        return {
          box: 'bg-yellow-50 border-yellow-200 text-yellow-700',
          icon: '⚠️',
        };
      default:
        return {
          box: 'bg-blue-50 border-blue-200 text-blue-700',
          icon: 'ℹ️',
        };
    }
  };

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 w-[360px] max-w-[90vw]">
      {toasts.map((toast) => {
        const style = getStyle(toast.type);

        return (
          <div
            key={toast.id}
            className={`border shadow-xl rounded-2xl px-4 py-4 flex items-start gap-3 animate-[fadeIn_.25s_ease] ${style.box}`}
          >
            <div className="text-2xl shrink-0">{style.icon}</div>

            <div className="flex-1">
              <p className="font-bold text-base leading-7">
                {toast.message}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}