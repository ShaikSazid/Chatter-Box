import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-wider">Chatterbox</h1>
            <p className="text-gray-400 mt-2">{isLoginPage ? "Welcome back! Please log in." : "Create your account to get started."}</p>
        </div>
        <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          <Outlet />
        </div>
        <div className="mt-6 text-center text-sm">
          {isLoginPage ? (
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-gray-300 hover:text-white transition-colors">
                Sign up
              </Link>
            </p>
          ) : (
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-gray-300 hover:text-white transition-colors">
                Log in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
