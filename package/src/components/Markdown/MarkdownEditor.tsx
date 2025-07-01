import React, { useState, useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';

interface MarkdownEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
  autoFocus?: boolean;
  minHeight?: number;
  maxHeight?: number;
  showPlaceholder?: boolean;
}

/**
 * 检查内容是否为空
 */
const isContentEmpty = (content: string): boolean => {
  if (!content || content.trim() === '') return true;
  
  // 移除HTML标签后检查是否为空
  const textContent = content.replace(/<[^>]*>/g, '').trim();
  return textContent === '';
};

/**
 * Markdown编辑器组件
 * 基于TipTap的轻量级富文本编辑器
 */
const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  content = '',
  onChange,
  onBlur,
  onFocus,
  placeholder = '输入内容...',
  editable = true,
  className = '',
  autoFocus = false,
  minHeight = 40,
  maxHeight = 300,
  showPlaceholder = true,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isEmpty, setIsEmpty] = useState(isContentEmpty(content));

  /**
   * 处理内容更新
   */
  const handleUpdate = useCallback((newContent: string) => {
    const contentIsEmpty = isContentEmpty(newContent);
    setIsEmpty(contentIsEmpty);
    onChange?.(newContent);
  }, [onChange]);

  /**
   * 处理焦点事件
   */
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocus?.();
  }, [onFocus]);

  /**
   * 处理失焦事件
   */
  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

  /**
   * 处理键盘事件，阻止删除键等事件冒泡到父组件
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // 阻止删除键、退格键、方向键等编辑相关按键的事件冒泡
    if (
      e.key === 'Delete' ||
      e.key === 'Backspace' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'Enter' ||
      e.key === 'Tab' ||
      e.key === 'Escape' ||
      (e.ctrlKey || e.metaKey) // Ctrl/Cmd + 任意键的组合
    ) {
      e.stopPropagation();
    }
  }, []);

  /**
   * 初始化编辑器
   */
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder,
      }),
      Typography,
    ],
    content,
    editable,
    autofocus: autoFocus,
    onUpdate: ({ editor }) => {
      handleUpdate(editor.getHTML());
    },
    onFocus: handleFocus,
    onBlur: handleBlur,
  });

  // 同步外部内容变化
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  /**
   * 获取容器样式
   */
  const getContainerClassName = () => {
    const baseClass = 'markdown-editor relative';
    const focusClass = isFocused ? 'focused' : '';
    const emptyClass = isEmpty ? 'empty' : '';
    const editableClass = editable ? 'editable' : 'readonly';
    
    return `${baseClass} ${focusClass} ${emptyClass} ${editableClass} ${className}`.trim();
  };

  /**
   * 获取编辑器样式
   */
  const getEditorStyle = () => {
    return {
      minHeight: `${minHeight}px`,
      maxHeight: `${maxHeight}px`,
      overflow: 'auto',
    };
  };

  return (
    <div className={getContainerClassName()}>
      <div 
        className="markdown-editor-content"
        style={getEditorStyle()}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <EditorContent
          editor={editor}
          className="
            prose prose-sm max-w-none
            focus:outline-none
            text-slate-700 dark:text-slate-300
            [&_.ProseMirror]:outline-none
            [&_.ProseMirror]:p-2
            [&_.ProseMirror]:min-h-full
          "
        />
        
        {/* 占位符 */}
        {showPlaceholder && isEmpty && !isFocused && (
          <div className="
            absolute top-2 left-2 pointer-events-none
            text-slate-400 dark:text-slate-500
            text-sm
            select-none
          ">
            {placeholder}
          </div>
        )}
        
        {/* 焦点指示器 */}
        {isFocused && (
          <div className="
            absolute inset-0 pointer-events-none
            border-2 border-blue-500 dark:border-blue-400
            rounded-md
            transition-all duration-200
          " />
        )}
      </div>
    </div>
  );
};

export default MarkdownEditor;