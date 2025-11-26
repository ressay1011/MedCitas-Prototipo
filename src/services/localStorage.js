// Keys utilizadas:
const STORAGE_KEYS = {
  AUTH_TOKEN: 'medcitas_auth_token',
  USER_DATA: 'medcitas_user_data',
  APPOINTMENTS: 'medcitas_appointments',
  BOOKING_DRAFT: 'medcitas_booking_draft' // Para guardar progreso de booking
};

// Funciones de utilidad:
export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

// Sincronización de citas:
export const syncAppointments = (userId, newAppointment) => {
  const appointments = getFromStorage(STORAGE_KEYS.APPOINTMENTS) || {};
  const userAppointments = appointments[userId] || [];
  
  userAppointments.push(newAppointment);
  appointments[userId] = userAppointments;
  
  saveToStorage(STORAGE_KEYS.APPOINTMENTS, appointments);
};

// Guardar progreso de booking (para no perder datos en cambio de pantalla)
export const saveDraft = (draftData) => {
  saveToStorage(STORAGE_KEYS.BOOKING_DRAFT, {
    ...draftData,
    timestamp: Date.now()
  });
};

// Recuperar progreso (si fue reciente < 1 hora)
export const getDraft = () => {
  const draft = getFromStorage(STORAGE_KEYS.BOOKING_DRAFT);
  if (!draft) return null;
  
  const oneHour = 60 * 60 * 1000;
  if (Date.now() - draft.timestamp > oneHour) {
    removeFromStorage(STORAGE_KEYS.BOOKING_DRAFT);
    return null;
  }
  
  return draft;
};

// Exportar keys para uso en otros archivos
export { STORAGE_KEYS };

