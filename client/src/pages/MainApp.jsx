import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useStore } from '../context/StoreContext';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const MainApp = () => {
  const { feedback } = useStore();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Sticky Navbar wired with React Router NavLinks */}
      <Navbar />

      {/* Floating Feedback Notification */}
      {feedback?.message && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-bold border ${
              feedback.type === 'error'
                ? 'bg-rose-50 text-rose-800 border-rose-300'
                : 'bg-emerald-50 text-emerald-800 border-emerald-300'
            }`}
          >
            {feedback.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        </div>
      )}

      {/* Main Routed Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainApp;
