import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

/**
 * IDE项目接口
 */
export interface IdeProject {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * IDE状态接口
 */
interface IdeState {
  items: IdeProject[];
  loading: boolean;
  error: string | null;
}

/**
 * IDE操作接口
 */
interface IdeActions {
  /**
   * 添加IDE项目
   */
  addProject: (project: IdeProject) => void;
  /**
   * 删除IDE项目
   */
  removeProject: (id: string) => void;
  /**
   * 更新IDE项目
   */
  updateProject: (project: IdeProject) => void;
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
 * IDE状态管理store
 */
export const useIdeStore = create<IdeState & IdeActions>()(immer((set) => ({
  // 初始状态
  items: [
    {
      id: '1',
      title: '示例IDE项目',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ],
  loading: false,
  error: null,

  // 操作方法
  addProject: (project) => set((state) => {
    state.items.push(project);
  }),

  removeProject: (id) => set((state) => {
    state.items = state.items.filter(project => project.id !== id);
  }),

  updateProject: (project) => set((state) => {
    const index = state.items.findIndex(item => item.id === project.id);
    if (index !== -1) {
      state.items[index] = project;
    }
  }),

  setLoading: (loading) => set((state) => {
    state.loading = loading;
  }),

  setError: (error) => set((state) => {
    state.error = error;
  }),
})));