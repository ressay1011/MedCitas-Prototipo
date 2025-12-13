import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../context/AppointmentContext';
import { Calendar, Clock, User, Heart, Plus } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import BottomNavigation from '../components/common/BottomNavigation';
import AppointmentList from '../components/appointments/AppointmentList';
import { useEffect } from 'react';
import { mockApi } from '../services/mockApi';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { appointments, dispatch } = useAppointments();

  // Cargar citas al montar
  useEffect(() => {
    const loadAppointments = async () => {
      if (user) {
        try {
          const userAppointments = await mockApi.getUserAppointments(user.id);
          dispatch({ type: 'SET_APPOINTMENTS', payload: userAppointments });
        } catch (error) {
          console.error('Error loading appointments:', error);
        }
      }
    };

    loadAppointments();
  }, [user, dispatch]);

  // Obtener próxima cita
  const upcomingAppointments = appointments.filter(apt => {
    if (!apt.fecha || apt.estado === 'cancelada') return false;
    const aptDate = new Date(apt.fecha);
    return aptDate >= new Date();
  }).sort((a, b) => {
    const dateA = new Date(a.fecha + ' ' + a.hora);
    const dateB = new Date(b.fecha + ' ' + b.hora);
    return dateA - dateB;
  });

  const nextAppointment = upcomingAppointments[0];

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-lg mx-auto px-4">
        {/* Logo */}
        <div className="flex justify-center py-6">
          <div className="w-24 h-24 rounded-full bg-[#BBDEFB] flex items-center justify-center">
            <Heart size={48} className="text-white fill-white" />
          </div>
        </div>

        {/* Próxima cita */}
        <Card variant="light" className="mb-6 border-l-4 border-l-success">
          <p className="text-base font-medium text-textPrimary mb-2">Próxima Cita</p>
          {nextAppointment ? (
            <>
              <p className="text-sm text-textPrimary mb-1">
                {nextAppointment.especialidadNombre || 'Especialidad'}
              </p>
              {nextAppointment.doctorNombre && (
                <p className="text-xs text-textSecondary mb-3">
                  Dr(a). {nextAppointment.doctorNombre}
                </p>
              )}
              <div className="flex items-center space-x-4 text-xs text-textSecondary">
                {nextAppointment.fecha && (
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>
                      {new Date(nextAppointment.fecha).toLocaleDateString('es-CO', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </span>
                  </div>
                )}
                {nextAppointment.hora && (
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{nextAppointment.hora}</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-textSecondary">No hay citas pendientes.</p>
          )}
        </Card>

        {/* Accesos Rápidos */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-textPrimary mb-4">Accesos Rápidos</h2>
          
          <div className="space-y-4">
            <Card
              onClick={() => navigate('/book')}
              variant="light"
              className="cursor-pointer hover:shadow-md transition-shadow p-4"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center flex-shrink-0">
                  <Plus size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-medium text-textPrimary mb-1">
                    Agendar nueva cita
                  </p>
                  <p className="text-xs text-textSecondary">
                    Seleccionar especialidad y horario
                  </p>
                </div>
              </div>
            </Card>

            <Card
              onClick={() => navigate('/appointments')}
              variant="light"
              className="cursor-pointer hover:shadow-md transition-shadow p-4"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center flex-shrink-0">
                  <Calendar size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-medium text-textPrimary mb-1">
                    Ver mis citas
                  </p>
                  <p className="text-xs text-textSecondary">
                    Revisa tus citas programadas
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

      </div>

      <BottomNavigation />
    </div>
  );
};

export default HomePage;

