import { motion } from 'framer-motion';
import { SkeletonIcon, SkeletonText } from '../Skeleton';
import { skeletonFade } from '../../animations';

export default function CodeResultSkeleton() {
  return (
    <motion.div
      className="border-b border-nord-4 dark:border-nord-2 last:border-b-0"
      {...skeletonFade}
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
