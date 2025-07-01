/**
 * 白板存储服务
 * 提供白板数据的保存、加载、删除等业务逻辑
 */

import { type Edge } from '@xyflow/react';
import { type Node } from '@/stores/nodeStore';
import { indexedDBUtil, type BoardData, type BoardListItem } from '@/utils/indexedDB';
import { exportFlowDataToJSON } from '@/components/Node/ImportExport/exportUtils';
import { validateImportData } from '@/components/Node/ImportExport/importUtils';

/**
 * 保存白板请求参数
 */
export interface SaveBoardRequest {
  name: string;
  description?: string;
  nodes: Node[];
  edges: Edge[];
  boardId?: string; // 如果提供则更新现有白板，否则创建新白板
}

/**
 * 白板存储服务类
 */
class BoardStorageService {
  /**
   * 初始化存储服务
   */
  async init(): Promise<void> {
    if (!indexedDBUtil.isSupported()) {
      throw new Error('IndexedDB is not supported in this browser');
    }
    await indexedDBUtil.init();
  }

  /**
   * 保存白板数据
   */
  async saveBoard(request: SaveBoardRequest): Promise<string> {
    const { name, description, nodes, edges, boardId } = request;
    
    // 生成白板ID
    const id = boardId || `board-${Date.now()}`;
    const now = new Date().toISOString();
    
    // 将节点数组转换为对象格式
    const nodesRecord = nodes.reduce((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {} as Record<string, Node>);
    
    // 使用现有的导出工具生成标准格式数据
    const exportData = exportFlowDataToJSON(nodesRecord, edges);
    
    // 构建白板数据
    const boardData: BoardData = {
      boardId: id,
      name,
      description,
      version: exportData.version,
      timestamp: exportData.timestamp,
      nodes: exportData.nodes,
      edges: exportData.edges,
      metadata: exportData.metadata,
      createdAt: boardId ? (await this.getBoard(boardId))?.createdAt || now : now,
      updatedAt: now,
    };
    
    // 验证数据格式
    this.validateBoardData(boardData);
    
    // 保存到数据库
    await indexedDBUtil.saveBoard(boardData);
    
    return id;
  }

  /**
   * 加载白板数据
   */
  async loadBoard(boardId: string): Promise<{ nodes: Node[]; edges: Edge[] } | null> {
    const boardData = await indexedDBUtil.getBoard(boardId);
    
    if (!boardData) {
      return null;
    }
    
    // 验证数据格式
    const importData = {
      version: boardData.version,
      timestamp: boardData.timestamp,
      nodes: boardData.nodes,
      edges: boardData.edges,
      metadata: boardData.metadata,
    };
    
    if (!validateImportData(importData)) {
      throw new Error('Invalid board data format');
    }
    
    return {
      nodes: boardData.nodes,
      edges: boardData.edges,
    };
  }

  /**
   * 获取白板信息（不包含节点和连线数据）
   */
  async getBoard(boardId: string): Promise<BoardData | null> {
    return await indexedDBUtil.getBoard(boardId);
  }

  /**
   * 获取所有白板列表
   */
  async getAllBoards(): Promise<BoardListItem[]> {
    return await indexedDBUtil.getAllBoards();
  }

  /**
   * 删除白板
   */
  async deleteBoard(boardId: string): Promise<void> {
    await indexedDBUtil.deleteBoard(boardId);
  }

  /**
   * 导出白板为JSON格式（与现有导出功能兼容）
   */
  async exportBoardAsJSON(boardId: string): Promise<string> {
    const boardData = await indexedDBUtil.getBoard(boardId);
    
    if (!boardData) {
      throw new Error('Board not found');
    }
    
    // 构建导出格式
    const exportData = {
      version: boardData.version,
      timestamp: boardData.timestamp,
      nodes: boardData.nodes,
      edges: boardData.edges,
      metadata: boardData.metadata,
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  /**
   * 从JSON导入白板数据
   */
  async importBoardFromJSON(jsonData: string, name: string, description?: string): Promise<string> {
    let importData;
    
    try {
      importData = JSON.parse(jsonData);
    } catch {
      throw new Error('Invalid JSON format');
    }
    
    if (!validateImportData(importData)) {
      throw new Error('Invalid import data format');
    }
    
    // 保存为新白板
    return await this.saveBoard({
      name,
      description,
      nodes: importData.nodes,
      edges: importData.edges,
    });
  }

  /**
   * 检查白板名称是否已存在
   */
  async isBoardNameExists(name: string, excludeBoardId?: string): Promise<boolean> {
    const boards = await this.getAllBoards();
    return boards.some(board => 
      board.name === name && board.boardId !== excludeBoardId
    );
  }

  /**
   * 获取存储使用情况
   */
  async getStorageUsage(): Promise<{ used: number; quota: number } | null> {
    return await indexedDBUtil.getStorageUsage();
  }

  /**
   * 验证白板数据格式
   */
  private validateBoardData(boardData: BoardData): void {
    if (!boardData.boardId || !boardData.name) {
      throw new Error('Board ID and name are required');
    }
    
    if (!Array.isArray(boardData.nodes) || !Array.isArray(boardData.edges)) {
      throw new Error('Nodes and edges must be arrays');
    }
    
    if (!boardData.metadata || typeof boardData.metadata.nodeCount !== 'number') {
      throw new Error('Invalid metadata format');
    }
  }

  /**
   * 清理过期数据（可选功能）
   */
  async cleanupOldBoards(daysOld: number = 30): Promise<number> {
    const boards = await this.getAllBoards();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    let deletedCount = 0;
    
    for (const board of boards) {
      const updatedAt = new Date(board.updatedAt);
      if (updatedAt < cutoffDate) {
        await this.deleteBoard(board.boardId);
        deletedCount++;
      }
    }
    
    return deletedCount;
  }
}

// 导出单例实例
export const boardStorageService = new BoardStorageService();