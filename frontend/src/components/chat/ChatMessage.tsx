
import React from 'react';
import type { Message } from '../../types';
import Icon from '../ui/Icon';
import { motion } from 'framer-motion';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-4 p-4 md:p-6 ${isUser ? '' : 'bg-gray-800/50 rounded-lg'}`}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-500' : 'bg-gray-600'}`}>
        <Icon name={isUser ? 'user' : 'bot'} className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 pt-0.5">
        <p className="font-semibold text-white">{isUser ? 'You' : 'ChatterBox'}</p>
        <div className="prose prose-invert max-w-none text-gray-300">
          {message.content}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
