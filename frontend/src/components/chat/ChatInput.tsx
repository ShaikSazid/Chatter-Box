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
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(scrollHeight, 300)}px`;
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
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative rounded-3xl shadow-[0_0_10px_#2D3032FF] transition-all"
      style={{ backgroundColor: "#1A1D1DFF" }}
    >
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={currentThread ? "Ask ChatterBox" : "Select a chat to start"}
        className="w-full bg-transparent text-white resize-none focus:outline-none px-5 py-6 pr-16 rounded-3xl placeholder-gray-500 text-base leading-relaxed max-h-72 overflow-y-auto"
        rows={1}
      />

      <style>
        {`
          textarea::-webkit-scrollbar {
            width: 0px;
            background: transparent;
          }
        `}
      </style>

      <button
        type="submit"
        disabled={isSending || !content.trim() || !currentThread}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700/50 disabled:text-gray-500 disabled:cursor-not-allowed rounded-full transition-colors"
        title="Send message"
      >
        {isSending ? <Spinner size="w-5 h-5" /> : <Icon name="send" className="w-5 h-5" />}
      </button>
    </form>
  );
};

export default ChatInput;
