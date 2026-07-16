import { useState } from 'react';
import { SidebarPanel } from '../../../../components/ui/sidebar';
import { FilterList } from '../../../../components/ui/filter-list';
import { Button } from '../../../../components/ui/button';

const facilityTypes = [
  { id: 'hospital', label: 'مستشفيات', checked: true },
  { id: 'clinic', label: 'عيادات', checked: true },
  { id: 'field-station', label: 'نقاط إسعاف ميدانية', checked: true },
];

const statusFilters = [
  { id: 'operational', label: 'تشغيلي', checked: true },
  { id: 'warning', label: 'تحذير', checked: true },
  { id: 'critical', label: 'حرج', checked: true },
];

interface SidebarProps {
  connected: boolean;
  simulationRunning: boolean;
  onStartSimulation: () => void;
  onStopSimulation: () => void;
}

export const Sidebar = ({
  connected,
  simulationRunning,
  onStartSimulation,
  onStopSimulation,
}: SidebarProps) => {
  const [facilities, setFacilities] = useState(facilityTypes);
  const [statuses, setStatuses] = useState(statusFilters);

  const toggleFacility = (id: string) =>
    setFacilities((prev) =>
      prev.map((f) => (f.id === id ? { ...f, checked: !f.checked } : f)),
    );

  const toggleStatus = (id: string) =>
    setStatuses((prev) =>
      prev.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s)),
    );

  return (
    <SidebarPanel>
      <div className="flex flex-col gap-6 p-4">
        <h2 className="font-headline-sm text-on-surface">لوحة التحكم</h2>
        <hr className="border-outline-variant" />

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}
            />
            <span className="text-xs text-on-surface-variant">
              {connected ? 'متصل' : 'غير متصل'}
            </span>
          </div>
          <Button
            variant={simulationRunning ? 'destructive' : 'primary'}
            onClick={simulationRunning ? onStopSimulation : onStartSimulation}
            className="w-full"
          >
            {simulationRunning ? 'إيقاف المحاكاة' : 'تشغيل المحاكاة'}
          </Button>
        </div>

        <hr className="border-outline-variant" />

        <FilterList
          title="نوع المرفق"
          items={facilities}
          onToggle={toggleFacility}
        />
        <FilterList
          title="الحالة"
          items={statuses}
          onToggle={toggleStatus}
        />
      </div>
    </SidebarPanel>
  );
};
