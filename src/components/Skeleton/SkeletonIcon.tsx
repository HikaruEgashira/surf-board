import { SkeletonBase } from './SkeletonBase';
import { cn } from '../../utils/cn';

interface SkeletonIconProps {
  size?: number;
  className?: string;
}

export function SkeletonIcon({ size = 20, className }: SkeletonIconProps) {
  return (
    <SkeletonBase
      className={cn('rounded-md flex-shrink-0', className)}
      style={{ width: size, height: size }}
    />
  );
}
