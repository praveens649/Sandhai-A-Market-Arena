import { AlertTriangle } from "lucide-react";

const ConfirmDialog = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">{title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{message}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/25 transition-all cursor-pointer"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
