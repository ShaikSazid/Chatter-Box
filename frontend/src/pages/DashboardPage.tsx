import React, { useEffect, useRef } from 'react';
import Sidebar from '../components/layout/Sidebar';
import ChatMessage from '../components/chat/ChatMessage';
import ChatInput from '../components/chat/ChatInput';
import TypingIndicator from '../components/chat/TypingIndicator';
import { useChat } from '../context/ChatContext';
import Icon from '../components/ui/Icon';

const ChatWindow: React.FC = () => {
    const { messages, currentThread, isSending, isLoading } = useChat();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages, isSending]);

    if(isLoading) {
        return <div className="flex-1 flex items-center justify-center"><p>Loading chat...</p></div>
    }

    if (!currentThread) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Icon name="bot" className="w-12 h-12 text-white"/>
                </div>
                <h1 className="text-3xl font-bold text-white">Welcome to ChatterBox</h1>
                <p className="text-gray-400 mt-2 max-w-md">Select a chat from the sidebar or start a new one to begin your conversation.</p>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col bg-gray-800/30 min-h-0">
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-4">
                    {messages.map((msg) => (
                        <ChatMessage key={msg._id} message={msg} />
                    ))}
                    {isSending && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <ChatInput />
        </div>
    )
}

const DashboardPage: React.FC = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-h-0">
        <ChatWindow />
      </main>
    </div>
  );
};

export default DashboardPage;