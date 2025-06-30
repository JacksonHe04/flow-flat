import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

/**
 * 白板接口
 */
export interface Board {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 白板状态接口
 */
interface BoardState {
  items: Board[];
  loading: boolean;
  error: string | null;
}

/**
 * 白板操作接口
 */
interface BoardActions {
  /**
   * 添加白板
   */
  addBoard: (board: Board) => void;
  /**
   * 删除白板
   */
  removeBoard: (id: string) => void;
  /**
   * 更新白板
   */
  updateBoard: (board: Board) => void;
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
 * 白板状态管理store
 */
export const useBoardStore = create<BoardState & BoardActions>()(immer((set) => ({
  // 初始状态
  items: [
    {
      id: '1',
      title: '示例白板',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ],
  loading: false,
  error: null,

  // 操作方法
  addBoard: (board) => set((state) => {
    state.items.push(board);
  }),

  removeBoard: (id) => set((state) => {
    state.items = state.items.filter(board => board.id !== id);
  }),

  updateBoard: (board) => set((state) => {
    const index = state.items.findIndex(item => item.id === board.id);
    if (index !== -1) {
      state.items[index] = board;
    }
  }),

  setLoading: (loading) => set((state) => {
    state.loading = loading;
  }),

  setError: (error) => set((state) => {
    state.error = error;
  }),
})));