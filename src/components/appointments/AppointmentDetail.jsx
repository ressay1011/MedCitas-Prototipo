import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  X, 
  Share2,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { formatFullDate, formatTime } from '../../utils/dateHelpers';
import { mockApi } from '../../services/mockApi';
import { useAppointments } from '../../context/AppointmentContext';
import toast from 'react-hot-toast';

const AppointmentDetail = ({ appointment }) => {
  const navigate = useNavigate();
  const { dispatch } = useAppointments();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  const isConfirmed = appointment.estado === 'confirmada';
  const isCancelled = appointment.estado === 'cancelada';

  const handleCancel = async () => {
    setCancelLoading(true);

    try {
      await mockApi.cancelAppointment(appointment.id, cancelReason);
      dispatch({
        type: 'UPDATE_APPOINTMENT',
        payload: {
          id: appointment.id,
          estado: 'cancelada',
          motivoCancelacion: cancelReason,
          fechaCancelacion: new Date().toISOString()
        }
      });
      toast.success('Cita cancelada exitosamente');
      setShowCancelModal(false);
      navigate('/appointments');
    } catch (error) {
      toast.error(error.message || 'Error al cancelar la cita');
    } finally {
      setCancelLoading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `Cita médica - ${appointment.especialidadNombre}`,
      text: `Tengo una cita médica el ${formatFullDate(appointment.fecha)} a las ${formatTime(appointment.hora)} con ${appointment.doctorNombre}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copiar al portapapeles
        await navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}\nCódigo: ${appointment.codigoUnico}`
        );
        toast.success('Información de la cita copiada al portapapeles');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Header con estado */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {isCancelled ? (
              <XCircle size={32} className="text-error" />
            ) : (
              <CheckCircle2 size={32} className="text-success" />
            )}
            <div>
              <h1 className="text-xl font-bold text-textPrimary">
                Cita #{appointment.codigoUnico?.split('-').pop() || appointment.id}
              </h1>
              <p className="text-sm text-textSecondary">
                {isCancelled ? 'Cancelada' : isConfirmed ? 'Confirmada' : appointment.estado}
              </p>
            </div>
          </div>
        </div>

        {appointment.codigoUnico && (
          <div className="bg-backgroundGray rounded-lg p-3">
            <p className="text-xs text-textSecondary mb-1">Código único</p>
            <p className="text-lg font-mono font-medium text-textPrimary">
              {appointment.codigoUnico}
            </p>
          </div>
        )}
      </Card>

      {/* Información detallada */}
      <Card variant="light" className="p-6 space-y-4">
        {/* Especialidad y Doctor */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primaryLight flex items-center justify-center">
            <User size={20} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-textSecondary">Especialidad</p>
            <p className="text-base font-bold text-textPrimary">
              {appointment.especialidadNombre || appointment.especialidad?.nombre || 'No especificada'}
            </p>
            {appointment.doctorNombre && (
              <p className="text-sm text-textSecondary mt-0.5">
                Dr(a). {appointment.doctorNombre}
              </p>
            )}
          </div>
        </div>

        {/* Fecha */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primaryLight flex items-center justify-center">
            <Calendar size={20} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-textSecondary">Fecha</p>
            <p className="text-base font-bold text-textPrimary capitalize">
              {appointment.fecha ? formatFullDate(appointment.fecha) : 'No especificada'}
            </p>
          </div>
        </div>

        {/* Hora */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primaryLight flex items-center justify-center">
            <Clock size={20} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-textSecondary">Hora</p>
            <p className="text-base font-bold text-textPrimary">
              {appointment.hora ? formatTime(appointment.hora) : 'No especificada'}
            </p>
          </div>
        </div>

        {/* Ubicación */}
        {appointment.consultorio && (
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primaryLight flex items-center justify-center">
              <MapPin size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-textSecondary">Ubicación</p>
              <p className="text-base font-bold text-textPrimary">
                {appointment.consultorio}
              </p>
            </div>
          </div>
        )}

        {/* Motivo de cancelación */}
        {isCancelled && appointment.motivoCancelacion && (
          <div className="flex items-start space-x-3 pt-2 border-t border-border">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <FileText size={20} className="text-error" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-textSecondary">Motivo de cancelación</p>
              <p className="text-sm text-textPrimary">
                {appointment.motivoCancelacion}
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Acciones */}
      {isConfirmed && (
        <div className="flex flex-col space-y-3">
          <Button
            variant="outlined"
            fullWidth
            onClick={handleShare}
          >
            <Share2 size={20} className="mr-2" />
            Compartir cita
          </Button>
          <Button
            variant="text"
            fullWidth
            onClick={() => setShowCancelModal(true)}
            className="text-error"
          >
            <X size={20} className="mr-2" />
            Cancelar cita
          </Button>
        </div>
      )}

      {/* Modal de cancelación */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-textPrimary mb-2">
              ¿Cancelar esta cita?
            </h3>
            <p className="text-sm text-textSecondary mb-4">
              Esta acción no se puede deshacer. Se liberará el horario para otros pacientes.
            </p>

            <div className="mb-4">
              <label htmlFor="cancel-reason" className="block text-sm font-medium text-textPrimary mb-2">
                Motivo de cancelación (opcional)
              </label>
              <textarea
                id="cancel-reason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Ej: Cambio de planes, emergencia..."
                maxLength={200}
                rows={3}
                className="w-full px-4 py-3 border-2 border-border rounded-lg resize-none focus:border-primary focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-textSecondary mt-1">
                {cancelReason.length}/200 caracteres
              </p>
            </div>

            <div className="flex items-center space-x-2 mb-4 p-3 bg-warning bg-opacity-10 rounded-lg">
              <span className="text-warning">⚠️</span>
              <p className="text-xs text-textSecondary">
                Solo puedes cancelar con mínimo 24 horas de anticipación
              </p>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setShowCancelModal(false)}
                disabled={cancelLoading}
              >
                No, mantener
              </Button>
              <Button
                variant="error"
                fullWidth
                onClick={handleCancel}
                loading={cancelLoading}
                disabled={cancelLoading}
              >
                Sí, cancelar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AppointmentDetail;

