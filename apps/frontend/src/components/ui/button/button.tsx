import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type ButtonVariant = 'primary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-on-primary hover:bg-primary-container shadow-level-1 active:scale-[0.98]',
  ghost:
    'bg-transparent text-on-surface-variant border border-outline-variant hover:bg-surface-container-high active:scale-[0.98]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-body-md rounded-default',
  md: 'h-10 px-4 text-body-lg rounded-default',
  lg: 'h-11 px-6 text-body-lg rounded-md',
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-kufi transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
