import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

const Button = ({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
  fullWidth = false,
  loading = false,
  type = 'button',
  className = '',
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const baseStyles = `
    inline-flex items-center justify-center
    min-h-[44px] px-6 py-3
    font-medium text-base
    rounded-lg
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ripple
    ${fullWidth ? 'w-full' : ''}
  `;

  const variantStyles = {
    primary: `
      bg-primary text-white uppercase font-medium
      hover:bg-primaryDark
      active:bg-primaryDark
      focus:ring-primary
      shadow-md hover:shadow-lg
    `,
    secondary: `
      bg-backgroundGray text-textPrimary
      hover:bg-border
      active:bg-border
      focus:ring-primary
      border border-border
    `,
    outlined: `
      bg-transparent text-primary
      border-2 border-primary
      hover:bg-primaryLight
      active:bg-primaryLight
      focus:ring-primary
    `,
    text: `
      bg-transparent text-primary
      hover:bg-primaryLight
      active:bg-primaryLight
      focus:ring-primary
    `,
    error: `
      bg-error text-white
      hover:bg-red-600
      active:bg-red-600
      focus:ring-error
    `
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${isPressed ? 'scale-95' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner size="small" className="mr-2" />
          <span>{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;

