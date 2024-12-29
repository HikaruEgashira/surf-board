import type { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface SkeletonBaseProps extends HTMLAttributes<HTMLDivElement> {
  animate?: boolean;
}

export function SkeletonBase({ className, animate = true, ...props }: SkeletonBaseProps) {
  return (
    <motion.div
      className={cn(
        'bg-gray-200 dark:bg-gray-700 rounded-md',
        animate && 'animate-pulse',
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      {...(props as any)}
    />
  );
}
