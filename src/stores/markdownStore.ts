import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

/**
 * Markdown文档接口
 */
export interface MarkdownDoc {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Markdown状态接口
 */
interface MarkdownState {
  items: MarkdownDoc[];
  loading: boolean;
  error: string | null;
}

/**
 * Markdown操作接口
 */
interface MarkdownActions {
  /**
   * 添加Markdown文档
   */
  addMarkdown: (doc: MarkdownDoc) => void;
  /**
   * 删除Markdown文档
   */
  removeMarkdown: (id: string) => void;
  /**
   * 更新Markdown文档
   */
  updateMarkdown: (doc: MarkdownDoc) => void;
  /**
   * 设置加载状态
   */
  setLoading: (loading: boolean) => void;
  /**
   * 设置错误信息
   */
  setError: (error: string | null) => void;
}

/**
 * Markdown状态管理store
 */
export const useMarkdownStore = create<MarkdownState & MarkdownActions>()(immer((set) => ({
  // 初始状态
  items: [
    {
      id: '1',
      title: '示例Markdown文档',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ],
  loading: false,
  error: null,

  // 操作方法
  addMarkdown: (doc) => set((state) => {
    state.items.push(doc);
  }),

  removeMarkdown: (id) => set((state) => {
    state.items = state.items.filter(doc => doc.id !== id);
  }),

  updateMarkdown: (doc) => set((state) => {
    const index = state.items.findIndex(item => item.id === doc.id);
    if (index !== -1) {
      state.items[index] = doc;
    }
  }),

  setLoading: (loading) => set((state) => {
    state.loading = loading;
  }),

  setError: (error) => set((state) => {
    state.error = error;
  }),
})));