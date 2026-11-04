import { createContext, useContext, useState, useRef, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    if (!message) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    setToast({ message, type, id: Date.now() });

    timerRef.current = setTimeout(() => {
      setToast(null);
    }, duration);
  }, []);

  const hideToast = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[9999] max-w-sm w-full animate-in fade-in slide-in-from-bottom-5 duration-200 pointer-events-auto">
          <div
            className={`flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-md ${
              toast.type === 'error'
                ? 'bg-rose-50 text-rose-900 border-rose-200 shadow-rose-950/10'
                : toast.type === 'info'
                ? 'bg-blue-50 text-blue-900 border-blue-200 shadow-blue-950/10'
                : toast.type === 'warning'
                ? 'bg-amber-50 text-amber-900 border-amber-200 shadow-amber-950/10'
                : 'bg-emerald-50 text-emerald-900 border-emerald-200 shadow-emerald-950/10'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {toast.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              ) : toast.type === 'info' ? (
                <Info className="w-5 h-5 text-blue-600 shrink-0" />
              ) : toast.type === 'warning' ? (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
              <span className="text-xs sm:text-sm font-bold leading-snug break-words">
                {toast.message}
              </span>
            </div>

            <button
              onClick={hideToast}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer shrink-0"
              title="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
};

export default ToastContext;
