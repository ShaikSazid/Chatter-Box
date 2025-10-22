import React from 'react';
import type { Message } from '../../types';
import Icon from '../ui/Icon';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} my-8`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3 max-w-[80%]`}>
        {/* Logo */}
        <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-600">
          <Icon name={isUser ? 'user' : 'bot'} className="w-5 h-5" />
        </div>

        {/* Message bubble */}
        <div className="flex flex-col">
          {isUser ? (
            <div
              className="p-4 bg-[#323437FF] rounded-tl-xl rounded-tr-none rounded-bl-xl rounded-br-xl hover:brightness-110 transition-all cursor-pointer"
              style={{ borderTopRightRadius: '0px', borderRadius: '16px' }}
            >
              <p className="text-gray-300 break-words whitespace-pre-wrap">{message.content}</p>
            </div>
          ) : (
            <div className="p-4 flex items-start gap-3 animate-fade-in">
              <p className="text-gray-300 break-words whitespace-pre-wrap">{message.content}</p>
            </div>
          )}
        </div>
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

export default ChatMessage;
