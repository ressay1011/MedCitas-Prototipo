import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../context/AppointmentContext';
import AppointmentDetail from '../components/appointments/AppointmentDetail';
import LoadingSpinner from '../components/common/LoadingSpinner';
import BottomNavigation from '../components/common/BottomNavigation';
import { mockApi } from '../services/mockApi';
import { ArrowLeft } from 'lucide-react';

const AppointmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { appointments } = useAppointments();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppointment = async () => {
      if (!id) {
        navigate('/appointments');
        return;
      }

      // Buscar en el estado local primero
      const localAppointment = appointments.find(apt => apt.id === id);
      if (localAppointment) {
        setAppointment(localAppointment);
        setLoading(false);
        return;
      }

      // Si no está en el estado local, cargar desde mockApi
      try {
        const userAppointments = await mockApi.getUserAppointments(user.id);
        const found = userAppointments.find(apt => apt.id === id);
        if (found) {
          setAppointment(found);
        } else {
          navigate('/appointments');
        }
      } catch (error) {
        console.error('Error loading appointment:', error);
        navigate('/appointments');
      } finally {
        setLoading(false);
      }
    };

    loadAppointment();
  }, [id, user, appointments, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!appointment) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/appointments')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Volver"
            >
              <ArrowLeft size={20} className="text-textPrimary" />
            </button>
            <h1 className="text-xl font-bold text-textPrimary">
              Detalle de la cita
            </h1>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <AppointmentDetail appointment={appointment} />
      </div>

      <BottomNavigation />
    </div>
  );
};

export default AppointmentDetailPage;

