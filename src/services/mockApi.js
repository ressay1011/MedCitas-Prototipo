import { MOCK_USERS } from '../data/mockUsers';
import { MOCK_SPECIALTIES } from '../data/mockSpecialties';
import { MOCK_DOCTORS } from '../data/mockDoctors';
import { generateAvailableSlots, MOCK_USER_APPOINTMENTS } from '../data/mockAppointments';

// Simula latencia de red (200-500ms)
const simulateNetworkDelay = () => 
  new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const mockApi = {
  // AUTH
  login: async (email, password) => {
    await simulateNetworkDelay();
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token: `mock-token-${user.id}` // Token simulado
    };
  },

  register: async (userData) => {
    await simulateNetworkDelay();
    // Simula validación de email único
    if (MOCK_USERS.some(u => u.email === userData.email)) {
      throw new Error('El correo electrónico ya está registrado');
    }
    const newUser = {
      id: `user-${Date.now()}`,
      ...userData,
      fechaRegistro: new Date().toISOString()
    };
    return {
      user: newUser,
      token: `mock-token-${newUser.id}`
    };
  },

  // SPECIALTIES
  getSpecialties: async () => {
    await simulateNetworkDelay();
    return MOCK_SPECIALTIES.filter(s => s.disponible);
  },

  // AVAILABLE DATES (próximos 30 días con disponibilidad)
  getAvailableDates: async (especialidadId) => {
    await simulateNetworkDelay();
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Excluir domingos (día 0)
      if (date.getDay() !== 0) {
        dates.push({
          fecha: date.toISOString().split('T')[0],
          disponible: Math.random() > 0.2 // 80% de días con disponibilidad
        });
      }
    }
    
    return dates.filter(d => d.disponible);
  },

  // AVAILABLE TIME SLOTS
  getAvailableTimeSlots: async (especialidadId, fecha) => {
    await simulateNetworkDelay();
    const slots = generateAvailableSlots(especialidadId, fecha);
    const doctor = MOCK_DOCTORS.find(d => d.especialidadId === especialidadId);
    
    return {
      doctor,
      slots: slots.filter(s => s.disponible)
    };
  },

  // BOOK APPOINTMENT
  bookAppointment: async (appointmentData) => {
    await simulateNetworkDelay();
    
    // Simula validación de disponibilidad
    if (Math.random() < 0.05) { // 5% de probabilidad de error
      throw new Error('El horario seleccionado ya no está disponible');
    }
    
    const specialty = MOCK_SPECIALTIES.find(s => s.id === appointmentData.especialidadId);
    const doctor = MOCK_DOCTORS.find(d => d.id === appointmentData.doctorId);
    
    const newAppointment = {
      id: `apt-${Date.now()}`,
      ...appointmentData,
      especialidadNombre: specialty?.nombre || '',
      doctorNombre: doctor?.nombre || '',
      codigoUnico: `MC-2025-${Math.floor(Math.random() * 900000 + 100000)}`,
      fechaCreacion: new Date().toISOString(),
      estado: 'confirmada',
      notificaciones: appointmentData.notificaciones !== false
    };
    
    return newAppointment;
  },

  // GET USER APPOINTMENTS
  getUserAppointments: async (usuarioId) => {
    await simulateNetworkDelay();
    const appointments = MOCK_USER_APPOINTMENTS[usuarioId] || [];
    
    // Cargar también desde localStorage si existe
    try {
      const stored = JSON.parse(localStorage.getItem('medcitas_appointments') || '{}');
      if (stored[usuarioId]) {
        return [...appointments, ...stored[usuarioId]].sort((a, b) => {
          const dateA = new Date(a.fecha + ' ' + a.hora);
          const dateB = new Date(b.fecha + ' ' + b.hora);
          return dateA - dateB;
        });
      }
    } catch (error) {
      console.error('Error loading appointments from storage:', error);
    }
    
    // Ordenar por fecha (más próximas primero)
    return appointments.sort((a, b) => 
      new Date(a.fecha + ' ' + a.hora) - new Date(b.fecha + ' ' + b.hora)
    );
  },

  // CANCEL APPOINTMENT
  cancelAppointment: async (appointmentId, motivo) => {
    await simulateNetworkDelay();
    
    // Simula validación de tiempo mínimo (24 horas)
    // En este prototipo siempre permite cancelación para testing
    
    return {
      id: appointmentId,
      estado: 'cancelada',
      fechaCancelacion: new Date().toISOString(),
      motivo
    };
  }
};

