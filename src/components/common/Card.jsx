const Card = ({
  children,
  className = '',
  padding = true,
  shadow = true,
  onClick,
  variant = 'default', // 'default' o 'light'
  ...props
}) => {
  const backgroundStyle = variant === 'light' ? 'bg-cardBackground' : 'bg-background';

  const baseStyles = `
    ${backgroundStyle}
    rounded-lg
    ${shadow ? 'shadow-sm hover:shadow-md transition-shadow duration-200' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${padding ? 'p-4' : ''}
  `;

  return (
    <div
      className={`${baseStyles} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

