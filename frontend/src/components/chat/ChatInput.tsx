import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import Icon from '../ui/Icon';

const ChatInput: React.FC = () => {
  const [content, setContent] = useState('');
  const { sendMessage, isSending } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !isSending) {
      sendMessage(content);
      setContent('');
    }
  };

  return (
    <div className="p-4 bg-gray-900 border-t border-gray-700/50">
      <form
        onSubmit={handleSubmit}
        className="relative"
      >
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Type your message..."
          rows={1}
          className="w-full pl-4 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg resize-none placeholder-gray-500 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={isSending || !content.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          <Icon name="send" className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;