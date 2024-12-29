import { motion } from 'framer-motion';
import { SkeletonIcon, SkeletonText } from '../Skeleton';

export default function CodeResultSkeleton() {
  // 実際のCodeResultと同じ構造とパディングを使用
  return (
    <motion.div
      className="border-b border-nord-4 dark:border-nord-2 last:border-b-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.3,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
    >
      <div className="py-3">
        {/* CodeHeaderと同じ構造 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2 px-3">
          <div className="flex items-center gap-2 min-w-0">
            <SkeletonIcon size={16} />
            <SkeletonText width={160} />
          </div>
          <div className="flex items-center gap-3">
            <SkeletonText width={200} />
            <div className="flex items-center gap-3">
              <SkeletonText width={40} />
              <SkeletonText width={40} />
            </div>
          </div>
        </div>

        {/* CodeSnippetと同じ構造で、平均的なマッチ数（2つ）を表示 */}
        {[1, 2].map((_, index) => (
          <div key={index} className="font-mono text-sm overflow-x-auto px-3 mt-2">
            <div className="space-y-1">
              <SkeletonText width="100%" />
              <SkeletonText width="95%" />
              <SkeletonText width="90%" />
              <SkeletonText width="85%" />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
