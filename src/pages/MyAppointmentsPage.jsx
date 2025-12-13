import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../context/AppointmentContext';
import AppointmentList from '../components/appointments/AppointmentList';
import BottomNavigation from '../components/common/BottomNavigation';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Calendar } from 'lucide-react';
import { mockApi } from '../services/mockApi';

const MyAppointmentsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { appointments, dispatch } = useAppointments();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = async () => {
      if (user) {
        setLoading(true);
        try {
          const userAppointments = await mockApi.getUserAppointments(user.id);
          dispatch({ type: 'SET_APPOINTMENTS', payload: userAppointments });
        } catch (error) {
          console.error('Error loading appointments:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadAppointments();
  }, [user, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-textPrimary">
            Mis citas
          </h1>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-lg mx-auto px-4 py-6">
        {appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-backgroundGray flex items-center justify-center mb-4">
              <Calendar size={32} className="text-textSecondary" />
            </div>
            <p className="text-lg font-medium text-textPrimary mb-2">
              No tienes citas programadas
            </p>
            <p className="text-sm text-textSecondary mb-6 text-center">
              Agenda tu primera cita médica ahora
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/book')}
            >
              Agendar nueva cita
            </Button>
          </div>
        ) : (
          <AppointmentList appointments={appointments} />
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MyAppointmentsPage;

