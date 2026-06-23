'use client';

import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  children?: ReactNode;
  className?: string;
}

/**
 * 自定义代码块：带文件名/语言标签 + 一键复制
 */
export function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // 从 className 提取语言（rehype-pretty-code 格式：language-xxx）
  const language = className?.match(/language-(\w+)/)?.[1];

  // 提取文本内容
  const extractText = (node: any): string => {
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(extractText).join('');
    if (node?.props?.children) return extractText(node.props.children);
    return '';
  };

  const codeText = extractText(children);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="group relative my-6 overflow-hidden rounded border border-border-subtle bg-bg-elevated">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-subtle px-4 py-2">
        <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
          {language || 'text'}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code"
          className={cn(
            'rounded px-2 py-1 font-mono text-xs transition-colors',
            copied ? 'text-accent' : 'text-text-muted hover:text-text-primary'
          )}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>

      {/* Code */}
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}
