// src/components/layout/Header.tsx
import React from 'react';
import Icon from '../ui/Icon';
import { useAuth } from '../../hooks/useAuth';

const Header: React.FC = () => {
  const { user } = useAuth();
  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : '?';

  return (
    // Removed border, increased padding slightly
    <header className="flex-shrink-0 flex items-center justify-end h-16 px-5 md:px-7 bg-gray-900">
      <div className="flex items-center gap-4"> {/* Increased gap */}
        {/* Potentially add other icons like Notifications here */}
        <button
            className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-700 hover:bg-gray-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
            title={user?.username || 'Profile Settings'}
        >
          <span className="text-[13px] font-semibold text-gray-100"> {/* Adjusted size/color */}
            {userInitial}
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;