import React, { useCallback, useState, useRef } from 'react';
import { EditorContent } from '@tiptap/react';
import { useRichTextEditor, useLocalAutoSave } from './hooks';
import { getEditorClassName, getThemeClassName, getEditorTheme } from './styles';
import { ToolbarContainer, type ToolbarConfig } from './Toolbar';
import { getPageExtensions, getPagePreviewExtensions } from './extensions';

/**
 * MarkdownEditor组件Props接口
 */
export interface MarkdownEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  onSave?: (content: string) => Promise<void> | void;
  onBlur?: () => void;
  onFocus?: () => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
  autoFocus?: boolean;
  showToolbar?: boolean;
  toolbarConfig?: ToolbarConfig;
  showStatusBar?: boolean;
  autoSave?: boolean;
  autoSaveDelay?: number;
  localStorageKey?: string;
  theme?: 'light' | 'dark' | 'auto';
  fullHeight?: boolean;
  maxWidth?: string;
}

/**
 * MarkdownEditor组件
 * 用于独立页面的完整富文本编辑器
 * 提供完整的编辑功能和工具栏
 */
const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  content = '',
  onChange,
  onBlur,
  onFocus,
  placeholder = '开始编写...',
  editable = true,
  className = '',
  autoFocus = false,
  showToolbar = true,
  toolbarConfig,
  showStatusBar = true,
  localStorageKey,
  fullHeight = false,
  maxWidth = '100%',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * 处理内容更新
   */
  const handleUpdate = useCallback((newContent: string) => {
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
   * 获取编辑器扩展
   */
  const getExtensions = useCallback(() => {
    return editable 
      ? getPageExtensions()
      : getPagePreviewExtensions();
  }, [editable]);

  /**
   * 初始化编辑器
   */
  const { editor, isEmpty } = useRichTextEditor({
    content,
    extensions: getExtensions(),
    editable,
    autofocus: autoFocus,
    onUpdate: handleUpdate,
    onFocus: handleFocus,
    onBlur: handleBlur,
  });

  /**
   * 本地存储自动保存
   */
  useLocalAutoSave(
    localStorageKey || 'markdown-editor-content',
    content,
    1000
  );

  /**
   * 获取工具栏配置
   */
  const getToolbarConfig = useCallback((): ToolbarConfig => {
    const defaultConfig: ToolbarConfig = {
      compact: false,
      showTable: true,
      showMedia: true,
      showHistory: true,
    };
    
    return { ...defaultConfig, ...toolbarConfig };
  }, [toolbarConfig]);

  /**
   * 获取主题样式
   */
  const getThemeClass = () => {
    const editorTheme = getEditorTheme();
    return getThemeClassName(editorTheme, 'background');
  };

  /**
   * 获取容器样式
   */
  const getContainerClassName = () => {
    const baseClass = 'markdown-editor flex flex-col';
    const themeClass = getThemeClass();
    const heightClass = fullHeight ? 'h-full' : 'min-h-96';
    const focusClass = isFocused ? 'focused' : '';
    
    return `${baseClass} ${themeClass} ${heightClass} ${focusClass} ${className}`.trim();
  };

  /**
   * 获取编辑器内容区域样式
   */
  const getEditorContentClassName = () => {
    return getEditorClassName('page');
  };

  /**
   * 获取容器样式
   */
  const getContainerStyle = () => {
    return {
      maxWidth,
      margin: '0 auto',
    };
  };

  return (
    <div 
      ref={containerRef}
      className={getContainerClassName()}
      style={getContainerStyle()}
    >
      {/* 工具栏 */}
      {showToolbar && editable && (
        <div className="border-b border-gray-200 dark:border-gray-700">
          <ToolbarContainer
            editor={editor}
            config={getToolbarConfig()}
          />
        </div>
      )}
      
      {/* 编辑器内容区域 */}
      <div className="flex-1 relative overflow-hidden">
        <EditorContent
          editor={editor}
          className={getEditorContentClassName()}
        />
        
        {/* 占位符 */}
        {isEmpty && placeholder && (
          <div className="
            absolute top-0 left-0 pointer-events-none
            text-gray-400 dark:text-gray-500
            p-6 text-base
            select-none
          ">
            {placeholder}
          </div>
        )}
      </div>
      
      {/* 状态栏 */}
      {showStatusBar && (
        <div className="
          flex items-center justify-between
          px-4 py-2
          border-t border-gray-200 dark:border-gray-700
          bg-gray-50 dark:bg-gray-800
          text-sm text-gray-600 dark:text-gray-400
        ">
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;