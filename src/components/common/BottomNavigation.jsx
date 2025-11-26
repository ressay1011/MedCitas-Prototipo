import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Plus, User } from 'lucide-react';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'book', label: 'Nueva cita', icon: Plus, path: '/book' },
    { id: 'home', label: 'Inicio', icon: Home, path: '/' },
    { id: 'profile', label: 'Perfil', icon: User, path: '/profile' }
  ];

  return (
    <nav 
      className="
        fixed bottom-0 left-0 right-0 
        bg-white border-t border-border
        safe-area-inset-bottom 
        backdrop-blur-lg bg-opacity-95
        z-50
      "
    >
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path || 
                          (tab.path === '/' && location.pathname === '/appointments');
          
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`
                flex flex-col items-center justify-center 
                flex-1 h-full
                transition-colors duration-200
                ${isActive ? 'text-primary' : 'text-textSecondary'}
              `}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon 
                size={24} 
                strokeWidth={isActive ? 2.5 : 2} 
              />
              <span className={`
                text-xs mt-1 font-medium
                ${isActive ? 'font-semibold' : 'font-normal'}
              `}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;

