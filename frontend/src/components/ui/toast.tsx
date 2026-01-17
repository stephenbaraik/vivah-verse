'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToastStore } from '@/stores/toast-store';
import type { ToastType } from '@/lib/errors';
import { cn } from '@/lib/utils';

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-success" />,
  error: <XCircle className="h-5 w-5 text-error" />,
  warning: <AlertTriangle className="h-5 w-5 text-warning" />,
  info: <Info className="h-5 w-5 text-info" />,
};

const bgMap: Record<ToastType, string> = {
  success: 'bg-success/10 border-success/20',
  error: 'bg-error/10 border-error/20',
  warning: 'bg-warning/10 border-warning/20',
  info: 'bg-info/10 border-info/20',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'flex items-start gap-3 p-4 rounded-lg border shadow-card bg-white',
              bgMap[toast.type]
            )}
          >
            <div className="flex-shrink-0">{iconMap[toast.type]}</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-charcoal">{toast.title}</p>
              {toast.message && (
                <p className="mt-0.5 text-sm text-muted">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 p-1 rounded hover:bg-divider transition-colors"
            >
              <X className="h-4 w-4 text-muted" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
