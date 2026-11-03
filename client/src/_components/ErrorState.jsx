import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorState = ({ message = 'Could not load products.', onRetry }) => {
  return (
    <div className="py-16 px-4 text-center bg-white rounded-3xl border border-rose-200/80 max-w-md mx-auto my-8 space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div>
        <h3 className="font-bold text-slate-900 text-base">{message}</h3>
        <p className="text-xs text-slate-500 mt-1">
          Something went wrong while communicating with the catalog service.
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;

