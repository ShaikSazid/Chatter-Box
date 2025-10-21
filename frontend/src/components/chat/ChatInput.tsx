import React, { useState, useRef, useEffect } from "react";
import { useChat } from "../../context/ChatContext";
import Icon from "../ui/Icon";
import Spinner from "../ui/Spinner";

const ChatInput: React.FC = () => {
  const [content, setContent] = useState("");
  const { sendMessage, isSending, currentThread } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height to shrink if text is deleted
      const scrollHeight = textarea.scrollHeight;
      // Set a max height (e.g., 200px)
      textarea.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !isSending && currentThread) {
      sendMessage(content.trim());
      setContent("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // Safe to cast here because we prevent default and call the form handler
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          currentThread
            ? "Type your message..."
            : "Create or select a chat to start conversation"
        }
        className="w-full bg-gray-700 border border-transparent rounded-lg p-4 pr-16 text-white resize-none focus:outline-none focus:ring-2 focus:ring-gray-600 transition-all overflow-y-auto"
        rows={1}
        disabled={isSending || !currentThread}
      />

      <button
        type="submit"
        disabled={isSending || !content.trim() || !currentThread}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700/50 disabled:text-gray-500 disabled:cursor-not-allowed rounded-full transition-colors"
        title="Send message"
      >
        {isSending ? (
          <Spinner size="w-5 h-5" />
        ) : (
          <Icon name="send" className="w-5 h-5" />
        )}
      </button>
    </form>
  );
};

export default ChatInput;
