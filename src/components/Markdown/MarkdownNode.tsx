import React, { useCallback, useState } from 'react';
import { EditorContent } from '@tiptap/react';
import { useRichTextEditor } from './hooks';
import { getEditorClassName } from './styles';
import { getNodeExtensions, getNodePreviewExtensions } from './extensions';
import { isContentEmpty } from './utils';

/**
 * MarkdownNode组件Props接口
 */
export interface MarkdownNodeProps {
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
  onEmpty?: () => void;
  onNotEmpty?: () => void;
}

/**
 * MarkdownNode组件
 * 用于节点内嵌的轻量级富文本编辑器
 * 专为Flow节点设计，提供简洁的编辑体验
 */
const MarkdownNode: React.FC<MarkdownNodeProps> = ({
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
  onEmpty,
  onNotEmpty,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isEmpty, setIsEmpty] = useState(isContentEmpty(content));

  /**
   * 处理内容更新
   */
  const handleUpdate = useCallback((newContent: string) => {
    const contentIsEmpty = isContentEmpty(newContent);
    
    // 更新空状态
    if (contentIsEmpty !== isEmpty) {
      setIsEmpty(contentIsEmpty);
      if (contentIsEmpty) {
        onEmpty?.();
      } else {
        onNotEmpty?.();
      }
    }
    
    onChange?.(newContent);
  }, [onChange, isEmpty, onEmpty, onNotEmpty]);

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
   * 获取编辑器扩展
   */
  const getExtensions = useCallback(() => {
    return editable 
      ? getNodeExtensions(placeholder)
      : getNodePreviewExtensions();
  }, [editable, placeholder]);

  /**
   * 初始化编辑器
   */
  const { editor } = useRichTextEditor({
    content,
    extensions: getExtensions(),
    editable,
    autofocus: autoFocus,
    onUpdate: handleUpdate,
    onFocus: handleFocus,
    onBlur: handleBlur,
  });

  /**
   * 获取容器样式
   */
  const getContainerClassName = () => {
    const baseClass = 'markdown-node relative';
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

  /**
   * 获取编辑器内容区域样式
   */
  const getEditorContentClassName = () => {
    return getEditorClassName('node');
  };

  return (
    <div className={getContainerClassName()}>
      <div 
        className="markdown-node-editor"
        style={getEditorStyle()}
      >
        <EditorContent
          editor={editor}
          className={getEditorContentClassName()}
        />
        
        {/* 占位符 */}
        {showPlaceholder && isEmpty && !isFocused && (
          <div className="
            absolute top-0 left-0 pointer-events-none
            text-gray-400 dark:text-gray-500
            p-2 text-sm
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
      
      {/* 字数统计（仅在焦点时显示） */}
      {isFocused && editor && (
        <div className="
          absolute bottom-1 right-2
          text-xs text-gray-400 dark:text-gray-500
          bg-white dark:bg-gray-800
          px-1 rounded
          pointer-events-none
        ">
          {editor.storage.characterCount?.characters() || 0}
        </div>
      )}
    </div>
  );
};

export default MarkdownNode;