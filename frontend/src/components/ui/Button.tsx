
import React from 'react';
import Spinner from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, isLoading, ...props }, ref) => {
    return (
      <button
        className={`w-full flex items-center justify-center px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ${className}`}
        ref={ref}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? <Spinner /> : children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
