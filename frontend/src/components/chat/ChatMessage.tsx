import React, { useMemo } from 'react';
import type { Message } from '../../types';
import Icon from '../ui/Icon';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatMessageProps {
  message?: Message;
}

const CodeBlock: React.FC<{ inline: boolean; className?: string; children: string[]; isUser?: boolean }> = ({
  inline,
  className,
  children,
  isUser,
}) => {
  const match = /language-(\w+)/.exec(className || '');
  return !inline && match ? (
    <SyntaxHighlighter
      style={oneDark}
      language={match[1]}
      PreTag="div"
      customStyle={{
        borderRadius: 6,
        padding: 12,
        margin: '12px 0',
        overflowX: 'auto',
      }}
      showLineNumbers
      wrapLines
      lineProps={{ style: { wordBreak: 'break-word' } }}
      className="modern-scrollbar"
    >
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  ) : (
    <code
      className="inline-code font-mono rounded px-1 py-0.5"
      style={{
        backgroundColor: '#323437',
        color: '#f5f5f5',
      }}
    >
      {children}
    </code>
  );
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  if (!message) return null;
  const isUser = message.role === 'user';

  const parsedContent = useMemo(() => {
    return (
      <ReactMarkdown
        children={message.content || ''}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          code: ({ inline, className, children }) => (
            <CodeBlock inline={inline} className={className} isUser={isUser}>
              {Array.isArray(children) ? children : [children]}
            </CodeBlock>
          ),
          strong: ({ children }) => (
            <span
              className="rounded px-1 py-0.5 font-semibold"
              style={{
                backgroundColor: '#323437',
                color: '#f9fafb', // text-gray-50
              }}
            >
              {children}
            </span>
          ),
          p: ({ children }) => <p className="break-words whitespace-pre-wrap mb-2">{children}</p>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-500 pl-4 italic text-gray-400 my-3">{children}</blockquote>
          ),
          ul: ({ children }) => <ul className="list-disc list-inside mb-2 text-gray-200 space-y-0.5">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-2 text-gray-200 space-y-0.5">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          img: ({ alt, src }) => (
            <img src={src} alt={alt} loading="lazy" style={{ maxWidth: '100%', borderRadius: 8, margin: '0.5rem 0' }} />
          ),
        }}
      />
    );
  }, [message.content, isUser]);

  return (
    <div
      aria-live="polite"
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} my-3`}
      role="listitem"
      tabIndex={0}
    >
      <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div
          className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-600"
          aria-label={isUser ? 'User avatar' : 'Bot avatar'}
        >
          <Icon name={isUser ? 'user' : 'bot'} className="w-5 h-5" />
        </div>

        {/* Message bubble */}
        <div
          className={`rounded-xl`}
          style={{
            backgroundColor: isUser ? '#323437FF' : '#292A2DFF',
            color: isUser ? '#eee' : '#e5e7eb',
            padding: isUser ? '1rem' : '0.75rem',
            maxWidth: '70%',
            width: 'fit-content',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
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
