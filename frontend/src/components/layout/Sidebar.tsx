import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useChat } from '../../context/ChatContext';
import Icon from '../ui/Icon';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { motion } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user, logout, isLoading } = useAuth();
  const { threads, currentThread, selectThread, createThread, deleteThread } = useChat();

  const [threadToDelete, setThreadToDelete] = useState<string | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    if (threads.length > 0 && !currentThread) selectThread(threads[0]._id);
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

  // Sidebar animation variants
  const sidebarVariants = {
    open: { width: '18rem', transition: { duration: 0.1, ease: 'easeInOut' } },
    closed: { width: '5rem', transition: { duration: 0.1, ease: 'easeInOut' } },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-64 bg-[#292A2D]">
        <span className="text-gray-400">Loading...</span>
      </div>
    );
  }

  return (
    <>
      <motion.aside
        variants={sidebarVariants}
        animate={isOpen ? 'open' : 'closed'}
        onMouseEnter={() => setIsOpen(true)} // expand on hover
        className="flex flex-col p-2 border-r border-white/10 relative transition-all"
        style={{ backgroundColor: '#292A2D', fontFamily: 'Helvetica Neue, sans-serif' }}
      >
        <div className="h-full flex flex-col overflow-hidden">
          {isOpen ? (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-2 mb-2">
                <div className="flex items-center gap-2">
                  <Icon name="chatterbox" className="w-6 h-6 text-[#C4C7C5]" />
                  <span className="font-bold text-xl text-[#C4C7C5]">ChatterBox</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)} // toggle button closes sidebar
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#343639FF]"
                  title="Collapse"
                >
                  <Icon name="chevrons-left" className="w-5 h-5" />
                </button>
              </div>

              {/* New Chat Button */}
              <div className="p-2 mb-2">
                <button
                  onClick={handleCreateThread}
                  className="w-full flex items-center justify-start gap-2 text-[#C4C7C5] font-semibold py-2 px-4 rounded-xl hover:bg-[#343639FF] transition-all duration-100 text-[14px]"
                >
                  <Icon name="plus" className="w-5 h-5" />
                  New Chat
                </button>
              </div>

              {/* Chat Threads */}
              <div className="flex-1 overflow-y-auto pr-2 -mr-2 custom-scrollbar">
                <nav className="flex flex-col gap-1">
                  {threads.map((thread) => (
                    <div key={thread._id} className="group relative">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          selectThread(thread._id);
                        }}
                        className={`block py-2 px-3 text-sm truncate transition-all duration-100 text-[#C4C7C5] text-[14px]`}
                        style={{
                          backgroundColor:
                            currentThread?._id === thread._id ? '#1E3660FF' : 'transparent',
                          borderRadius: '1rem',
                        }}
                        onMouseEnter={(e) => {
                          if (currentThread?._id !== thread._id)
                            (e.currentTarget as HTMLElement).style.backgroundColor = '#343639FF';
                        }}
                        onMouseLeave={(e) => {
                          if (currentThread?._id !== thread._id)
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                        }}
                      >
                        {thread.title || 'New Conversation'}
                      </a>
                      <button
                        onClick={() => setThreadToDelete(thread._id)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-100"
                        title="Delete chat"
                      >
                        <Icon name="trash" className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </nav>
              </div>

              {/* Profile Section */}
              <div className="mt-auto p-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-600 text-white font-bold text-lg">
                    {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="font-semibold text-lg flex-1 truncate text-[#C4C7C5]">{user?.username}</span>
                  <button
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="p-2 text-gray-400 hover:text-white"
                    title="Logout"
                  >
                    <Icon name="logout" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center h-full pt-4 justify-between">
              <div className="flex flex-col items-center gap-4 mt-8">
                <Icon name="chatterbox" className="w-8 h-8 text-[#C4C7C5]" />
                <button
                  onClick={handleCreateThread}
                  className="p-2 text-gray-400 hover:text-white hover:bg-[#343639FF] rounded-lg"
                  title="New Chat"
                >
                  <Icon name="plus" className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center justify-center mb-4">
                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="p-2 text-gray-400 hover:text-white"
                  title="Logout"
                >
                  <Icon name="logout" className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.aside>

      {/* Delete Thread Modal */}
      <Modal isOpen={!!threadToDelete} onClose={() => setThreadToDelete(null)} title="Delete Chat?">
        <p className="text-gray-400 mb-6">
          Are you sure you want to delete this chat history? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <Button onClick={() => setThreadToDelete(null)} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} variant="danger">
            Delete
          </Button>
        </div>
      </Modal>

      {/* Logout Modal */}
      <Modal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} title="Confirm Logout">
        <p className="text-gray-400 mb-6">Are you sure you want to log out?</p>
        <div className="flex justify-end gap-4">
          <Button onClick={() => setIsLogoutModalOpen(false)} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleLogoutConfirm} variant="danger">
            Logout
          </Button>
        </div>
      </Modal>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(80, 80, 80, 0.6);
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(100, 100, 100, 0.7);
        }
      `}</style>
    </>
  );
};

export default Sidebar;