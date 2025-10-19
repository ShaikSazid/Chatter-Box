
import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

interface SidebarProps {
  isSidebarOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, onToggle }) => {
  const { threads, currentThread, selectThread, createThread, deleteThread } = useChat();
  const { user, logout } = useAuth();
  const [threadToDelete, setThreadToDelete] = useState<string | null>(null);

  const handleCreateThread = async () => {
    await createThread();
  };

  const handleDeleteClick = (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setThreadToDelete(threadId);
  };

  const confirmDelete = async () => {
    if (threadToDelete) {
      await deleteThread(threadToDelete);
      setThreadToDelete(null);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onToggle}
      ></div>

      <aside
        className={`flex flex-col flex-shrink-0 bg-gray-900/70 backdrop-blur-md border-r border-gray-700/50 h-screen
        fixed inset-y-0 left-0 z-40 md:relative 
        transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'w-64 translate-x-0 md:w-72' : 'w-64 -translate-x-full md:w-20 md:translate-x-0'}`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-gray-700/50 h-16 flex-shrink-0">
            <div className={`flex items-center gap-2 overflow-hidden ${!isSidebarOpen && 'md:hidden'}`}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Icon name="bot" className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white whitespace-nowrap">ChatterBox</h1>
            </div>
            <button
              onClick={onToggle}
              className="p-1 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white"
            >
              <Icon name="chevrons-left" className={`w-5 h-5 transition-transform duration-300 ${!isSidebarOpen && 'md:rotate-180'}`} />
            </button>
          </div>

          <div className="p-4 flex-shrink-0">
            <Button onClick={handleCreateThread} className="w-full justify-center">
              <Icon name="plus" className={`w-5 h-5 ${isSidebarOpen ? 'mr-2' : ''}`} />
              <span className={`${!isSidebarOpen && 'md:hidden'}`}>New Chat</span>
            </Button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 space-y-2">
            {threads.map((thread) => (
              <div
                key={thread._id}
                onClick={() => selectThread(thread._id)}
                className={`group flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                  currentThread?._id === thread._id
                    ? 'bg-blue-600/30 text-white'
                    : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                }`}
              >
                <div className={`flex items-center gap-3 overflow-hidden ${!isSidebarOpen && 'md:justify-center md:w-full'}`}>
                  <Icon name="message" className="w-5 h-5 flex-shrink-0" />
                  <span className={`truncate ${!isSidebarOpen && 'md:hidden'}`}>{thread.title}</span>
                </div>
                <button
                  onClick={(e) => handleDeleteClick(thread._id, e)}
                  className={`flex-shrink-0 p-1 rounded-md text-gray-500 hover:text-red-400 hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity ${!isSidebarOpen && 'md:hidden'}`}
                >
                  <Icon name="trash" className="w-4 h-4" />
                </button>
              </div>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-700/50 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-3 overflow-hidden ${!isSidebarOpen && 'md:justify-center md:w-full'}`}>
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0 text-white font-bold">
                  {user?.username ? (
                    user.username.charAt(0).toUpperCase()
                  ) : (
                    <Icon name="user" className="w-5 h-5" />
                  )}
                </div>
                <span className={`truncate text-sm font-medium ${!isSidebarOpen && 'md:hidden'}`}>
                  {user?.username}
                </span>
              </div>
              <button
                onClick={logout}
                className={`p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white ${!isSidebarOpen && 'md:hidden'}`}
                aria-label="Logout"
              >
                <Icon name="logout" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      <Modal isOpen={!!threadToDelete} onClose={() => setThreadToDelete(null)}>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white">Delete Chat?</h3>
          <p className="mt-2 text-sm text-gray-400">
            Are you sure you want to delete this chat thread? This action cannot be undone.
          </p>
          <div className="mt-6 flex justify-end gap-4">
            <Button onClick={() => setThreadToDelete(null)} className="bg-transparent hover:bg-gray-700">
              Cancel
            </Button>
            <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Sidebar;
