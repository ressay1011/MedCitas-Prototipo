// Validar email
export const validateEmail = (email) => {
  if (!email) {
    return 'El correo electrónico es requerido';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Ingresa un correo electrónico válido';
  }
  return null;
};

// Validar contraseña
export const validatePassword = (password) => {
  if (!password) {
    return 'La contraseña es requerida';
  }
  if (password.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres';
  }
  return null;
};

// Validar nombre
export const validateName = (name) => {
  if (!name) {
    return 'El nombre es requerido';
  }
  if (name.trim().length < 3) {
    return 'El nombre debe tener al menos 3 caracteres';
  }
  return null;
};

// Validar documento
export const validateDocument = (document) => {
  if (!document) {
    return 'El número de documento es requerido';
  }
  if (!/^\d+$/.test(document)) {
    return 'El documento solo debe contener números';
  }
  if (document.length < 6) {
    return 'El documento debe tener al menos 6 dígitos';
  }
  return null;
};

// Validar teléfono
export const validatePhone = (phone) => {
  if (!phone) {
    return 'El teléfono es requerido';
  }
  if (!/^\d+$/.test(phone)) {
    return 'El teléfono solo debe contener números';
  }
  if (phone.length !== 10) {
    return 'El teléfono debe tener 10 dígitos';
  }
  return null;
};

// Validar fecha de nacimiento (mayor de 18 años)
export const validateBirthDate = (birthDate) => {
  if (!birthDate) {
    return 'La fecha de nacimiento es requerida';
  }
  const birth = new Date(birthDate);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  const dayDiff = today.getDate() - birth.getDate();
  
  const actualAge = (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) ? age - 1 : age;
  
  if (actualAge < 18) {
    return 'Debes ser mayor de 18 años';
  }
  return null;
};

// Validar que dos contraseñas coincidan
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) {
    return 'Confirma tu contraseña';
  }
  if (password !== confirmPassword) {
    return 'Las contraseñas no coinciden';
  }
  return null;
};

