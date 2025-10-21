import React, { useEffect, useRef } from 'react';
import Sidebar from '../components/layout/Sidebar';
import ChatMessage from '../components/chat/ChatMessage';
import ChatInput from '../components/chat/ChatInput';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../hooks/useAuth';
import Icon from '../components/ui/Icon';
import TypingIndicator from '../components/chat/TypingIndicator';

const DashboardPage: React.FC = () => {
  const { messages, currentThread, isSending, threads, selectThread, fetchThreads } = useChat();
  const { isAuthenticated, isLoading, user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  // Fetch threads on login
  useEffect(() => {
    const initThreads = async () => {
      if (isAuthenticated && user) {
        await fetchThreads();
        // Select the first thread if none selected
        if (threads.length > 0 && !currentThread) {
          selectThread(threads[0]._id);
        }
      }
    };
    initThreads();
  }, [isAuthenticated, user, fetchThreads, threads, currentThread, selectThread]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-gray-900 text-gray-400">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <main className="flex-1 flex flex-col bg-gray-800/50">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            {currentThread ? (
              <>
                {messages.map(msg => (
                  <ChatMessage key={msg._id} message={msg} />
                ))}
                {isSending && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <Icon name="bot" className="w-24 h-24 mb-4" />
                <h2 className="text-2xl font-semibold">Welcome to Chatterbox</h2>
                <p>Create a new chat or select an existing one from the sidebar to get started.</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-gray-800/50 border-t border-gray-700">
          <div className="max-w-3xl mx-auto">
            <ChatInput />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
