type ChipStatus = 'operational' | 'warning' | 'critical' | 'idle';

interface StatusChipProps {
  status: ChipStatus;
  label: string;
}

const statusStyles: Record<ChipStatus, { bg: string; text: string; dot: string }> = {
  operational: {
    bg: 'bg-primary-container/15',
    text: 'text-on-primary-container',
    dot: 'bg-on-primary-container',
  },
  warning: {
    bg: 'bg-amber/20',
    text: 'text-amber',
    dot: 'bg-amber',
  },
  critical: {
    bg: 'bg-error-container/30',
    text: 'text-error',
    dot: 'bg-error',
  },
  idle: {
    bg: 'bg-surface-container-high',
    text: 'text-on-surface-variant',
    dot: 'bg-on-surface-variant',
  },
};

export const StatusChip = ({ status, label }: StatusChipProps) => {
  const styles = statusStyles[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-caps ${styles.bg} ${styles.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
      {label}
    </span>
  );
};
