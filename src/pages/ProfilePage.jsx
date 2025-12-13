import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BottomNavigation from '../components/common/BottomNavigation';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { User, Mail, Phone, FileText, Calendar, LogOut } from 'lucide-react';
import { formatDate } from '../utils/dateHelpers';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada exitosamente');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-primary text-white p-6 pb-8">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold mb-2">
            Mi perfil
          </h1>
          <p className="text-primaryLight">
            Información de tu cuenta
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-lg mx-auto px-4 -mt-4">
        {/* Información del usuario */}
        <Card variant="light" className="p-6 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
              <User size={32} className="text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-textPrimary">
                {user?.nombre || 'Usuario'}
              </h2>
              <p className="text-sm text-textSecondary">
                {user?.email || ''}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <Mail size={20} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-textSecondary">Correo electrónico</p>
                <p className="text-base font-bold text-textPrimary">
                  {user?.email || 'No especificado'}
                </p>
              </div>
            </div>

            {/* Teléfono */}
            {user?.telefono && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <Phone size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-textSecondary">Teléfono</p>
                  <p className="text-base font-bold text-textPrimary">
                    {user.telefono}
                  </p>
                </div>
              </div>
            )}

            {/* Documento */}
            {user?.documento && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <FileText size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-textSecondary">Número de documento</p>
                  <p className="text-base font-bold text-textPrimary">
                    {user.documento}
                  </p>
                </div>
              </div>
            )}

            {/* Fecha de nacimiento */}
            {user?.fechaNacimiento && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <Calendar size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-textSecondary">Fecha de nacimiento</p>
                  <p className="text-base font-bold text-textPrimary">
                    {formatDate(user.fechaNacimiento, 'dd/MM/yyyy')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Botón de cerrar sesión */}
        <Button
          variant="outlined"
          fullWidth
          onClick={handleLogout}
          className="mb-6 text-error border-error hover:bg-red-50"
        >
          <LogOut size={20} className="mr-2" />
          Cerrar sesión
        </Button>

        {/* Información de la app */}
        <Card className="p-4 text-center">
          <p className="text-xs text-textSecondary mb-2">
            MedCitas v1.0.0
          </p>
          <p className="text-xs text-textSecondary">
            Prototipo funcional para testing
          </p>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;

