import { format, parseISO, isBefore, addDays, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

// Formatear fecha para mostrar
export const formatDate = (dateString, formatStr = 'dd/MM/yyyy') => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, formatStr, { locale: es });
  } catch (error) {
    return dateString;
  }
};

// Formatear fecha completa con día de la semana
export const formatFullDate = (dateString) => {
  return formatDate(dateString, 'EEEE, dd \'de\' MMMM \'de\' yyyy');
};

// Formatear hora
export const formatTime = (timeString) => {
  try {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    return `${displayHour}:${minutes} ${period}`;
  } catch (error) {
    return timeString;
  }
};

// Verificar si una fecha está en el pasado
export const isPastDate = (dateString) => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return isBefore(startOfDay(date), startOfDay(new Date()));
  } catch (error) {
    return false;
  }
};

// Generar próximas fechas disponibles
export const generateAvailableDates = (daysAhead = 30) => {
  const dates = [];
  const today = new Date();
  
  for (let i = 1; i <= daysAhead; i++) {
    const date = addDays(today, i);
    // Excluir domingos (día 0)
    if (date.getDay() !== 0) {
      dates.push({
        fecha: format(date, 'yyyy-MM-dd'),
        disponible: Math.random() > 0.2 // 80% de días con disponibilidad
      });
    }
  }
  
  return dates.filter(d => d.disponible);
};

// Calcular días entre dos fechas
export const daysBetween = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const firstDate = typeof date1 === 'string' ? parseISO(date1) : date1;
  const secondDate = typeof date2 === 'string' ? parseISO(date2) : date2;
  return Math.round(Math.abs((firstDate - secondDate) / oneDay));
};

