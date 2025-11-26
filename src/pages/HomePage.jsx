import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../context/AppointmentContext';
import { Calendar, Clock, User } from 'lucide-react';
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
    <div className="min-h-screen bg-backgroundGray pb-20">
      {/* Header */}
      <div className="bg-primary text-white p-6 pb-8">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-medium mb-2">
            ¡Hola, {user?.nombre?.split(' ')[0] || 'Usuario'}!
          </h1>
          <p className="text-primaryLight">
            Gestiona tus citas médicas de forma sencilla
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-4">
        {/* Próxima cita */}
        {nextAppointment && (
          <Card className="mb-6 border-l-4 border-l-primary">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm text-textSecondary mb-1">Próxima cita</p>
                <h3 className="text-lg font-medium text-textPrimary">
                  {nextAppointment.especialidadNombre || 'Especialidad'}
                </h3>
                {nextAppointment.doctorNombre && (
                  <p className="text-sm text-textSecondary mt-0.5">
                    Dr(a). {nextAppointment.doctorNombre}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-textSecondary mb-4">
              {nextAppointment.fecha && (
                <div className="flex items-center space-x-1">
                  <Calendar size={16} />
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
                  <Clock size={16} />
                  <span>{nextAppointment.hora}</span>
                </div>
              )}
            </div>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate(`/appointments/${nextAppointment.id}`)}
            >
              Ver detalles
            </Button>
          </Card>
        )}

        {/* Acciones rápidas */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card
            onClick={() => navigate('/book')}
            className="cursor-pointer hover:shadow-md transition-shadow text-center py-6"
          >
            <div className="w-12 h-12 rounded-full bg-primaryLight flex items-center justify-center mx-auto mb-3">
              <Calendar size={24} className="text-primary" />
            </div>
            <p className="text-sm font-medium text-textPrimary">
              Nueva cita
            </p>
          </Card>

          <Card
            onClick={() => navigate('/appointments')}
            className="cursor-pointer hover:shadow-md transition-shadow text-center py-6"
          >
            <div className="w-12 h-12 rounded-full bg-primaryLight flex items-center justify-center mx-auto mb-3">
              <Clock size={24} className="text-primary" />
            </div>
            <p className="text-sm font-medium text-textPrimary">
              Mis citas
            </p>
          </Card>
        </div>

        {/* Lista de citas recientes */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-textPrimary">
              Mis citas
            </h2>
            {appointments.length > 0 && (
              <button
                onClick={() => navigate('/appointments')}
                className="text-sm text-primary font-medium"
              >
                Ver todas
              </button>
            )}
          </div>

          {appointments.length > 0 ? (
            <AppointmentList appointments={appointments.slice(0, 3)} />
          ) : (
            <Card className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-backgroundGray flex items-center justify-center mx-auto mb-4">
                <Calendar size={32} className="text-textSecondary" />
              </div>
              <p className="text-base font-medium text-textPrimary mb-2">
                No tienes citas programadas
              </p>
              <p className="text-sm text-textSecondary mb-4">
                Agenda tu primera cita médica ahora
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/book')}
              >
                Agendar nueva cita
              </Button>
            </Card>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default HomePage;

