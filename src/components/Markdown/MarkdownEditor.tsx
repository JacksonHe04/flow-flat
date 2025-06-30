import React, { useCallback, useState, useRef, useEffect } from 'react';
import { EditorContent } from '@tiptap/react';
import { useRichTextEditor, useAutoSave, useLocalAutoSave } from './hooks';
import { getEditorClassName, getThemeClassName, getEditorTheme } from './styles';
import { ToolbarContainer, type ToolbarConfig } from './Toolbar';
import { getPageExtensions, getPagePreviewExtensions } from './extensions';
// import { getWordCount, getPlainText } from './utils';

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
  onSave,
  onBlur,
  onFocus,
  placeholder = '开始编写...',
  editable = true,
  className = '',
  autoFocus = false,
  showToolbar = true,
  toolbarConfig,
  showStatusBar = true,
  autoSave = true,
  autoSaveDelay = 2000,
  localStorageKey,
  fullHeight = false,
  maxWidth = '100%',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * 处理保存操作
   */
  const handleSave = useCallback(async (contentToSave: string) => {
    if (!onSave) return;
    
    setIsSaving(true);
    try {
      await onSave(contentToSave);
      setLastSaved(new Date());
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      setIsSaving(false);
    }
  }, [onSave]);

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
   * 自动保存功能
   */
  useAutoSave({
    content,
    onSave: handleSave,
    enabled: autoSave && !!onSave,
    delay: autoSaveDelay,
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
   * 手动保存快捷键
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault();
        if (content && onSave) {
          handleSave(content);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [content, handleSave, onSave]);

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

  /**
   * 格式化最后保存时间
   */
  const formatLastSaved = () => {
    if (!lastSaved) return '';
    
    const now = new Date();
    const diff = now.getTime() - lastSaved.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return '刚刚保存';
    if (minutes < 60) return `${minutes}分钟前保存`;
    
    return lastSaved.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
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
          <div className="flex items-center space-x-4">
            {/* 字数统计 */}
            <span>
              {editor?.storage.characterCount?.words() || 0} 词 · {editor?.storage.characterCount?.characters() || 0} 字符
            </span>
            
            {/* 保存状态 */}
            {onSave && (
              <span className="flex items-center space-x-1">
                {isSaving ? (
                  <>
                    <div className="w-3 h-3 border border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span>保存中...</span>
                  </>
                ) : lastSaved ? (
                  <span className="text-green-600 dark:text-green-400">
                    {formatLastSaved()}
                  </span>
                ) : (
                  <span>未保存</span>
                )}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* 编辑模式指示 */}
            <span className={`
              px-2 py-1 rounded text-xs font-medium
              ${editable 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }
            `}>
              {editable ? '编辑' : '预览'}
            </span>
            
            {/* 快捷键提示 */}
            {editable && onSave && (
              <span className="text-xs text-gray-400">
                ⌘S 保存
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;