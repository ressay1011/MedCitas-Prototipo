import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../context/AppointmentContext';
import SpecialtySelector from '../components/appointments/SpecialtySelector';
import DateCalendar from '../components/appointments/DateCalendar';
import TimeSlotSelector from '../components/appointments/TimeSlotSelector';
import AppointmentSummary from '../components/appointments/AppointmentSummary';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import BottomNavigation from '../components/common/BottomNavigation';
import { mockApi } from '../services/mockApi';
import { MOCK_SPECIALTIES } from '../data/mockSpecialties';
import { MOCK_DOCTORS } from '../data/mockDoctors';
import { CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const TOTAL_STEPS = 5;

const BookAppointmentPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentStep, bookingData, dispatch } = useAppointments();
  const [step, setStep] = useState(currentStep || 1);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedDate, setSelectedDate] = useState(bookingData.fecha || null);
  const [selectedTime, setSelectedTime] = useState(bookingData.hora || null);
  const [selectedDoctor, setSelectedDoctor] = useState(bookingData.doctor || null);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [notificaciones, setNotificaciones] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);

  // Cargar fechas disponibles cuando se selecciona especialidad
  useEffect(() => {
    if (selectedSpecialty && step === 2) {
      loadAvailableDates();
    }
  }, [selectedSpecialty, step]);

  // Cargar horarios cuando se selecciona fecha
  useEffect(() => {
    if (selectedSpecialty && selectedDate && step === 3) {
      loadAvailableSlots();
    }
  }, [selectedDate, step]);

  const loadAvailableDates = async () => {
    setLoading(true);
    try {
      const dates = await mockApi.getAvailableDates(selectedSpecialty.id);
      setAvailableDates(dates);
    } catch (error) {
      toast.error('Error al cargar fechas disponibles');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableSlots = async () => {
    setLoadingSlots(true);
    try {
      const result = await mockApi.getAvailableTimeSlots(selectedSpecialty.id, selectedDate);
      setAvailableSlots(result.slots || []);
      if (result.doctor) {
        setSelectedDoctor(result.doctor);
      }
    } catch (error) {
      toast.error('Error al cargar horarios disponibles');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSpecialtySelect = (specialty) => {
    setSelectedSpecialty(specialty);
    dispatch({ type: 'SET_BOOKING_DATA', payload: { especialidadId: specialty.id } });
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    dispatch({ type: 'SET_BOOKING_DATA', payload: { fecha: date } });
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    dispatch({ type: 'SET_BOOKING_DATA', payload: { hora: time } });
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      const nextStep = step + 1;
      setStep(nextStep);
      dispatch({ type: 'SET_BOOKING_STEP', payload: nextStep });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      const prevStep = step - 1;
      setStep(prevStep);
      dispatch({ type: 'SET_BOOKING_STEP', payload: prevStep });
    } else {
      navigate('/');
    }
  };

  const handleConfirm = async () => {
    setLoading(true);

    try {
      const appointmentData = {
        usuarioId: user.id,
        especialidadId: selectedSpecialty.id,
        doctorId: selectedDoctor?.id || MOCK_DOCTORS.find(d => d.especialidadId === selectedSpecialty.id)?.id,
        fecha: selectedDate,
        hora: selectedTime,
        consultorio: selectedDoctor?.consultorio || 'Por asignar',
        notificaciones
      };

      const newAppointment = await mockApi.bookAppointment(appointmentData);
      setConfirmedAppointment(newAppointment);

      // Guardar en contexto
      dispatch({ type: 'ADD_APPOINTMENT', payload: newAppointment });

      // Guardar en localStorage
      const stored = JSON.parse(localStorage.getItem('medcitas_appointments') || '{}');
      if (!stored[user.id]) stored[user.id] = [];
      stored[user.id].push(newAppointment);
      localStorage.setItem('medcitas_appointments', JSON.stringify(stored));

      // Reset booking
      dispatch({ type: 'RESET_BOOKING' });

      // Avanzar a paso 5 (éxito)
      setStep(5);
      toast.success('¡Recibirás un recordatorio 24 horas antes de tu cita!');
    } catch (error) {
      toast.error(error.message || 'Error al confirmar la cita');
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return 'Selecciona la especialidad';
      case 2:
        return 'Selecciona la fecha';
      case 3:
        return 'Selecciona el horario';
      case 4:
        return 'Confirma tu cita';
      case 5:
        return '¡Cita confirmada!';
      default:
        return '';
    }
  };

  const canContinue = () => {
    switch (step) {
      case 1:
        return selectedSpecialty !== null;
      case 2:
        return selectedDate !== null;
      case 3:
        return selectedTime !== null;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-backgroundGray pb-20">
      {/* Header con progreso */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={handleBack}
              className="text-textPrimary hover:text-primary transition-colors"
              aria-label="Atrás"
            >
              ← Atrás
            </button>
            <span className="text-sm text-textSecondary">
              Paso {step} de {TOTAL_STEPS}
            </span>
          </div>
          <h1 className="text-xl font-medium text-textPrimary">
            {getStepTitle()}
          </h1>

          {/* Progress bar */}
          <div className="mt-4 h-2 bg-backgroundGray rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-lg mx-auto px-4 py-6">
        {step === 1 && (
          <SpecialtySelector
            selectedSpecialty={selectedSpecialty}
            onSelect={handleSpecialtySelect}
          />
        )}

        {step === 2 && (
          <>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="large" />
              </div>
            ) : (
              <DateCalendar
                availableDates={availableDates}
                selectedDate={selectedDate}
                onSelectDate={handleDateSelect}
              />
            )}
          </>
        )}

        {step === 3 && (
          <>
            {loadingSlots ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="large" />
              </div>
            ) : (
              <TimeSlotSelector
                fecha={selectedDate}
                doctor={selectedDoctor}
                slots={availableSlots}
                selectedTime={selectedTime}
                onSelectTime={handleTimeSelect}
              />
            )}
          </>
        )}

        {step === 4 && (
          <AppointmentSummary
            especialidad={selectedSpecialty}
            doctor={selectedDoctor}
            fecha={selectedDate}
            hora={selectedTime}
            consultorio={selectedDoctor?.consultorio}
            notificaciones={notificaciones}
            onToggleNotifications={setNotificaciones}
            onConfirm={handleConfirm}
            onBack={handleBack}
            loading={loading}
          />
        )}

        {step === 5 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-success bg-opacity-20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={48} className="text-success" />
            </div>
            <h2 className="text-2xl font-medium text-textPrimary mb-2">
              ¡Cita confirmada!
            </h2>
            <p className="text-textSecondary mb-8">
              Tu cita ha sido agendada exitosamente
            </p>

            <div className="bg-white rounded-lg p-6 mb-8 text-left">
              <p className="text-sm text-textSecondary mb-1">Código de cita</p>
              <p className="text-xl font-mono font-medium text-textPrimary mb-4">
                {confirmedAppointment?.codigoUnico || 'MC-2025-XXXXXX'}
              </p>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-textSecondary">Especialidad: </span>
                  <span className="font-medium">{selectedSpecialty?.nombre}</span>
                </p>
                <p>
                  <span className="text-textSecondary">Fecha: </span>
                  <span className="font-medium">
                    {selectedDate ? new Date(selectedDate).toLocaleDateString('es-CO', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    }) : ''}
                  </span>
                </p>
                <p>
                  <span className="text-textSecondary">Hora: </span>
                  <span className="font-medium">{selectedTime}</span>
                </p>
                {selectedDoctor && (
                  <p>
                    <span className="text-textSecondary">Doctor: </span>
                    <span className="font-medium">Dr(a). {selectedDoctor.nombre}</span>
                  </p>
                )}
                {selectedDoctor?.consultorio && (
                  <p>
                    <span className="text-textSecondary">Consultorio: </span>
                    <span className="font-medium">{selectedDoctor.consultorio}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="primary"
                fullWidth
                onClick={() => {
                  dispatch({ type: 'RESET_BOOKING' });
                  navigate('/');
                }}
              >
                Ir al inicio
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  dispatch({ type: 'RESET_BOOKING' });
                  navigate('/appointments');
                }}
              >
                Ver mis citas
              </Button>
            </div>
          </div>
        )}

        {/* Botón continuar (excepto en pasos 4 y 5) */}
        {step < 4 && (
          <div className="mt-6">
            <Button
              variant="primary"
              fullWidth
              onClick={handleNext}
              disabled={!canContinue() || loading || loadingSlots}
            >
              Continuar
            </Button>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default BookAppointmentPage;

