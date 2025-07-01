/**
 * 存储状态管理 Store
 * 管理白板保存状态、自动保存配置等
 */

import { create } from 'zustand';
import { boardStorageService, type SaveBoardRequest } from '@/services/boardStorage';
import { type BoardListItem } from '@/utils/indexedDB';
import { type Node } from '@/stores/nodeStore';
import { type Edge } from '@xyflow/react';

// 保存状态枚举
export enum SaveStatus {
  IDLE = 'idle',
  SAVING = 'saving',
  SUCCESS = 'success',
  ERROR = 'error',
}

// 存储状态接口
interface StorageState {
  // 保存状态
  saveStatus: SaveStatus;
  saveError: string | null;
  lastSavedAt: string | null;
  currentBoardId: string | null;
  
  // 白板列表
  boards: BoardListItem[];
  isLoadingBoards: boolean;
  
  // 自动保存配置
  autoSaveEnabled: boolean;
  autoSaveInterval: number; // 分钟
  
  // 存储使用情况
  storageUsage: { used: number; quota: number } | null;
  
  // 初始化状态
  isInitialized: boolean;
  initError: string | null;
}

// 存储操作接口
interface StorageActions {
  // 初始化
  init: () => Promise<void>;
  
  // 保存操作
  saveBoard: (request: SaveBoardRequest) => Promise<string | null>;
  loadBoard: (boardId: string) => Promise<{ nodes: Node[]; edges: Edge[] } | null>;
  deleteBoard: (boardId: string) => Promise<void>;
  
  // 白板列表管理
  refreshBoardList: () => Promise<void>;
  
  // 导入导出
  exportBoardAsJSON: (boardId: string) => Promise<string>;
  importBoardFromJSON: (jsonData: string, name: string, description?: string) => Promise<string | null>;
  
  // 状态管理
  setSaveStatus: (status: SaveStatus, error?: string) => void;
  setCurrentBoardId: (boardId: string | null) => void;
  clearSaveStatus: () => void;
  
  // 自动保存配置
  setAutoSaveEnabled: (enabled: boolean) => void;
  setAutoSaveInterval: (interval: number) => void;
  
  // 存储使用情况
  updateStorageUsage: () => Promise<void>;
  
  // 工具方法
  isBoardNameExists: (name: string, excludeBoardId?: string) => Promise<boolean>;
  cleanupOldBoards: (daysOld?: number) => Promise<number>;
}

/**
 * 存储状态管理 Store
 */
export const useStorageStore = create<StorageState & StorageActions>((set, get) => ({
  // 初始状态
  saveStatus: SaveStatus.IDLE,
  saveError: null,
  lastSavedAt: null,
  currentBoardId: null,
  boards: [],
  isLoadingBoards: false,
  autoSaveEnabled: false,
  autoSaveInterval: 5, // 默认5分钟
  storageUsage: null,
  isInitialized: false,
  initError: null,

  // 初始化
  init: async () => {
    try {
      await boardStorageService.init();
      set({ isInitialized: true, initError: null });
      
      // 加载白板列表
      await get().refreshBoardList();
      
      // 更新存储使用情况
      await get().updateStorageUsage();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize storage';
      set({ isInitialized: false, initError: errorMessage });
      throw error;
    }
  },

  // 保存白板
  saveBoard: async (request: SaveBoardRequest) => {
    const { setSaveStatus, refreshBoardList, updateStorageUsage } = get();
    
    try {
      setSaveStatus(SaveStatus.SAVING);
      
      const boardId = await boardStorageService.saveBoard(request);
      
      setSaveStatus(SaveStatus.SUCCESS);
      set({ 
        lastSavedAt: new Date().toISOString(),
        currentBoardId: boardId,
      });
      
      // 刷新白板列表
      await refreshBoardList();
      await updateStorageUsage();
      
      // 3秒后清除成功状态
      setTimeout(() => {
        if (get().saveStatus === SaveStatus.SUCCESS) {
          get().clearSaveStatus();
        }
      }, 3000);
      
      return boardId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save board';
      setSaveStatus(SaveStatus.ERROR, errorMessage);
      return null;
    }
  },

  // 加载白板
  loadBoard: async (boardId: string) => {
    try {
      const result = await boardStorageService.loadBoard(boardId);
      // 不在这里设置currentBoardId，由调用方负责设置
      return result;
    } catch (error) {
      console.error('Failed to load board:', error);
      return null;
    }
  },

  // 删除白板
  deleteBoard: async (boardId: string) => {
    try {
      await boardStorageService.deleteBoard(boardId);
      
      // 如果删除的是当前白板，清除当前白板ID
      if (get().currentBoardId === boardId) {
        set({ currentBoardId: null });
      }
      
      // 刷新白板列表
      await get().refreshBoardList();
      await get().updateStorageUsage();
    } catch (error) {
      console.error('Failed to delete board:', error);
      throw error;
    }
  },

  // 刷新白板列表
  refreshBoardList: async () => {
    try {
      set({ isLoadingBoards: true });
      const boards = await boardStorageService.getAllBoards();
      set({ boards, isLoadingBoards: false });
    } catch (error) {
      console.error('Failed to refresh board list:', error);
      set({ isLoadingBoards: false });
    }
  },

  // 导出白板为JSON
  exportBoardAsJSON: async (boardId: string) => {
    return await boardStorageService.exportBoardAsJSON(boardId);
  },

  // 从JSON导入白板
  importBoardFromJSON: async (jsonData: string, name: string, description?: string) => {
    try {
      const boardId = await boardStorageService.importBoardFromJSON(jsonData, name, description);
      
      // 刷新白板列表
      await get().refreshBoardList();
      await get().updateStorageUsage();
      
      return boardId;
    } catch (error) {
      console.error('Failed to import board:', error);
      return null;
    }
  },

  // 设置保存状态
  setSaveStatus: (status: SaveStatus, error?: string) => {
    set({ 
      saveStatus: status, 
      saveError: error || null 
    });
  },

  // 设置当前白板ID
  setCurrentBoardId: (boardId: string | null) => {
    set({ currentBoardId: boardId });
  },

  // 清除保存状态
  clearSaveStatus: () => {
    set({ 
      saveStatus: SaveStatus.IDLE, 
      saveError: null 
    });
  },

  // 设置自动保存开关
  setAutoSaveEnabled: (enabled: boolean) => {
    set({ autoSaveEnabled: enabled });
  },

  // 设置自动保存间隔
  setAutoSaveInterval: (interval: number) => {
    set({ autoSaveInterval: Math.max(1, interval) }); // 最少1分钟
  },

  // 更新存储使用情况
  updateStorageUsage: async () => {
    try {
      const usage = await boardStorageService.getStorageUsage();
      set({ storageUsage: usage });
    } catch (error) {
      console.error('Failed to get storage usage:', error);
    }
  },

  // 检查白板名称是否存在
  isBoardNameExists: async (name: string, excludeBoardId?: string) => {
    return await boardStorageService.isBoardNameExists(name, excludeBoardId);
  },

  // 清理旧白板
  cleanupOldBoards: async (daysOld: number = 30) => {
    try {
      const deletedCount = await boardStorageService.cleanupOldBoards(daysOld);
      
      // 刷新白板列表
      await get().refreshBoardList();
      await get().updateStorageUsage();
      
      return deletedCount;
    } catch (error) {
      console.error('Failed to cleanup old boards:', error);
      return 0;
    }
  },
}));