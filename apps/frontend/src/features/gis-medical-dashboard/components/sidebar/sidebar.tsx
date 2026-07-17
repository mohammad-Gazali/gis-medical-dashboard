import { SidebarPanel } from '../../../../components/ui/sidebar';
import { FilterList } from '../../../../components/ui/filter-list';
import { ChipFilter } from '../../../../components/ui/chip-filter';
import { Button } from '../../../../components/ui/button';
import {
  useGisMedicalStore,
  VehicleFilter,
} from '../../store/gis-medical-store';
import { cn } from '../../../../lib/utils';

const VEHICLE_FILTER_OPTIONS: { id: VehicleFilter; label: string }[] = [
  { id: 'all', label: 'عرض الكل' },
  { id: 'busy', label: 'مشغولة فقط' },
  { id: 'available', label: 'متاحة فقط' },
  { id: 'none', label: 'إخفاء الكل' },
];

interface SidebarProps {
  onStartSimulation: () => void;
  onStopSimulation: () => void;
}

export const Sidebar = ({ onStartSimulation, onStopSimulation }: SidebarProps) => {
  const connected = useGisMedicalStore((s) => s.connected);
  const simulationRunning = useGisMedicalStore((s) => s.simulationRunning);
  const facilityFilters = useGisMedicalStore((s) => s.facilityFilters);
  const regionFilters = useGisMedicalStore((s) => s.regionFilters);
  const vehicleFilter = useGisMedicalStore((s) => s.vehicleFilter);
  const filterDatetime = useGisMedicalStore((s) => s.filterDatetime);
  const toggleFacilityFilter = useGisMedicalStore((s) => s.toggleFacilityFilter);
  const toggleRegionFilter = useGisMedicalStore((s) => s.toggleRegionFilter);
  const setVehicleFilter = useGisMedicalStore((s) => s.setVehicleFilter);
  const setFilterDatetime = useGisMedicalStore((s) => s.setFilterDatetime);

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

        <ChipFilter
          title="المنطقة"
          items={regionFilters}
          onToggle={toggleRegionFilter}
        />

        <div className="space-y-2">
          <h3 className="font-label-caps text-on-surface-variant px-2">
            المركبات
          </h3>
          <div className="grid grid-cols-2 gap-1.5">
            {VEHICLE_FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setVehicleFilter(opt.id)}
                className={cn(
                  'px-3 py-1.5 rounded-default text-xs font-medium border transition-all cursor-pointer',
                  vehicleFilter === opt.id
                    ? 'bg-secondary/15 text-secondary border-secondary/40'
                    : 'bg-surface-container text-on-surface-variant border-outline-variant/50 hover:bg-surface-container-high',
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </SidebarPanel>
  );
};
