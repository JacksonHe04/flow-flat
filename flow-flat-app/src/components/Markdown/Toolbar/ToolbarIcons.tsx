import React from 'react';
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Code, 
  Link, 
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered
} from 'lucide-react';

// Bold icon
export const BoldIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <Bold className={className} />
);

// Italic icon
export const ItalicIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <Italic className={className} />
);

// Strikethrough icon
export const StrikethroughIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <Strikethrough className={className} />
);

// Code icon
export const CodeIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <Code className={className} />
);

// Link icon
export const LinkIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <Link className={className} />
);

// Paragraph icon (using Type icon which represents text/paragraph)
export const ParagraphIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <Type className={className} />
);

// Heading 1 icon
export const Heading1Icon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <Heading1 className={className} />
);

// Heading 2 icon
export const Heading2Icon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <Heading2 className={className} />
);

// Heading 3 icon
export const Heading3Icon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <Heading3 className={className} />
);

// Unordered list icon
export const UnorderedListIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <List className={className} />
);

// Ordered list icon
export const OrderedListIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <ListOrdered className={className} />
);

/**
 * 引用块图标
 */
export const BlockquoteIcon: React.FC = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

/**
 * 代码块图标
 */
export const CodeBlockIcon: React.FC = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

/**
 * 水平分割线图标
 */
export const HorizontalRuleIcon: React.FC = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
  </svg>
);

/**
 * 撤销图标
 */
export const UndoIcon: React.FC = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
  </svg>
);

/**
 * 重做图标
 */
export const RedoIcon: React.FC = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
  </svg>
);

/**
 * 清除格式图标
 */
export const ClearFormatIcon: React.FC = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);