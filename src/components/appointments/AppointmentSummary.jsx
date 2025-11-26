import { User, Calendar, Clock, MapPin } from 'lucide-react';
import Card from '../common/Card';
import { formatFullDate, formatTime } from '../../utils/dateHelpers';

const AppointmentSummary = ({ 
  especialidad, 
  doctor, 
  fecha, 
  hora, 
  consultorio,
  notificaciones = true,
  onToggleNotifications,
  onConfirm,
  onBack,
  loading = false
}) => {
  return (
    <div className="w-full space-y-6">
      <Card className="p-6">
        <h3 className="text-xl font-medium text-textPrimary mb-4">
          Resumen de la cita
        </h3>

        <div className="space-y-4">
          {/* Especialidad y Doctor */}
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primaryLight flex items-center justify-center">
              <User size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-textSecondary">Especialidad</p>
              <p className="text-base font-medium text-textPrimary">
                {especialidad?.nombre || 'No especificada'}
              </p>
              {doctor && (
                <p className="text-sm text-textSecondary mt-0.5">
                  Dr(a). {doctor.nombre}
                </p>
              )}
            </div>
          </div>

          {/* Fecha */}
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primaryLight flex items-center justify-center">
              <Calendar size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-textSecondary">Fecha</p>
              <p className="text-base font-medium text-textPrimary capitalize">
                {fecha ? formatFullDate(fecha) : 'No especificada'}
              </p>
            </div>
          </div>

          {/* Hora */}
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primaryLight flex items-center justify-center">
              <Clock size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-textSecondary">Hora</p>
              <p className="text-base font-medium text-textPrimary">
                {hora ? formatTime(hora) : 'No especificada'}
              </p>
            </div>
          </div>

          {/* Ubicación */}
          {consultorio && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primaryLight flex items-center justify-center">
                <MapPin size={20} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-textSecondary">Ubicación</p>
                <p className="text-base font-medium text-textPrimary">
                  {consultorio}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Checkbox de notificaciones */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="notificaciones"
          checked={notificaciones}
          onChange={(e) => onToggleNotifications?.(e.target.checked)}
          className="w-5 h-5 text-primary border-border rounded focus:ring-primary focus:ring-2"
        />
        <label htmlFor="notificaciones" className="text-sm text-textPrimary cursor-pointer">
          Deseo recibir recordatorios de esta cita
        </label>
      </div>

      {/* Botones */}
      <div className="flex space-x-3">
        <button
          onClick={onBack}
          type="button"
          className="flex-1 min-h-[44px] px-4 py-3 rounded-lg border-2 border-border text-textPrimary font-medium hover:bg-backgroundGray transition-colors"
          disabled={loading}
        >
          Atrás
        </button>
        <button
          onClick={onConfirm}
          type="button"
          className="flex-1 min-h-[44px] px-4 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primaryDark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Confirmando...' : 'Confirmar cita'}
        </button>
      </div>
    </div>
  );
};

export default AppointmentSummary;

