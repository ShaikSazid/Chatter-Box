import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useChat } from '../../context/ChatContext';
import Icon from '../ui/Icon';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { motion, type Variants } from 'framer-motion';

const Sidebar: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const { threads, currentThread, selectThread, createThread, deleteThread } = useChat();

  const [isOpen, setIsOpen] = useState(true);
  const [threadToDelete, setThreadToDelete] = useState<string | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Auto-select the first thread if none is selected
  useEffect(() => {
    if (threads.length > 0 && !currentThread) {
      selectThread(threads[0]._id);
    }
  }, [threads, currentThread, selectThread]);

  const handleCreateThread = async () => {
    await createThread();
    if (!isOpen) setIsOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (threadToDelete) {
      deleteThread(threadToDelete);
      setThreadToDelete(null);
    }
  };

  const handleLogoutConfirm = () => {
    logout();
    setIsLogoutModalOpen(false);
  };

  const sidebarVariants: Variants = {
    open: { width: '16rem', transition: { type: 'spring', stiffness: 400, damping: 40 } },
    closed: { width: '5rem', transition: { type: 'spring', stiffness: 400, damping: 40 } },
  };

  const contentFadeVariants: Variants = {
    open: { opacity: 1, x: 0, transition: { delay: 0.2, duration: 0.2, ease: 'easeIn' } },
    closed: { opacity: 0, x: -10, transition: { duration: 0.1, ease: 'easeOut' } },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-64 bg-gray-900">
        <span className="text-gray-400">Loading...</span>
      </div>
    );
  }

  return (
    <>
      <motion.aside
        variants={sidebarVariants}
        animate={isOpen ? 'open' : 'closed'}
        className="bg-gray-900 flex flex-col p-2 border-r border-white/10"
      >
        <div className="h-full flex flex-col overflow-hidden">
          {isOpen ? (
            <motion.div
              className="flex flex-col h-full"
              key="sidebar-open"
              variants={contentFadeVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-2 mb-2">
                <div className="flex items-center gap-2">
                  <Icon name="chatterbox" className="w-6 h-6 text-gray-400" />
                  <span className="font-bold text-lg text-white">ChatterBox</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700/50"
                  title="Collapse"
                >
                  <Icon name="chevrons-left" className="w-5 h-5" />
                </button>
              </div>

              {/* New Chat Button */}
              <div className="p-2 mb-2">
                <button
                  onClick={handleCreateThread}
                  className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                  title="New Chat"
                >
                  <Icon name="plus" className="w-5 h-5" />
                  New Chat
                </button>
              </div>

              {/* Threads List */}
              <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                <nav className="flex flex-col gap-1">
                  {threads.map(thread => (
                    <div key={thread._id} className="group relative">
                      <a
                        href="#"
                        onClick={e => { e.preventDefault(); selectThread(thread._id); }}
                        className={`block py-2 px-3 rounded-md text-sm truncate transition-colors ${
                          currentThread?._id === thread._id
                            ? 'bg-gray-700/80 text-white'
                            : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                        }`}
                      >
                        {thread.title || 'New Conversation'}
                      </a>
                      <button
                        onClick={() => setThreadToDelete(thread._id)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200"
                        title="Delete chat"
                      >
                        <Icon name="trash" className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </nav>
              </div>

              {/* Footer */}
              <div className="mt-auto p-2 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-600">
                    <Icon name="user" className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-sm flex-1 truncate">{user?.username}</span>
                  <button
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="p-2 text-gray-400 hover:text-white"
                    title="Logout"
                  >
                    <Icon name="logout" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="flex flex-col items-center h-full pt-4 gap-6"
              key="sidebar-closed"
              variants={contentFadeVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="w-10 h-10 flex items-center justify-center text-gray-400">
                <Icon name="chatterbox" className="w-8 h-8" />
              </div>
              <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg"
                title="Expand"
              >
                <Icon name="menu" className="w-6 h-6" />
              </button>
              <button
                onClick={handleCreateThread}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg"
                title="New Chat"
              >
                <Icon name="plus" className="w-6 h-6" />
              </button>
            </motion.div>
          )}
        </div>
      </motion.aside>

      {/* Delete Thread Modal */}
      <Modal
        isOpen={!!threadToDelete}
        onClose={() => setThreadToDelete(null)}
        title="Delete Chat?"
      >
        <p className="text-gray-400 mb-6">
          Are you sure you want to delete this chat history? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <Button onClick={() => setThreadToDelete(null)} variant="secondary" className="w-auto">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} variant="danger" className="w-auto">
            Delete
          </Button>
        </div>
      </Modal>

      {/* Logout Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Confirm Logout"
      >
        <p className="text-gray-400 mb-6">Are you sure you want to log out?</p>
        <div className="flex justify-end gap-4">
          <Button onClick={() => setIsLogoutModalOpen(false)} variant="secondary" className="w-auto">
            Cancel
          </Button>
          <Button onClick={handleLogoutConfirm} variant="danger" className="w-auto">
            Logout
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Sidebar;
