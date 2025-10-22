import React from 'react';
import Icon from '../ui/Icon';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-3 my-8">
      <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-gray-600">
        <Icon name="bot" className="w-5 h-5" />
      </div>
      <div className="p-4 flex items-center space-x-1.5 animate-fade-in">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0s]"></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.15s]"></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.3s]"></span>
      </div>

      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(4px); }
          100% { opacity: 1; transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.4s forwards;
        }
      `}</style>
    </div>
  );
};

export default TypingIndicator;
