import { type HTMLAttributes, type ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  elevated?: boolean;
}

export const Card = ({
  children,
  elevated = false,
  className = '',
  ...props
}: CardProps) => {
  return (
    <div
      className={`glassmorphism rounded-lg p-card-padding ${elevated ? 'shadow-level-2' : 'shadow-level-1'} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
