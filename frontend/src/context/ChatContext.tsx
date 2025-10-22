import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import api from '../services/api';
import type { Thread, Message } from '../types';
import { useAuth } from './AuthContext';

interface ChatContextType {
  threads: Thread[];
  currentThread: Thread | null;
  messages: Message[];
  isLoading: boolean;
  isSending: boolean;
  fetchThreads: () => Promise<void>;
  selectThread: (threadId: string | null) => Promise<void>;
  createThread: () => Promise<void>;
  deleteThread: (threadId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [currentThread, setCurrentThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const fetchThreads = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const { data } = await api.get('/threads');
      setThreads(data);
    } catch (err) {
      console.error('Failed to fetch threads', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) fetchThreads();
  }, [isAuthenticated, fetchThreads]);

  const selectThread = async (threadId: string | null) => {
    if (!threadId) {
      setCurrentThread(null);
      setMessages([]);
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await api.get(`/threads/${threadId}`);
      setCurrentThread(data);
      setMessages(data.messages);
    } catch (err) {
      console.error('Failed to fetch thread', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createThread = async () => {
    try {
      const { data } = await api.post('/threads');
      setThreads(prev => [data.newThread, ...prev]);
      setCurrentThread(data.newThread);
      setMessages([]);
    } catch (err) {
      console.error('Failed to create thread', err);
    }
  };

  const deleteThread = async (threadId: string) => {
    try {
      await api.delete(`/threads/${threadId}`);
      setThreads(prev => prev.filter(t => t._id !== threadId));
      if (currentThread?._id === threadId) {
        setCurrentThread(null);
        setMessages([]);
      }
    } catch (err) {
      console.error('Failed to delete thread', err);
    }
  };

  const sendMessage = async (content: string) => {
    if (!currentThread) return;

    const userMessage: Message = {
      _id: `temp_${Date.now()}`,
      role: 'user',
      content,
      timeStamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsSending(true);

    try {
      const { data } = await api.post('/messages', {
        threadId: currentThread._id,
        content,
      });

      const assistantMessage: Message = {
        _id: `temp_${Date.now() + 1}`,
        role: 'assistant',
        content: data.assistantResponse,
        timeStamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev.filter(m => m._id !== userMessage._id), userMessage, assistantMessage]);

      if (data.newTitle) {
        setThreads(prev =>
          prev.map(t => (t._id === currentThread._id ? { ...t, title: data.newTitle } : t))
        );
        setCurrentThread(prev => (prev ? { ...prev, title: data.newTitle } : null));
      }
    } catch (err) {
      console.error('Failed to send message', err);
      setMessages(prev => [
        ...prev,
        {
          _id: `err_${Date.now()}`,
          role: 'assistant',
          content: "Sorry, I couldn't get a response. Please try again.",
          timeStamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSending(false);
      if (currentThread) selectThread(currentThread._id);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        threads,
        currentThread,
        messages,
        isLoading,
        isSending,
        fetchThreads,
        selectThread,
        createThread,
        deleteThread,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
