import React from 'react';
import Icon from '../ui/Icon';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-4 my-6">
      <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-gray-600">
        <Icon name="bot" className="w-5 h-5" />
      </div>
      <div className="flex flex-col items-start">
        <span className="font-bold text-sm mb-1 text-gray-400">Assistant</span>
        <div className="p-4 rounded-lg flex items-center space-x-1.5">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0s]"></span>
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.15s]"></span>
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.3s]"></span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
