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
      taskList: false, // TaskList扩展已移除
      link: false, // Link扩展已移除
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