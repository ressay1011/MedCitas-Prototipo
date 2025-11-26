const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-6 h-6 border-2',
    large: 'w-8 h-8 border-3'
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        border-primary border-t-transparent
        rounded-full
        animate-spin
        ${className}
      `}
      role="status"
      aria-label="Cargando"
    >
      <span className="sr-only">Cargando...</span>
    </div>
  );
};

export default LoadingSpinner;

