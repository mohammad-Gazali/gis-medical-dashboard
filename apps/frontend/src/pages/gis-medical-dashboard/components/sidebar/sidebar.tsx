import { SidebarPanel } from '../../../../components/ui/sidebar';
import { FilterList } from '../../../../components/ui/filter-list';
import { Button } from '../../../../components/ui/button';
import { useGisMedicalStore } from '../../../../stores/gis-medical-store';

interface SidebarProps {
  onStartSimulation: () => void;
  onStopSimulation: () => void;
}

export const Sidebar = ({ onStartSimulation, onStopSimulation }: SidebarProps) => {
  const connected = useGisMedicalStore((s) => s.connected);
  const simulationRunning = useGisMedicalStore((s) => s.simulationRunning);
  const facilityFilters = useGisMedicalStore((s) => s.facilityFilters);
  const statusFilters = useGisMedicalStore((s) => s.statusFilters);
  const toggleFacilityFilter = useGisMedicalStore((s) => s.toggleFacilityFilter);
  const toggleStatusFilter = useGisMedicalStore((s) => s.toggleStatusFilter);

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
          items={facilityFilters}
          onToggle={toggleFacilityFilter}
        />
        <FilterList
          title="الحالة"
          items={statusFilters}
          onToggle={toggleStatusFilter}
        />
      </div>
    </SidebarPanel>
  );
};
