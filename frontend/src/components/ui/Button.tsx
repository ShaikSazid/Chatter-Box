import React from 'react';
import Spinner from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

const Button: React.FC<ButtonProps> = ({ children, className = '', isLoading = false, variant = 'primary', ...props }) => {
  const baseClasses = "flex justify-center items-center text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: 'w-full bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700',
    secondary: 'w-full bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 text-gray-300',
    danger: 'w-full bg-red-600 hover:bg-red-500 disabled:bg-red-700/50 text-white',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
};

export default Button;
