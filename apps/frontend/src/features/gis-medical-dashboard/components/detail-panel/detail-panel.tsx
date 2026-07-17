import { MedicalFacilityType } from '@gis-medical/shared';
import { useGisMedicalStore } from '../../store/gis-medical-store';

const FACILITY_TYPE_AR: Record<MedicalFacilityType, string> = {
  [MedicalFacilityType.HOSPITAL]: 'مستشفى',
  [MedicalFacilityType.CLINIC]: 'عيادة',
  [MedicalFacilityType.FIELD_MEDICAL_STATION]: 'نقطة ميدانية',
};

export const DetailPanel = () => {
  const selectedItem = useGisMedicalStore((s) => s.selectedItem);
  const setSelectedItem = useGisMedicalStore((s) => s.setSelectedItem);

  if (!selectedItem) return null;

  return (
    <div className="absolute top-4 left-4 z-10 w-72 bg-surface/95 backdrop-blur-sm rounded-xl shadow-lg border border-outline-variant/30">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-sm text-on-surface">
            {selectedItem.kind === 'facility' ? 'تفاصيل المرفق' : 'تفاصيل المركبة'}
          </h2>
          <button
            onClick={() => setSelectedItem(null)}
            className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <hr className="border-outline-variant" />

        {selectedItem.kind === 'facility' && (
          <div className="flex flex-col gap-3">
            <div>
              <span className="text-xs text-on-surface-variant">الاسم</span>
              <p className="text-body-lg text-on-surface font-medium">{selectedItem.name}</p>
            </div>

            <div>
              <span className="text-xs text-on-surface-variant">النوع</span>
              <p className="text-body-lg text-on-surface">{FACILITY_TYPE_AR[selectedItem.type]}</p>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <span className="text-xs text-on-surface-variant">إجمالي الأسرّة</span>
                <p className="text-headline-sm text-on-surface">{selectedItem.totalBeds}</p>
              </div>
              <div className="flex-1">
                <span className="text-xs text-on-surface-variant">الأسرّة المتاحة</span>
                <p className="text-headline-sm text-on-surface">{selectedItem.availableBeds}</p>
              </div>
            </div>

            <div className="w-full bg-surface-container-high rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full transition-all duration-500"
                style={{
                  width: `${(selectedItem.availableBeds / selectedItem.totalBeds) * 100}%`,
                  backgroundColor:
                    selectedItem.availableBeds / selectedItem.totalBeds > 0.5
                      ? '#38A169'
                      : selectedItem.availableBeds / selectedItem.totalBeds > 0.2
                        ? '#F6AD55'
                        : '#E53E3E',
                }}
              />
            </div>
            <span className="text-xs text-on-surface-variant text-center">
              {Math.round((selectedItem.availableBeds / selectedItem.totalBeds) * 100)}% متاح
            </span>
          </div>
        )}

        {selectedItem.kind === 'vehicle' && (
          <div className="flex flex-col gap-3">
            <div>
              <span className="text-xs text-on-surface-variant">رقم اللوحة</span>
              <p className="text-headline-sm text-on-surface">{selectedItem.plateNumber}</p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`h-3 w-3 rounded-full ${selectedItem.isBusy ? 'bg-red-500' : 'bg-green-500'}`}
              />
              <span className="text-body-lg text-on-surface">
                {selectedItem.isBusy ? 'مشغول' : 'متاح'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
