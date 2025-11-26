// Función para generar disponibilidad dinámica
export const generateAvailableSlots = (especialidadId, fecha) => {
  // Genera slots de 9:00 AM a 5:00 PM cada hora
  const slots = [];
  const hours = [9, 10, 11, 14, 15, 16, 17]; // Sin slot a las 12-13 (almuerzo)
  
  hours.forEach(hour => {
    slots.push({
      hora: `${hour.toString().padStart(2, '0')}:00`,
      disponible: Math.random() > 0.3 // 70% disponibilidad
    });
  });
  
  return slots;
};

// Función para obtener fecha futura (n días desde hoy)
const getFutureDate = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

// Citas de ejemplo ya agendadas (para usuario demo)
export const MOCK_USER_APPOINTMENTS = {
  'user-demo': [
    {
      id: 'apt-001',
      usuarioId: 'user-demo',
      especialidadId: 'spec-001',
      especialidadNombre: 'Medicina General',
      doctorId: 'doc-001',
      doctorNombre: 'Dra. María García',
      fecha: getFutureDate(7), // 7 días en el futuro
      hora: '10:00',
      consultorio: 'Consultorio 201, Piso 2',
      estado: 'confirmada',
      codigoUnico: 'MC-2025-001234',
      fechaCreacion: new Date().toISOString(),
      notificaciones: true
    },
    {
      id: 'apt-002',
      usuarioId: 'user-demo',
      especialidadId: 'spec-002',
      especialidadNombre: 'Cardiología',
      doctorId: 'doc-002',
      doctorNombre: 'Dr. Juan Pérez',
      fecha: getFutureDate(14), // 14 días en el futuro
      hora: '15:00',
      consultorio: 'Consultorio 305, Piso 3',
      estado: 'confirmada',
      codigoUnico: 'MC-2025-001235',
      fechaCreacion: new Date().toISOString(),
      notificaciones: true
    }
  ]
};

