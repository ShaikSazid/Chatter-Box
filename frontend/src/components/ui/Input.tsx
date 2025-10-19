
import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      className={`w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg placeholder-gray-400 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;
