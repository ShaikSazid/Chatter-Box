import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import Icon from '../ui/Icon';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isSidebarOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, onToggle }) => {
  const { user, logout } = useAuth();
  const { threads, currentThread, createThread, selectThread, deleteThread } = useChat();

  const handleNewChat = async () => {
    await createThread();
  };

  return (
    <motion.aside
      animate={{ width: isSidebarOpen ? '20rem' : '5rem' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-gray-900/70 backdrop-blur-md border-r border-gray-700/50 flex flex-col h-full relative"
    >
      <button 
        onClick={onToggle} 
        className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-gray-300 border-2 border-gray-800/50"
      >
        <motion.div animate={{ rotate: isSidebarOpen ? 0 : 180 }} transition={{ duration: 0.3 }}>
          <Icon name="chevrons-left" className="w-4 h-4" />
        </motion.div>
      </button>

      <div className="overflow-hidden flex flex-col h-full p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700/50">
          <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Icon name="user" className="w-6 h-6 text-white"/>
              </div>
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="font-semibold text-lg whitespace-nowrap truncate"
                  >
                    {user?.username}
                  </motion.span>
                )}
              </AnimatePresence>
          </div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <button onClick={logout} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
                    <Icon name="logout" className="w-6 h-6" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* New Chat Button */}
        <button 
          onClick={handleNewChat}
          className={`flex items-center w-full gap-2 px-4 py-3 mb-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-300 ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
        >
          <Icon name="plus" className="w-5 h-5 flex-shrink-0"/>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap"
              >
                New Chat
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Threads List */}
        <div className="flex-1 overflow-y-auto pr-1 -mr-2">
           <AnimatePresence>
              {isSidebarOpen && (
                  <motion.h2 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium text-gray-400 mb-2 px-2 whitespace-nowrap"
                  >
                      Recent Chats
                  </motion.h2>
              )}
          </AnimatePresence>
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
                <div className={`flex items-center gap-3 truncate ${!isSidebarOpen && 'justify-center w-full'}`}>
                  <Icon name="message" className="w-5 h-5 text-gray-400 flex-shrink-0"/>
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="truncate text-sm whitespace-nowrap"
                      >
                        {thread.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                 <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </nav>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;