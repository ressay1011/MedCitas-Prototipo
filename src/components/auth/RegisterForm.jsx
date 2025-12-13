import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, FileText, Phone, Calendar, Heart, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockApi } from '../../services/mockApi';
import Button from '../common/Button';
import Input from '../common/Input';
import {
  validateEmail,
  validatePassword,
  validateName,
  validateDocument,
  validatePhone,
  validateBirthDate,
  validatePasswordMatch
} from '../../utils/validators';
import toast from 'react-hot-toast';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    documento: '',
    fechaNacimiento: '',
    telefono: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    const nameError = validateName(formData.nombre);
    if (nameError) newErrors.nombre = nameError;
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;
    
    const confirmPasswordError = validatePasswordMatch(
      formData.password,
      formData.confirmPassword
    );
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;
    
    const documentError = validateDocument(formData.documento);
    if (documentError) newErrors.documento = documentError;
    
    const birthDateError = validateBirthDate(formData.fechaNacimiento);
    if (birthDateError) newErrors.fechaNacimiento = birthDateError;
    
    const phoneError = validatePhone(formData.telefono);
    if (phoneError) newErrors.telefono = phoneError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...userData } = formData;
      const response = await mockApi.register(userData);
      login(response.user, response.token);
      toast.success('¡Cuenta creada exitosamente!');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Error al crear la cuenta');
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Calcular edad máxima permitida (18 años atrás)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  const maxDateString = maxDate.toISOString().split('T')[0];

  // Calcular edad mínima permitida (100 años atrás)
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 100);
  const minDateString = minDate.toISOString().split('T')[0];

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-textPrimary mb-2">
          Crear cuenta
        </h1>
        <p className="text-textSecondary">
          Completa el formulario para registrarte
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre completo"
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          error={errors.nombre}
          placeholder="Juan Pérez"
          required
          icon={User}
          disabled={loading}
        />

        <Input
          label="Correo electrónico"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="tu@email.com"
          required
          icon={Mail}
          disabled={loading}
        />

        <Input
          label="Contraseña"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="••••••••"
          helperText="Mínimo 6 caracteres"
          required
          icon={Lock}
          disabled={loading}
        />

        <Input
          label="Confirmar contraseña"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="••••••••"
          required
          icon={Lock}
          disabled={loading}
        />

        <Input
          label="Número de documento"
          type="text"
          name="documento"
          value={formData.documento}
          onChange={handleChange}
          error={errors.documento}
          placeholder="1234567890"
          helperText="Solo números, mínimo 6 dígitos"
          required
          icon={FileText}
          disabled={loading}
        />

        <Input
          label="Fecha de nacimiento"
          type="date"
          name="fechaNacimiento"
          value={formData.fechaNacimiento}
          onChange={handleChange}
          error={errors.fechaNacimiento}
          min={minDateString}
          max={maxDateString}
          helperText="Debes ser mayor de 18 años"
          required
          icon={Calendar}
          disabled={loading}
        />

        <Input
          label="Teléfono"
          type="tel"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          error={errors.telefono}
          placeholder="3001234567"
          helperText="10 dígitos"
          required
          icon={Phone}
          disabled={loading}
        />

        {errors.submit && (
          <p className="text-sm text-error" role="alert">
            {errors.submit}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
          disabled={loading}
          className="flex items-center justify-center"
        >
          CREAR CUENTA
          <div className="ml-2 w-6 h-6 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
            <UserPlus size={14} className="text-white" />
          </div>
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-textSecondary">
          ¿Ya tienes cuenta?{' '}
          <Link
            to="/login"
            className="text-primary font-medium underline"
          >
            Inicia Sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;

