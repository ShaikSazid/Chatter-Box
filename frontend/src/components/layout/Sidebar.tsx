import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import Icon from '../ui/Icon';
import { motion } from 'framer-motion';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { threads, currentThread, createThread, selectThread, deleteThread } = useChat();

  const handleNewChat = async () => {
    await createThread();
  };

  return (
    <div className="bg-gray-900/70 backdrop-blur-md border-r border-gray-700/50 w-full md:w-80 flex flex-col h-full p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Icon name="user" className="w-6 h-6 text-white"/>
            </div>
            <span className="font-semibold text-lg">{user?.username}</span>
        </div>
        <button onClick={logout} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
            <Icon name="logout" className="w-6 h-6" />
        </button>
      </div>

      {/* New Chat Button */}
      <button 
        onClick={handleNewChat}
        className="flex items-center justify-center w-full gap-2 px-4 py-3 mb-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-300"
      >
        <Icon name="plus" className="w-5 h-5"/>
        New Chat
      </button>

      {/* Threads List */}
      <div className="flex-1 overflow-y-auto pr-1">
        <h2 className="text-sm font-medium text-gray-400 mb-2 px-2">Recent Chats</h2>
        <nav className="flex flex-col gap-1">
          {threads.map((thread) => (
            <motion.div
              key={thread._id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                currentThread?._id === thread._id ? 'bg-blue-500/20 text-blue-300' : 'hover:bg-gray-700/50'
              }`}
              onClick={() => selectThread(thread._id)}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon name="message" className="w-5 h-5 text-gray-400"/>
                <span className="truncate text-sm">{thread.title}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteThread(thread._id);
                }}
                className="p-1 text-gray-500 rounded-md opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-gray-600/50 transition-opacity"
              >
                <Icon name="trash" className="w-4 h-4"/>
              </button>
            </motion.div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;