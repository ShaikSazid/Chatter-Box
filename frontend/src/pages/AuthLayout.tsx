// src/pages/AuthLayout.tsx
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Icon from '../components/ui/Icon'; // Import Icon
import { motion } from 'framer-motion';

const AuthLayout: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-4">
      {/* Optional: Add subtle background shapes/gradients if desired */}
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-sm" // Slightly smaller max-width
      >
        {/* Logo and Title */}
        <div className="text-center mb-8">
            <Icon name="logo" className="w-12 h-12 text-blue-500 mx-auto mb-3" />
            <h1 className="text-3xl font-bold tracking-tight text-gray-100">ChatterBox</h1>
            <p className="text-gray-400 mt-1.5 text-sm">
                {isLoginPage ? "Welcome back! Sign in to continue." : "Create your account."}
            </p>
        </div>

        {/* Form Container */}
        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-gray-700/50 shadow-lg">
          <Outlet /> {/* Renders LoginPage or SignupPage */}
        </div>

        {/* Footer Link */}
        <div className="mt-6 text-center text-sm">
          {isLoginPage ? (
            <p className="text-gray-400">
              New here?{' '}
              <Link to="/signup" className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-150">
                Create an account
              </Link>
            </p>
          ) : (
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-150">
                Sign in
              </Link>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;