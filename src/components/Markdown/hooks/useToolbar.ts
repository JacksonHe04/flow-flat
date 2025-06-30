import { useState, useEffect, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { getFormatState } from '../utils/formatUtils';

/**
 * 工具栏状态接口
 */
export interface ToolbarState {
  bold: boolean;
  italic: boolean;
  strike: boolean;
  code: boolean;
  heading1: boolean;
  heading2: boolean;
  heading3: boolean;
  paragraph: boolean;
  bulletList: boolean;
  orderedList: boolean;
  taskList: boolean;
  blockquote: boolean;
  codeBlock: boolean;
  link: boolean;
  canUndo: boolean;
  canRedo: boolean;
}

/**
 * 工具栏Hook返回值接口
 */
export interface UseToolbarReturn {
  state: ToolbarState;
  updateState: () => void;
}

/**
 * 工具栏状态管理Hook
 * 管理工具栏按钮的激活状态
 */
export const useToolbar = (editor: Editor | null): UseToolbarReturn => {
  const [state, setState] = useState<ToolbarState>({
    bold: false,
    italic: false,
    strike: false,
    code: false,
    heading1: false,
    heading2: false,
    heading3: false,
    paragraph: false,
    bulletList: false,
    orderedList: false,
    taskList: false,
    blockquote: false,
    codeBlock: false,
    link: false,
    canUndo: false,
    canRedo: false,
  });

  /**
   * 更新工具栏状态
   */
  const updateState = useCallback(() => {
    if (!editor) return;

    const formatState = getFormatState(editor);
    
    setState({
      ...formatState,
      canUndo: editor.can().undo(),
      canRedo: editor.can().redo(),
    });
  }, [editor]);

  // 监听编辑器状态变化
  useEffect(() => {
    if (!editor) return;

    // 初始化状态
    updateState();

    // 监听选择变化
    const handleSelectionUpdate = () => {
      updateState();
    };

    // 监听内容变化
    const handleUpdate = () => {
      updateState();
    };

    // 监听焦点变化
    const handleFocus = () => {
      updateState();
    };

    editor.on('selectionUpdate', handleSelectionUpdate);
    editor.on('update', handleUpdate);
    editor.on('focus', handleFocus);

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
      editor.off('update', handleUpdate);
      editor.off('focus', handleFocus);
    };
  }, [editor, updateState]);

  return {
    state,
    updateState,
  };
};

/**
 * 链接编辑Hook
 */
export const useLinkEditor = (editor: Editor | null) => {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');

  /**
   * 打开链接编辑器
   */
  const openLinkEditor = useCallback(() => {
    if (!editor) return;
    
    const { href } = editor.getAttributes('link');
    setUrl(href || '');
    setIsOpen(true);
  }, [editor]);

  /**
   * 关闭链接编辑器
   */
  const closeLinkEditor = useCallback(() => {
    setIsOpen(false);
    setUrl('');
  }, []);

  /**
   * 设置链接
   */
  const setLink = useCallback((href: string) => {
    if (!editor) return;
    
    if (href) {
      // Link扩展暂时移除，功能暂不可用
      console.warn('Link功能暂时不可用', { href });
    } else {
      // Link扩展暂时移除，功能暂不可用
      console.warn('Link功能暂时不可用');
    }
    
    closeLinkEditor();
  }, [editor, closeLinkEditor]);

  return {
    isOpen,
    url,
    setUrl,
    openLinkEditor,
    closeLinkEditor,
    setLink,
  };
};

/**
 * 图片上传Hook
 */
export const useImageUpload = (editor: Editor | null) => {
  const [isUploading, setIsUploading] = useState(false);

  /**
   * 处理图片上传
   */
  const handleImageUpload = useCallback(async (file: File) => {
    if (!editor) return;
    
    setIsUploading(true);
    
    try {
      // 这里应该实现实际的图片上传逻辑
      // 暂时使用本地URL
      const url = URL.createObjectURL(file);
      
      // Image扩展暂时移除，功能暂不可用
      console.warn('Image功能暂时不可用', { src: url, alt: file.name });
    } catch (error) {
      console.error('图片上传失败:', error);
    } finally {
      setIsUploading(false);
    }
  }, [editor]);

  /**
   * 从URL插入图片
   */
  const insertImageFromUrl = useCallback((src: string, alt?: string) => {
    if (!editor) return;
    
    // Image扩展暂时移除，功能暂不可用
    console.warn('Image功能暂时不可用', { src, alt });
  }, [editor]);

  return {
    isUploading,
    handleImageUpload,
    insertImageFromUrl,
  };
};