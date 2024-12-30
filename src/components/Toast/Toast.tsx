import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, ChevronRight } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface ToastProps {
    message: string;
    onClose?: () => void;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export default function Toast({ message, onClose, action, className }: ToastProps) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className={twMerge(
                    'fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 min-w-[320px] max-w-md',
                    'bg-red-500 dark:bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg',
                    className
                )}
            >
                <AlertCircle className="w-5 h-5" />
                <span className="flex-1">{message}</span>
                {action && (
                    <button
                        onClick={action.onClick}
                        className="flex items-center gap-1 hover:underline ml-2 whitespace-nowrap"
                    >
                        {action.label}
                        <ChevronRight className="w-4 h-4" />
                    </button>
                )}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-red-600 dark:hover:bg-red-700 rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </motion.div>
        </AnimatePresence>
    );
}