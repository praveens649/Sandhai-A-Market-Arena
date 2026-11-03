import { CheckCircle, AlertCircle, X } from "lucide-react";

const Toast = ({ message, type = "success", onClose }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-bold border ${
          type === "error"
            ? "bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-800"
            : "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800"
        }`}
      >
        {type === "success" ? (
          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
        )}

        <span>{message}</span>

        <button
          onClick={onClose}
          className="ml-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer p-0.5 rounded-md"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
