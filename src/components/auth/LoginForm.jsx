import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockApi } from '../../services/mockApi';
import Button from '../common/Button';
import Input from '../common/Input';
import { validateEmail, validatePassword } from '../../utils/validators';
import toast from 'react-hot-toast';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;
    
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
      const response = await mockApi.login(formData.email, formData.password);
      login(response.user, response.token);
      toast.success(`¡Bienvenido/a ${response.user.nombre}!`);
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Correo o contraseña incorrectos');
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-textPrimary mb-2">
          Iniciar sesión
        </h1>
        <p className="text-textSecondary">
          Ingresa tus credenciales para continuar
        </p>
      </div>

      {/* Credenciales demo */}
      <div className="mb-6 p-4 bg-primaryLight rounded-lg border border-primary">
        <p className="text-sm font-medium text-primary mb-2">
          📋 Credenciales de prueba:
        </p>
        <p className="text-xs text-textPrimary">
          Email: <span className="font-mono">demo@medcitas.com</span>
        </p>
        <p className="text-xs text-textPrimary">
          Contraseña: <span className="font-mono">demo123</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          required
          icon={Lock}
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
        >
          Iniciar sesión
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-textSecondary">
          ¿No tienes cuenta?{' '}
          <Link
            to="/register"
            className="text-primary font-medium hover:underline"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;

