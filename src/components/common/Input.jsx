import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
  helperText,
  icon: Icon,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;
  const inputId = props.id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-textPrimary mb-1.5"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary">
            <Icon size={20} />
          </div>
        )}

        <input
          id={inputId}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={`
            w-full
            min-h-[44px]
            px-4 py-3
            ${Icon ? 'pl-11' : ''}
            ${type === 'password' ? 'pr-11' : ''}
            text-base text-textPrimary
            bg-background
            border-2 rounded-lg
            transition-all duration-200
            placeholder:text-textSecondary
            disabled:bg-backgroundGray disabled:cursor-not-allowed
            ${isFocused 
              ? 'border-primary ring-2 ring-primary ring-opacity-20' 
              : error 
                ? 'border-error' 
                : 'border-border hover:border-primary'}
            ${error ? 'focus:border-error focus:ring-error' : 'focus:border-primary'}
          `}
          {...props}
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-textSecondary hover:text-textPrimary transition-colors"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="mt-1.5 text-sm text-error"
        >
          {error}
        </p>
      )}

      {helperText && !error && (
        <p
          id={`${inputId}-helper`}
          className="mt-1.5 text-sm text-textSecondary"
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;

