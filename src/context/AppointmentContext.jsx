import { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '../services/localStorage';

const AppointmentContext = createContext();

const appointmentReducer = (state, action) => {
  switch (action.type) {
    case 'SET_APPOINTMENTS':
      return { ...state, appointments: action.payload };
    case 'ADD_APPOINTMENT':
      return { 
        ...state, 
        appointments: [...state.appointments, action.payload] 
      };
    case 'UPDATE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.map(apt =>
          apt.id === action.payload.id ? { ...apt, ...action.payload } : apt
        )
      };
    case 'SET_BOOKING_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_BOOKING_DATA':
      return { 
        ...state, 
        bookingData: { ...state.bookingData, ...action.payload } 
      };
    case 'RESET_BOOKING':
      return { 
        ...state, 
        currentStep: 1, 
        bookingData: {} 
      };
    default:
      return state;
  }
};

export const AppointmentProvider = ({ children }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(appointmentReducer, {
    appointments: [],
    currentStep: 1,
    bookingData: {}
  });

  // Cargar citas del usuario desde localStorage
  useEffect(() => {
    if (user) {
      const allAppointments = getFromStorage(STORAGE_KEYS.APPOINTMENTS) || {};
      const userAppointments = allAppointments[user.id] || [];
      
      // También cargar desde mockApi si no hay en localStorage
      if (userAppointments.length === 0) {
        // Cargar desde mockApi será manejado por las páginas que lo necesiten
      }
      
      dispatch({ type: 'SET_APPOINTMENTS', payload: userAppointments });
    } else {
      dispatch({ type: 'SET_APPOINTMENTS', payload: [] });
    }
  }, [user]);

  // Guardar cambios en localStorage
  useEffect(() => {
    if (user && state.appointments.length >= 0) {
      const allAppointments = getFromStorage(STORAGE_KEYS.APPOINTMENTS) || {};
      allAppointments[user.id] = state.appointments;
      saveToStorage(STORAGE_KEYS.APPOINTMENTS, allAppointments);
    }
  }, [state.appointments, user]);

  return (
    <AppointmentContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointments must be used within AppointmentProvider');
  }
  return context;
};

