import { cn } from '../../../lib/utils';

interface ChipFilterItem {
  id: string;
  label: string;
  checked: boolean;
}

interface ChipFilterProps {
  title: string;
  items: ChipFilterItem[];
  onToggle: (id: string) => void;
}

export const ChipFilter = ({ title, items, onToggle }: ChipFilterProps) => {
  return (
    <div className="space-y-2">
      <h3 className="font-label-caps text-on-surface-variant px-2">{title}</h3>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onToggle(item.id)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer',
              item.checked
                ? 'bg-secondary/15 text-secondary border-secondary/40'
                : 'bg-surface-container text-on-surface-variant border-outline-variant/50 hover:bg-surface-container-high',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
