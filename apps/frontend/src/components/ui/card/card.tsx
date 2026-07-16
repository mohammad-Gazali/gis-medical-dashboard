import { type HTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

const cardVariants = cva(
  'glassmorphism rounded-lg p-card-padding transition-shadow',
  {
    variants: {
      elevated: {
        true: 'shadow-level-2',
        false: 'shadow-level-1',
      },
    },
    defaultVariants: {
      elevated: false,
    },
  }
);

interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: ReactNode;
}

export const Card = ({ children, elevated, className, ...props }: CardProps) => {
  return (
    <div className={cn(cardVariants({ elevated, className }))} {...props}>
      {children}
    </div>
  );
};
