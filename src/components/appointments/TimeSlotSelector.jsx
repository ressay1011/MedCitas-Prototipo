import { formatFullDate, formatTime } from '../../utils/dateHelpers';

const TimeSlotSelector = ({ fecha, doctor, slots, selectedTime, onSelectTime }) => {
  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-medium text-textPrimary mb-1">
          Horarios disponibles
        </h3>
        {fecha && (
          <p className="text-sm text-textSecondary capitalize">
            {formatFullDate(fecha)}
          </p>
        )}
        {doctor && (
          <p className="text-sm text-textSecondary mt-1">
            Dr(a). {doctor.nombre}
          </p>
        )}
      </div>

      {/* Grid de horarios */}
      <div className="grid grid-cols-2 gap-3">
        {slots && slots.length > 0 ? (
          slots.map((slot) => {
            const isSelected = selectedTime === slot.hora;

            return (
              <button
                key={slot.hora}
                onClick={() => onSelectTime(slot.hora)}
                type="button"
                className={`
                  min-h-[48px] px-4 py-3
                  rounded-lg
                  font-medium text-base
                  transition-all duration-200
                  ${isSelected
                    ? 'bg-primary text-white border-2 border-primary'
                    : 'bg-white text-textPrimary border-2 border-border hover:border-primary'}
                `}
                aria-pressed={isSelected}
                aria-label={`Seleccionar horario ${formatTime(slot.hora)}`}
              >
                {formatTime(slot.hora)}
              </button>
            );
          })
        ) : (
          <div className="col-span-2 text-center py-8 text-textSecondary">
            <p>No hay horarios disponibles para esta fecha</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeSlotSelector;

