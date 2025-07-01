import { useEditor, Editor } from '@tiptap/react';
import { useCallback, useEffect } from 'react';
import { Extension } from '@tiptap/core';

/**
 * 富文本编辑器Hook配置接口
 */
export interface UseRichTextEditorOptions {
  content?: string;
  extensions: Extension[];
  editable?: boolean;
  autofocus?: boolean;
  placeholder?: string;
  onUpdate?: (content: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onSelectionUpdate?: () => void;
}

/**
 * 富文本编辑器Hook返回值接口
 */
export interface UseRichTextEditorReturn {
  editor: Editor | null;
  isEmpty: boolean;
  isFocused: boolean;
  wordCount: number;
  characterCount: number;
}

/**
 * 富文本编辑器自定义Hook
 * 封装TipTap编辑器的创建和状态管理
 */
export const useRichTextEditor = (options: UseRichTextEditorOptions): UseRichTextEditorReturn => {
  const {
    content = '',
    extensions,
    editable = true,
    autofocus = false,
    onUpdate,
    onFocus,
    onBlur,
    onSelectionUpdate,
  } = options;

  const editor = useEditor({
    extensions,
    content,
    editable,
    autofocus,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onUpdate?.(html);
    },
    onFocus: () => {
      onFocus?.();
    },
    onBlur: () => {
      onBlur?.();
    },
    onSelectionUpdate: () => {
      onSelectionUpdate?.();
    },
  });

  // 更新编辑器内容
  const updateContent = useCallback((newContent: string) => {
    if (editor && newContent !== editor.getHTML()) {
      editor.commands.setContent(newContent);
    }
  }, [editor]);

  // 当外部content变化时更新编辑器
  useEffect(() => {
    updateContent(content);
  }, [content, updateContent]);

  // 更新编辑器可编辑状态
  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editor, editable]);

  // 计算编辑器状态
  const isEmpty = editor?.isEmpty ?? true;
  const isFocused = editor?.isFocused ?? false;
  const wordCount = editor?.storage.characterCount?.words() ?? 0;
  const characterCount = editor?.storage.characterCount?.characters() ?? 0;

  return {
    editor,
    isEmpty,
    isFocused,
    wordCount,
    characterCount,
  };
};

/**
 * 编辑器内容变化防抖Hook
 */
export const useDebouncedUpdate = (callback: (content: string) => void, delay: number = 300) => {
  const debouncedCallback = useCallback(
    (content: string) => {
      const debouncedFn = debounce(callback, delay);
      debouncedFn(content);
    },
    [callback, delay]
  );

  return debouncedCallback;
};

/**
 * 防抖函数
 */
function debounce(
  func: (content: string) => void,
  wait: number
): (content: string) => void {
  let timeout: number | null = null;
  
  return (content: string) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = window.setTimeout(() => func(content), wait);
  };
}