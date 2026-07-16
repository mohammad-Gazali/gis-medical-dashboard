import { type ReactNode } from 'react';

interface SidebarPanelProps {
  children: ReactNode;
  className?: string;
}

export const SidebarPanel = ({ children, className = '' }: SidebarPanelProps) => {
  return (
    <aside
      className={`h-screen shrink-0 bg-surface-container-low shadow-level-1 overflow-y-auto ${className}`}
      style={{ width: 'var(--spacing-sidebar, 280px)' }}

    >
      {children}
    </aside>
  );
};
