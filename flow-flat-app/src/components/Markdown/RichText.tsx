import React, { useCallback } from 'react';
import { EditorContent } from '@tiptap/react';
import { Extension } from '@tiptap/core';
import { useRichTextEditor, useDebouncedUpdate } from './hooks';
import { getEditorClassName } from './styles';
import { ToolbarContainer, type ToolbarConfig } from './Toolbar';
import { getNodeExtensions, getPageExtensions } from './extensions';

/**
 * 富文本编辑器Props接口
 */
export interface RichTextEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  placeholder?: string;
  editable?: boolean;
  variant?: 'node' | 'page';
  showToolbar?: boolean;
  toolbarConfig?: ToolbarConfig;
  className?: string;
  autoFocus?: boolean;
  extensions?: Extension[];
  debounceDelay?: number;
}

/**
 * 富文本编辑器组件
 * 基于TipTap的可配置富文本编辑器
 */
const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content = '',
  onChange,
  onBlur,
  onFocus,
  placeholder,
  editable = true,
  variant = 'page',
  showToolbar = true,
  toolbarConfig,
  className = '',
  autoFocus = false,
  extensions: customExtensions,
  debounceDelay = 300,
}) => {
  /**
   * 获取编辑器扩展配置
   */
  const getExtensions = useCallback(() => {
    if (customExtensions) {
      return customExtensions;
    }
    
    return variant === 'node' 
      ? getNodeExtensions(placeholder)
      : getPageExtensions();
  }, [variant, placeholder, customExtensions]);

  /**
   * 防抖更新函数
   */
  const debouncedOnChange = useDebouncedUpdate(
    (newContent: string) => {
      onChange?.(newContent);
    },
    debounceDelay
  );

  /**
   * 处理内容更新
   */
  const handleUpdate = useCallback((newContent: string) => {
    if (debounceDelay > 0) {
      debouncedOnChange(newContent);
    } else {
      onChange?.(newContent);
    }
  }, [onChange, debouncedOnChange, debounceDelay]);

  /**
   * 初始化编辑器
   */
  const { editor } = useRichTextEditor({
    content,
    extensions: getExtensions(),
    editable,
    autofocus: autoFocus,
    onUpdate: handleUpdate,
    onFocus,
    onBlur,
  });

  /**
   * 获取工具栏配置
   */
  const getToolbarConfig = useCallback((): ToolbarConfig => {
    const defaultConfig: ToolbarConfig = {
      compact: variant === 'node',
      showTable: variant !== 'node',
      showMedia: true,
      showHistory: variant !== 'node',
    };
    
    return { ...defaultConfig, ...toolbarConfig };
  }, [variant, toolbarConfig]);

  /**
   * 获取编辑器容器样式
   */
  const getContainerClassName = () => {
    const baseClass = 'rich-text-editor border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden';
    return `${baseClass} ${className}`.trim();
  };

  /**
   * 获取编辑器内容区域样式
   */
  const getEditorContentClassName = () => {
    return getEditorClassName(variant);
  };

  return (
    <div className={getContainerClassName()}>
      {/* 工具栏 */}
      {showToolbar && editable && (
        <ToolbarContainer
          editor={editor}
          config={getToolbarConfig()}
        />
      )}
      
      {/* 编辑器内容区域 */}
      <div className="relative">
        <EditorContent
          editor={editor}
          className={getEditorContentClassName()}
        />
        
        {/* 编辑器为空时的占位符 */}
        {editor?.isEmpty && placeholder && (
          <div className="
            absolute top-0 left-0 pointer-events-none
            text-gray-400 dark:text-gray-500
            p-4 text-sm
          ">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;