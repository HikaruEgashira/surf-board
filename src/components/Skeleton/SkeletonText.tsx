import { SkeletonBase } from './SkeletonBase';
import { cn } from '../../utils/cn';

interface SkeletonTextProps {
  lines?: number;
  className?: string;
  width?: string | number;
}

export function SkeletonText({ lines = 1, className, width }: SkeletonTextProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBase
          key={i}
          style={{
            width: i === lines - 1 && lines > 1
              ? '80%'
              : typeof width === 'number'
                ? `${width}px`
                : width
          }}
          className="h-4"
        />
      ))}
    </div>
  );
}
