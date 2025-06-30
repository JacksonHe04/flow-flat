import { useEffect, useRef, useCallback } from 'react';
import { useDebouncedUpdate } from './useRichTextEditor';

/**
 * 自动保存Hook配置接口
 */
export interface UseAutoSaveOptions {
  content: string;
  onSave: (content: string) => void | Promise<void>;
  delay?: number;
  enabled?: boolean;
}

/**
 * 自动保存Hook返回值接口
 */
export interface UseAutoSaveReturn {
  isSaving: boolean;
  lastSaved: Date | null;
  save: () => void;
}

/**
 * 自动保存Hook
 * 提供内容自动保存功能
 */
export const useAutoSave = (options: UseAutoSaveOptions): UseAutoSaveReturn => {
  const {
    content,
    onSave,
    delay = 2000,
    enabled = true,
  } = options;

  const isSavingRef = useRef(false);
  const lastSavedRef = useRef<Date | null>(null);
  const lastContentRef = useRef(content);

  /**
   * 执行保存操作
   */
  const performSave = useCallback(async (contentToSave: string) => {
    if (!enabled || isSavingRef.current) return;
    
    // 检查内容是否有变化
    if (contentToSave === lastContentRef.current) return;
    
    isSavingRef.current = true;
    
    try {
      await onSave(contentToSave);
      lastSavedRef.current = new Date();
      lastContentRef.current = contentToSave;
    } catch (error) {
      console.error('自动保存失败:', error);
    } finally {
      isSavingRef.current = false;
    }
  }, [enabled, onSave]);

  // 防抖保存函数
  const debouncedSave = useDebouncedUpdate(performSave, delay);

  /**
   * 手动保存
   */
  const save = useCallback(() => {
    performSave(content);
  }, [content, performSave]);

  // 监听内容变化，触发自动保存
  useEffect(() => {
    if (enabled && content !== lastContentRef.current) {
      debouncedSave(content);
    }
  }, [content, enabled, debouncedSave]);

  // 页面卸载时保存
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (content !== lastContentRef.current) {
        // 同步保存，避免页面卸载时丢失数据
        onSave(content);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [content, onSave]);

  return {
    isSaving: isSavingRef.current,
    lastSaved: lastSavedRef.current,
    save,
  };
};

/**
 * 本地存储自动保存Hook
 * 将内容自动保存到localStorage
 */
export const useLocalAutoSave = (key: string, content: string, delay?: number) => {
  const saveToLocal = useCallback((contentToSave: string) => {
    try {
      localStorage.setItem(key, contentToSave);
    } catch (error) {
      console.error('保存到本地存储失败:', error);
    }
  }, [key]);

  return useAutoSave({
    content,
    onSave: saveToLocal,
    delay,
  });
};

/**
 * 从本地存储恢复内容
 */
export const useLocalRestore = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error('从本地存储恢复失败:', error);
    return null;
  }
};

/**
 * 清除本地存储的内容
 */
export const clearLocalContent = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('清除本地存储失败:', error);
  }
};