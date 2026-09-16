import type { ElementType, ReactNode } from 'react';

import { cn } from '@/lib/cn';

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  size?: 'default' | 'narrow' | 'wide';
};

const sizes = {
  narrow: 'max-w-3xl',
  default: 'max-w-6xl',
  wide: 'max-w-7xl',
} as const;

export function Container({
  children,
  className,
  as: Tag = 'div',
  size = 'default',
}: ContainerProps) {
  return (
    <Tag className={cn('mx-auto w-full px-5 sm:px-8', sizes[size], className)}>
      {children}
    </Tag>
  );
}
