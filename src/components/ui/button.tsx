import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'onDark';
export type ButtonSize = 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 ease-out-soft disabled:pointer-events-none disabled:opacity-55';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-ink-900 text-stone-50 hover:bg-ink-700 hover:shadow-lift active:scale-[0.98]',
  secondary:
    'border border-ink-900/15 bg-white text-ink-900 hover:border-ink-900/35 hover:shadow-lift active:scale-[0.98]',
  ghost: 'text-ink-900 hover:bg-ink-900/5',
  onDark:
    'bg-brass-500 text-ink-950 hover:bg-brass-400 hover:shadow-lift active:scale-[0.98]',
};

const sizes: Record<ButtonSize, string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

/**
 * Same klasy, bez komponentu - żeby dokładać je bezpośrednio do `Link`
 * z next-intl albo do zwykłego `<a>` bez owijania w kolejny wrapper.
 */
export function buttonStyles(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  return <button className={buttonStyles(variant, size, className)} {...props} />;
}
