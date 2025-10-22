import React, { useMemo } from "react";
import type { Message } from "../../types";
import Icon from "../ui/Icon";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ChatMessageProps {
  message?: Message;
}

interface CodeBlockProps {
  inline: boolean;
  className?: string;
  children: string[];
  isUser?: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ inline, className, children, isUser }) => {
  const match = /language-(\w+)/.exec(className || "");
  if (!inline && match) {
    return (
      <SyntaxHighlighter
        style={oneDark}
        language={match[1]}
        PreTag="div"
        customStyle={{
          borderRadius: 6,
          padding: 12,
          margin: "12px 0",
          overflowX: "auto",
          backgroundColor: isUser ? "#323437FF" : "#292A2DFF",
        }}
        showLineNumbers
        wrapLines
        lineProps={{ style: { wordBreak: "break-word" } }}
        className="modern-scrollbar"
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    );
  }

  return (
    <code
      className="inline-code font-mono rounded px-1 py-0.5"
      style={{
        backgroundColor: "#323437FF",
        color: "#f5f5f5",
        fontSize: "0.9rem",
      }}
    >
      {children}
    </code>
  );
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  if (!message) return null;

  const isUser = message.role === "user";

  const parsedContent = useMemo(() => {
    return (
      <ReactMarkdown
        children={message.content || ""}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          code: ({ inline, className, children }) => (
            <CodeBlock
              inline={!!inline}
              className={className || undefined}
              isUser={isUser}
              children={Array.isArray(children) ? children : [children]}
            />
          ),
          strong: ({ children }) => (
            <span
              className="rounded px-1 py-0.5 font-semibold"
              style={{
                backgroundColor: "#45494E",
                color: "#f9fafb",
              }}
            >
              {children}
            </span>
          ),
          p: ({ children }) => (
            <p className="break-words whitespace-pre-wrap leading-relaxed">{children}</p>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-500 pl-4 italic text-gray-400 my-2">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-2 text-gray-200 space-y-0.5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-2 text-gray-200 space-y-0.5">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-snug">{children}</li>,
          img: ({ alt, src }) => (
            <img
              src={src}
              alt={alt}
              loading="lazy"
              style={{ maxWidth: "100%", borderRadius: 8, margin: "0.25rem 0" }}
            />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto scrollbar-modern mb-3 rounded-md border border-gray-600">
              <table className="w-full border-collapse text-sm text-gray-100">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-gray-700">{children}</thead>,
          th: ({ children }) => (
            <th className="border border-gray-600 px-2 py-1 text-left">{children}</th>
          ),
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => (
            <tr className="border-b border-gray-600 last:border-0 hover:bg-gray-800">{children}</tr>
          ),
          td: ({ children }) => (
            <td className="border border-gray-600 px-2 py-1 align-top">{children}</td>
          ),
        }}
      />
    );
  }, [message.content, isUser]);

  return (
    <div
      aria-live="polite"
      className={`flex my-2 ${isUser ? "justify-end" : "justify-start"}`}
      role="listitem"
      tabIndex={0}
    >
      <div
        className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
        style={{ maxWidth: "70%" }}
      >
        {/* Avatar */}
        <div
          className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-600"
          aria-label={isUser ? "User avatar" : "Bot avatar"}
        >
          <Icon name={isUser ? "user" : "chatterbox"} className="w-5 h-5" />
        </div>

        {/* Message bubble */}
        <div
          className="rounded-xl"
          style={{
            backgroundColor: isUser ? "#323437FF" : "#292A2DFF",
            color: isUser ? "#eee" : "#e5e7eb",
            padding: "0.75rem 1rem",
            width: "100%",
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
          }}
        >
          {parsedContent}
        </div>
      </div>

      <style>{`
        .modern-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(100,100,100,0.6) rgba(0,0,0,0.1);
        }
        .modern-scrollbar::-webkit-scrollbar {
          height: 6px;
          width: 6px;
        }
        .modern-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(100,100,100,0.6);
          border-radius: 3px;
        }
        .modern-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(120,120,120,0.7);
        }
        .modern-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
        }
      `}</style>
    </div>
  );
};

export default ChatMessage;
