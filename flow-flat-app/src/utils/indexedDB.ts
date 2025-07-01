/**
 * IndexedDB 工具类
 * 提供数据库初始化、基础CRUD操作和错误处理
 */

// 数据库配置
const DB_NAME = 'FlowFlatDB';
const DB_VERSION = 1;
const STORE_NAME = 'boards';

import type { Node } from '@/stores/nodeStore';
import type { Edge } from '@xyflow/react';

// 白板数据接口
export interface BoardData {
  boardId: string;           // 白板唯一ID
  name: string;              // 白板名称
  description?: string;      // 白板描述
  version: string;           // 数据版本
  timestamp: string;         // 时间戳
  nodes: Node[];             // 节点数据
  edges: Edge[];             // 连线数据
  metadata: {
    nodeCount: number;
    edgeCount: number;
    exportedBy: string;
  };
  createdAt: string;         // 创建时间
  updatedAt: string;         // 更新时间
}

// 白板列表项接口
export interface BoardListItem {
  boardId: string;
  name: string;
  description?: string;
  nodeCount: number;
  edgeCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * IndexedDB 工具类
 */
class IndexedDBUtil {
  private db: IDBDatabase | null = null;

  /**
   * 检查浏览器是否支持 IndexedDB
   */
  static isSupported(): boolean {
    return typeof indexedDB !== 'undefined';
  }

  /**
   * 实例方法：检查浏览器是否支持 IndexedDB
   */
  isSupported(): boolean {
    return IndexedDBUtil.isSupported();
  }

  /**
   * 初始化数据库
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // 创建白板存储
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'boardId' });
          
          // 创建索引
          store.createIndex('name', 'name', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
          store.createIndex('updatedAt', 'updatedAt', { unique: false });
        }
      };
    });
  }

  /**
   * 确保数据库已初始化
   */
  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db;
  }

  /**
   * 保存白板数据
   */
  async saveBoard(boardData: BoardData): Promise<void> {
    console.log('IndexedDB saveBoard called with:', {
      boardId: boardData.boardId,
      name: boardData.name,
      nodesCount: boardData.nodes?.length,
      edgesCount: boardData.edges?.length
    });
    console.log('IndexedDB full boardData:', boardData);
    console.log('IndexedDB nodes array:', boardData.nodes);
    console.log('IndexedDB edges array:', boardData.edges);
    
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      transaction.onerror = (event) => {
        console.error('Transaction error:', event);
        const target = event.target as IDBTransaction;
        reject(new Error(`Transaction failed: ${target?.error?.message || 'Unknown error'}`));
      };
      
      const request = store.put(boardData);
      
      request.onsuccess = () => {
        console.log('Board saved successfully:', boardData.boardId);
        resolve();
      };
      
      request.onerror = (event) => {
        const target = event.target as IDBRequest;
        console.error('Save request error:', event, target?.error);
        reject(new Error(`Failed to save board: ${target?.error?.message || 'Unknown error'}`));
      };
    });
  }

  /**
   * 获取白板数据
   */
  async getBoard(boardId: string): Promise<BoardData | null> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      
      const request = store.get(boardId);
      
      request.onsuccess = () => {
        resolve(request.result || null);
      };
      request.onerror = () => reject(new Error('Failed to get board'));
    });
  }

  /**
   * 获取所有白板列表
   */
  async getAllBoards(): Promise<BoardListItem[]> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      
      const request = store.getAll();
      
      request.onsuccess = () => {
        const boards = request.result.map((board: BoardData) => ({
          boardId: board.boardId,
          name: board.name,
          description: board.description,
          nodeCount: board.metadata.nodeCount,
          edgeCount: board.metadata.edgeCount,
          createdAt: board.createdAt,
          updatedAt: board.updatedAt,
        }));
        resolve(boards);
      };
      request.onerror = () => reject(new Error('Failed to get boards'));
    });
  }

  /**
   * 删除白板
   */
  async deleteBoard(boardId: string): Promise<void> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const request = store.delete(boardId);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to delete board'));
    });
  }

  /**
   * 获取存储使用情况（如果浏览器支持）
   */
  async getStorageUsage(): Promise<{ used: number; quota: number } | null> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        return {
          used: estimate.usage || 0,
          quota: estimate.quota || 0,
        };
      } catch (error) {
        console.warn('Failed to get storage estimate:', error);
      }
    }
    return null;
  }
}

// 导出单例实例
export const indexedDBUtil = new IndexedDBUtil();