import React from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-primary/50 text-primary';
        let icon = 'info';

        if (toast.type === 'success') {
          borderClass = 'border-emerald-500/60 text-emerald-400';
          icon = 'check_circle';
        } else if (toast.type === 'error') {
          borderClass = 'border-error/60 text-error';
          icon = 'error';
        } else if (toast.type === 'warning') {
          borderClass = 'border-amber-400/60 text-amber-300';
          icon = 'warning';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-surface-container-high/95 backdrop-blur-md border ${borderClass} p-3 rounded-lg shadow-xl flex items-start gap-2.5 transition-all animate-in fade-in slide-in-from-bottom-2 duration-200`}
          >
            <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">
              {icon}
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                {toast.title}
              </div>
              {toast.description && (
                <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  {toast.description}
                </div>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-outline hover:text-on-surface transition-colors p-0.5"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
