import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-kufi transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-on-primary hover:bg-primary-container shadow-level-1',
        destructive:
          'bg-error text-on-error hover:bg-error-container shadow-level-1',
        ghost:
          'bg-transparent text-on-surface-variant border border-outline-variant hover:bg-surface-container-high',
      },
      size: {
        sm: 'h-8 px-3 text-body-md rounded-default',
        md: 'h-10 px-4 text-body-lg rounded-default',
        lg: 'h-11 px-6 text-body-lg rounded-md',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
}

export const Button = ({
  variant,
  size,
  children,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </button>
  );
};
