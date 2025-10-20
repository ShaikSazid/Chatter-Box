import React from 'react';
import type { Message } from '../../types';
import Icon from '../ui/Icon';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className="flex items-start gap-4 my-6">
      <div
        className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
          isUser ? 'bg-gray-600' : 'bg-gray-600'
        }`}
      >
        <Icon name={isUser ? 'user' : 'bot'} className="w-5 h-5" />
      </div>

      <div className="flex flex-col items-start max-w-full overflow-hidden">
        <span className="font-bold text-sm mb-1 text-gray-400">{isUser ? 'You' : 'Assistant'}</span>
        <div className="p-4 rounded-lg bg-gray-700/50 border border-gray-700">
          <p className="whitespace-pre-wrap text-gray-300 break-words">{message.content}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
