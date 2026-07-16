import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

const statusChipVariants = cva(
  'inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-caps',
  {
    variants: {
      status: {
        operational: 'bg-primary-container/15 text-on-primary-container',
        warning: 'bg-amber/20 text-amber',
        critical: 'bg-error-container/30 text-error',
        idle: 'bg-surface-container-high text-on-surface-variant',
      },
    },
    defaultVariants: {
      status: 'idle',
    },
  }
);

const dotVariants = cva('w-1.5 h-1.5 rounded-full', {
  variants: {
    status: {
      operational: 'bg-on-primary-container',
      warning: 'bg-amber',
      critical: 'bg-error',
      idle: 'bg-on-surface-variant',
    },
  },
  defaultVariants: {
    status: 'idle',
  },
});

interface StatusChipProps extends VariantProps<typeof statusChipVariants> {
  label: string;
}

export const StatusChip = ({ status, label }: StatusChipProps) => {
  return (
    <span className={cn(statusChipVariants({ status }))}>
      <span className={cn(dotVariants({ status }))} />
      {label}
    </span>
  );
};
