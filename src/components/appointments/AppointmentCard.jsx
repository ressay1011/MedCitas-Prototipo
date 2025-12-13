import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatTime } from '../../utils/dateHelpers';
import Card from '../common/Card';
import { ChevronRight } from 'lucide-react';

const AppointmentCard = ({ appointment }) => {
  const navigate = useNavigate();

  const appointmentDate = appointment.fecha ? new Date(appointment.fecha) : null;
  const isPast = appointmentDate && appointmentDate < new Date();

  const getStatusBadge = () => {
    if (appointment.estado === 'cancelada') {
      return (
        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
          Cancelada
        </span>
      );
    }
    if (isPast) {
      return (
        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
          Completada
        </span>
      );
    }
    return (
      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
        Confirmada
      </span>
    );
  };

  return (
    <Card
      onClick={() => navigate(`/appointments/${appointment.id}`)}
      variant="light"
      className="cursor-pointer hover:shadow-md transition-shadow p-4"
      padding={false}
    >
      <div className="flex items-start justify-between mb-3">
        {appointmentDate && (
          <div>
            <p className="text-xl font-medium text-textPrimary">
              {format(appointmentDate, 'd', { locale: es })}{' '}
              <span className="uppercase">
                {format(appointmentDate, 'MMM', { locale: es })}
              </span>
            </p>
          </div>
        )}
        {getStatusBadge()}
      </div>

      <div className="space-y-2 mb-3">
        <p className="text-base font-medium text-textPrimary">
          {appointment.hora ? formatTime(appointment.hora) : 'Hora no especificada'}
        </p>

        <p className="text-base font-medium text-textPrimary">
          {appointment.especialidadNombre || appointment.especialidad?.nombre || 'Especialidad no especificada'}
        </p>

        {appointment.doctorNombre && (
          <p className="text-sm text-textSecondary">
            Dr(a). {appointment.doctorNombre}
          </p>
        )}

        {appointment.consultorio && (
          <p className="text-sm text-textSecondary">
            {appointment.consultorio}
          </p>
        )}
      </div>

      <div className="flex items-center justify-end mt-4 pt-3 border-t border-primary border-opacity-20">
        <span className="text-sm text-primary font-medium flex items-center">
          Ver detalle
          <ChevronRight size={16} className="ml-1" />
        </span>
      </div>
    </Card>
  );
};

export default AppointmentCard;

