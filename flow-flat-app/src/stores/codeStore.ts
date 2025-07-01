import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

/**
 * Code项目接口
 */
export interface CodeProject {
  id: string;
  title: string;
  content: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Code状态接口
 */
interface CodeState {
  items: CodeProject[];
  loading: boolean;
  error: string | null;
}

/**
 * Code操作接口
 */
interface CodeActions {
  /**
   * 添加Code项目
   */
  addProject: (project: CodeProject) => void;
  /**
   * 删除Code项目
   */
  removeProject: (id: string) => void;
  /**
   * 更新Code项目
   */
  updateProject: (project: CodeProject) => void;
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
 * Code状态管理store
 */
export const useCodeStore = create<CodeState & CodeActions>()(immer((set) => ({
  // 初始状态
  items: [
    {
      id: '1',
      title: '示例Code项目',
      content: '// 欢迎使用代码编辑器\nconsole.log("Hello, World!");\n\n// 这是一个示例JavaScript代码\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconst message = greet("开发者");\nconsole.log(message);',
      language: 'javascript',
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