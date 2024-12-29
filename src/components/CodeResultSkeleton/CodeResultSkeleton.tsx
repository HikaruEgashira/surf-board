import { motion } from 'framer-motion';
import { SkeletonIcon, SkeletonText } from '../Skeleton';

export default function CodeResultSkeleton() {
  return (
    <motion.div
      className="border-b border-nord-4/30 dark:border-nord-2/30 last:border-b-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.3,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
    >
      <div className="py-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 mb-2 px-3">
          <div className="flex items-center gap-2 min-w-0">
            <SkeletonIcon size={16} />
            <SkeletonText width={192} />
            <SkeletonText width={64} />
          </div>
          <SkeletonText width={256} />
        </div>

        <div className="font-mono text-sm overflow-x-auto px-3 mt-2">
          <div className="space-y-2">
            <SkeletonText width="100%" />
            <SkeletonText width="92%" />
            <SkeletonText width="85%" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
