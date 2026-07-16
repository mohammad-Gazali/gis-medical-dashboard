interface FilterItem {
  id: string;
  label: string;
  checked: boolean;
}

interface FilterListProps {
  title: string;
  items: FilterItem[];
  onToggle: (id: string) => void;
}

export const FilterList = ({ title, items, onToggle }: FilterListProps) => {
  return (
    <div className="space-y-2">
      <h3 className="font-label-caps text-on-surface-variant px-2">{title}</h3>
      <ul className="space-y-0.5">
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => onToggle(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-default border border-blue-200 text-body-md transition-all ${
                item.checked
                  ? 'bg-filter-active-bg hover:bg-filter-active-bg-hover text-primary font-semibold border-r-4 border-r-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span
                className={`flex-shrink-0 w-4 h-4 rounded-sm border-2 flex items-center justify-center ${
                  item.checked ? 'bg-primary border-primary' : 'border-outline-variant'
                }`}
              >
                {item.checked && (
                  <svg
                    className="w-3 h-3 text-on-primary"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
