import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatTime } from '../../utils/dateHelpers';
import Card from '../common/Card';
import { Calendar, Clock, MapPin, ChevronRight } from 'lucide-react';

const AppointmentCard = ({ appointment }) => {
  const navigate = useNavigate();

  const appointmentDate = appointment.fecha ? new Date(appointment.fecha) : null;
  const isPast = appointmentDate && appointmentDate < new Date();

  const getStatusBadge = () => {
    if (appointment.estado === 'cancelada') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Cancelada
        </span>
      );
    }
    if (isPast) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Completada
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Confirmada
      </span>
    );
  };

  return (
    <Card
      onClick={() => navigate(`/appointments/${appointment.id}`)}
      className="cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        {appointmentDate && (
          <div className="flex items-center space-x-2">
            <Calendar size={20} className="text-primary" />
            <div>
              <p className="text-2xl font-medium text-textPrimary">
                {format(appointmentDate, 'd', { locale: es })}
              </p>
              <p className="text-xs text-textSecondary uppercase">
                {format(appointmentDate, 'MMM', { locale: es })}
              </p>
            </div>
          </div>
        )}
        {getStatusBadge()}
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center space-x-2">
          <Clock size={16} className="text-textSecondary" />
          <p className="text-sm text-textPrimary">
            {appointment.hora ? formatTime(appointment.hora) : 'Hora no especificada'}
          </p>
        </div>

        <p className="text-base font-medium text-textPrimary">
          {appointment.especialidadNombre || appointment.especialidad?.nombre || 'Especialidad no especificada'}
        </p>

        {appointment.doctorNombre && (
          <p className="text-sm text-textSecondary">
            Dr(a). {appointment.doctorNombre}
          </p>
        )}

        {appointment.consultorio && (
          <div className="flex items-center space-x-2">
            <MapPin size={16} className="text-textSecondary" />
            <p className="text-xs text-textSecondary">
              {appointment.consultorio}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end mt-4 pt-3 border-t border-border">
        <span className="text-sm text-primary font-medium flex items-center">
          Ver detalle
          <ChevronRight size={16} className="ml-1" />
        </span>
      </div>
    </Card>
  );
};

export default AppointmentCard;

