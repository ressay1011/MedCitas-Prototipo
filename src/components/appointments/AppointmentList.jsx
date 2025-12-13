import { format, parseISO, isAfter, startOfDay } from 'date-fns';
import AppointmentCard from './AppointmentCard';
import { Calendar } from 'lucide-react';

const AppointmentList = ({ appointments }) => {
  const today = startOfDay(new Date());

  // Separar citas en próximas e historial
  const upcomingAppointments = appointments.filter(apt => {
    if (!apt.fecha) return false;
    const aptDate = startOfDay(new Date(apt.fecha));
    return isAfter(aptDate, today) || aptDate.getTime() === today.getTime();
  });

  const pastAppointments = appointments.filter(apt => {
    if (!apt.fecha) return false;
    const aptDate = startOfDay(new Date(apt.fecha));
    return aptDate < today && apt.estado !== 'cancelada';
  });

  const cancelledAppointments = appointments.filter(apt => apt.estado === 'cancelada');

  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-16 h-16 rounded-full bg-backgroundGray flex items-center justify-center mb-4">
          <Calendar size={32} className="text-textSecondary" />
        </div>
        <p className="text-lg font-bold text-textPrimary mb-2">
          No tienes citas programadas
        </p>
        <p className="text-sm text-textSecondary text-center">
          Agenda tu primera cita médica ahora
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Próximas citas */}
      {upcomingAppointments.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-textPrimary mb-4">
            Próximas citas
          </h2>
          <div className="space-y-4">
            {upcomingAppointments.map(appointment => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        </div>
      )}

      {/* Historial */}
      {(pastAppointments.length > 0 || cancelledAppointments.length > 0) && (
        <div>
          <h2 className="text-lg font-bold text-textPrimary mb-4">
            Historial
          </h2>
          <div className="space-y-4">
            {[...pastAppointments, ...cancelledAppointments].map(appointment => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;

