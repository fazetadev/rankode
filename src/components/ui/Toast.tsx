import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { ToastMessage } from '../../types';

function ToastItem({ toast }: { toast: ToastMessage }) {
  const removeToast = useAppStore((s) => s.removeToast);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      removeToast(toast.id);
    }, 3800);
    return () => window.clearTimeout(timer);
  }, [toast.id, removeToast]);

  const icon =
    toast.variant === 'success' ? (
      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
    ) : toast.variant === 'error' ? (
      <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
    ) : (
      <Info className="h-4 w-4 text-[#8B5CF6] shrink-0" />
    );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.18 }}
      role="status"
      className="flex w-80 items-start gap-3 rounded-lg border border-[#27272A] bg-[#18181B] p-3.5"
    >
      <div className="mt-0.5">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[#FAFAFA]">{toast.title}</p>
        {toast.description && (
          <p className="mt-0.5 text-xs text-[#A1A1AA]">{toast.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => removeToast(toast.id)}
        aria-label="Descartar notificación"
        className="rounded p-1 text-[#71717A] hover:text-[#FAFAFA]"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const toasts = useAppStore((s) => s.toasts);

  return (
    <div className="pointer-events-none fixed bottom-20 right-4 z-50 flex flex-col gap-2 md:bottom-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
