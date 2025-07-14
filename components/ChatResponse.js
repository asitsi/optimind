import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypePrism from 'rehype-prism-plus';
import 'github-markdown-css/github-markdown.css';
import 'prismjs/themes/prism-tomorrow.css';

const ChatResponse = ({ response }) => {
  const CodeBlock = ({ node, inline, className, children, ...props }) => {
    const [copy, setCopy] = useState('Copy')
    const match = /language-(\w+)/.exec(className || '');

    const extractCode = (node) => {
      if (typeof node === 'string') return node;
      if (Array.isArray(node)) return node.map(extractCode).join('');
      if (React.isValidElement(node)) return extractCode(node.props.children);
      return '';
    };

    const code = extractCode(children);

    const handleCopy = () => {
      navigator.clipboard.writeText(code);
      setCopy("Copied")
      setTimeout(()=>{
        setCopy("Copy")
      }, 1000)
    };

    return !inline && match ? (
      <div style={{ position: 'relative' }}>
        <button
          onClick={handleCopy}
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            padding: '0.2rem 0.5rem',
            fontSize: '0.8rem',
            background: '#2d2d2d',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            zIndex: 2
          }}
        >
          {copy}
        </button>
        <pre className={className} {...props}>
          <code>{code}</code>
        </pre>
      </div>
    ) : (
      <code className={className} {...props}>{code}</code>
    );
  };



  return (
    <div className="space-y-4">
      <div className="prose prose-invert max-w-none">
        <div className="text-gray-100 leading-relaxed whitespace-pre-wrap">
          <div className="markdown-body" style={{ padding: '1rem', background: '#f9f9f9', color: "#000" }}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypePrism]}
              components={{
                code: CodeBlock,
              }}
            >
              {response}
            </ReactMarkdown>
          </div>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
    </div>
  );
};

export default ChatResponse;
