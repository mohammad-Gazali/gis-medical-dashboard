import { useState } from 'react';
import { SidebarPanel } from '../../../../components/ui/sidebar';
import { FilterList } from '../../../../components/ui/filter-list';

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

export const Sidebar = () => {
  const [facilities, setFacilities] = useState(facilityTypes);
  const [statuses, setStatuses] = useState(statusFilters);

  const toggleFacility = (id: string) =>
    setFacilities((prev) =>
      prev.map((f) => (f.id === id ? { ...f, checked: !f.checked } : f))
    );

  const toggleStatus = (id: string) =>
    setStatuses((prev) =>
      prev.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s))
    );

  return (
    <SidebarPanel>
      <div className="flex flex-col gap-6 p-4">
        <h2 className="font-headline-sm text-on-surface">لوحة التحكم</h2>
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
