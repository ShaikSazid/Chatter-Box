import React, { forwardRef, useState, useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactElement<{ className?: string }>;
  onIconClick?: () => void;
  error?: string;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type = 'text', label, icon, onIconClick, error, containerClassName = '', ...props }, ref) => {
    const id = useId();
    const [isFocused, setIsFocused] = useState(false);
    
    // Determine if the label should float
    // It should float if the input is focused, has a value, or is a date/time input (which always have content visible)
    const isFloating = isFocused || props.value || props.defaultValue || ['date', 'datetime-local', 'month', 'time', 'week'].includes(type);

    return (
      <div className={`relative ${containerClassName}`}>
        <label
          htmlFor={id}
          className={`absolute left-0 transition-all duration-200 ease-in-out pointer-events-none
            ${isFloating
              ? '-top-5 text-xs text-gray-400'
              : 'top-2 text-base text-gray-500'
            }`}
        >
          {label}
        </label>
        <div className="relative flex items-center">
            <input
              id={id}
              ref={ref}
              type={type}
              onFocus={() => setIsFocused(true)}
              onBlur={(e) => {
                  setIsFocused(false);
                  if (props.onBlur) props.onBlur(e);
              }}
              className={`w-full bg-transparent border-b-2 
                ${error ? 'border-red-500/50' : 'border-gray-600 focus:border-gray-400'} 
                text-white py-2 transition-colors duration-200 outline-none
                ${icon ? 'pr-8' : ''}`}
              {...props}
            />
            {icon && (
              <div 
                className="absolute inset-y-0 right-0 flex items-center cursor-pointer"
                onClick={onIconClick}
              >
                {React.cloneElement(icon, { className: 'w-5 h-5 text-gray-500 hover:text-gray-300 transition-colors' })}
              </div>
            )}
        </div>
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
