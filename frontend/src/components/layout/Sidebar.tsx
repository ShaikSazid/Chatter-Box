import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import Icon from '../ui/Icon';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { threads, currentThread, selectThread, createThread, deleteThread } = useChat();

  const handleCreateThread = async () => {
    await createThread();
  };

  return (
    <aside className="w-64 bg-gray-900 flex flex-col p-2 border-r border-white/10">
      <div className="p-2 mb-2">
         <button
          onClick={handleCreateThread}
          className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          <Icon name="plus" className="w-5 h-5" />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2">
        <nav className="flex flex-col gap-1">
          {threads.map((thread) => (
            <div key={thread._id} className="group relative">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  selectThread(thread._id);
                }}
                className={`block py-2 px-3 rounded-md text-sm truncate transition-colors ${
                  currentThread?._id === thread._id
                    ? 'bg-gray-700/80 text-white'
                    : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                }`}
              >
                {thread.title || 'New Conversation'}
              </a>
              <button
                onClick={() => deleteThread(thread._id)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200"
                title="Delete chat"
              >
                <Icon name="trash" className="w-4 h-4" />
              </button>
            </div>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-2 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-600">
            <Icon name="user" className="w-5 h-5" />
          </div>
          <span className="font-semibold text-sm flex-1 truncate">{user?.username}</span>
          <button onClick={logout} className="p-2 text-gray-400 hover:text-white" title="Logout">
            <Icon name="logout" className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
