import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isBefore, startOfDay, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DateCalendar = ({ availableDates, selectedDate, onSelectDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const isDateAvailable = (date) => {
    if (!availableDates || availableDates.length === 0) return true;
    return availableDates.some(d => {
      try {
        const availableDate = new Date(d.fecha);
        return isSameDay(availableDate, date) && d.disponible;
      } catch {
        return false;
      }
    });
  };

  const isDateDisabled = (date) => {
    return isBefore(date, startOfDay(new Date())) || !isDateAvailable(date);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Mes anterior"
          type="button"
        >
          <ChevronLeft size={20} />
        </button>
        
        <h3 className="text-lg font-medium text-textPrimary capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </h3>
        
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Mes siguiente"
          type="button"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Week days */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-textSecondary py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Espacios vacíos para el primer día del mes */}
        {Array.from({ length: monthStart.getDay() }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        
        {/* Días del mes */}
        {daysInMonth.map(date => {
          const disabled = isDateDisabled(date);
          const selected = selectedDate && isSameDay(date, new Date(selectedDate));
          const today = isToday(date);

          return (
            <button
              key={date.toISOString()}
              onClick={() => !disabled && onSelectDate(format(date, 'yyyy-MM-dd'))}
              disabled={disabled}
              type="button"
              className={`
                aspect-square rounded-lg text-sm font-medium
                transition-all duration-200 min-h-[44px]
                ${disabled 
                  ? 'text-disabled cursor-not-allowed bg-backgroundGray' 
                  : 'text-textPrimary hover:bg-primaryLight cursor-pointer'}
                ${selected 
                  ? 'bg-primary text-white hover:bg-primaryDark' 
                  : ''}
                ${today && !selected 
                  ? 'border-2 border-primary' 
                  : 'border border-border'}
              `}
              aria-label={format(date, 'dd MMMM yyyy', { locale: es })}
              aria-pressed={selected}
            >
              {format(date, 'd')}
            </button>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-center space-x-4 text-xs text-textSecondary">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded border-2 border-primary mr-2" />
            <span>Hoy</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-primary mr-2" />
            <span>Seleccionado</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-backgroundGray border border-border mr-2" />
            <span>No disponible</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateCalendar;

