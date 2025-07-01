/**
 * 存储管理组件
 * 整合白板的保存、加载、导入导出功能
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReactFlow } from '@xyflow/react';
import { useStorageStore } from '@/stores/storageStore';
import { boardStorageService } from '@/services/boardStorage';
import { useNodeStore } from '@/stores/nodeStore';
import SaveBoardDialog from './SaveBoardDialog';
import BoardListDialog from './BoardListDialog';
import { importFlowData } from '@/components/Node/ImportExport/importUtils';

interface StorageManagerProps {
  className?: string;
}

/**
 * 存储管理组件
 */
const StorageManager: React.FC<StorageManagerProps> = ({ className = '' }) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showBoardList, setShowBoardList] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  
  const navigate = useNavigate();
  const { getEdges, setNodes, setEdges } = useReactFlow();
  const { nodes: storeNodes } = useNodeStore();
  const {
    saveStatus,
    currentBoardId,
    saveBoard,
    loadBoard,
    importBoardFromJSON,
  } = useStorageStore();

  /**
   * 处理保存白板
   */
  const handleSave = async (name: string, description?: string) => {
    try {
      const edges = getEdges();
      const nodes = Object.values(storeNodes);
      
      const newBoardId = await saveBoard({
        name,
        description,
        nodes,
        edges,
      });
      
      setShowSaveDialog(false);
      
      // 如果是新建白板（当前没有boardId），保存成功后跳转到新白板页面
      if (!currentBoardId && newBoardId) {
        navigate(`/board/${newBoardId}`);
      }
    } catch (error) {
      console.error('Failed to save board:', error);
      // TODO: 显示错误提示
    }
  };

  /**
   * 处理更新白板
   */
  const handleUpdate = async () => {
    if (!currentBoardId) return;
    
    try {
      const edges = getEdges();
      
      if (currentBoardId) {
        const currentBoard = await boardStorageService.getBoard(currentBoardId);
        if (!currentBoard) {
          console.error('Current board not found');
          return;
        }
        
        const storeNodesArray = Object.values(storeNodes);
        
        await saveBoard({
          boardId: currentBoardId,
          name: currentBoard.name,
          description: currentBoard.description,
          nodes: storeNodesArray,
          edges,
        });
      }
    } catch (error) {
      console.error('Failed to update board:', error);
      // TODO: 显示错误提示
    }
  };

  /**
   * 处理加载白板
   */
  const handleLoad = async (boardId: string) => {
    try {
      const boardData = await loadBoard(boardId);
      if (boardData) {
        setNodes(boardData.nodes);
        setEdges(boardData.edges);
        // 跳转到对应的白板页面
        navigate(`/board/${boardId}`);
      }
    } catch (error) {
      console.error('Failed to load board:', error);
      // TODO: 显示错误提示
    }
  };

  /**
   * 处理文件导入
   */
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsImporting(true);
    
    try {
      const result = await importFlowData(file);
      
      // 直接加载到画布
      setNodes(result.nodes);
      setEdges(result.edges);
      
      // 同时保存到数据库
      const text = await file.text();
      await importBoardFromJSON(text, file.name.replace('.json', ''));
    } catch (error) {
      console.error('Failed to import file:', error);
      // TODO: 显示错误提示
    } finally {
      setIsImporting(false);
      // 清空文件输入
      event.target.value = '';
    }
  };

  /**
   * 获取保存状态显示文本
   */
  const getSaveStatusText = () => {
    switch (saveStatus) {
      case 'saving':
        return '保存中...';
      case 'success':
        return '已保存';
      case 'error':
        return '保存失败';
      default:
        return currentBoardId ? '更新' : '保存';
    }
  };

  /**
   * 获取保存状态样式
   */
  const getSaveStatusStyle = () => {
    switch (saveStatus) {
      case 'saving':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <>
      <div className={`flex items-center space-x-2 ${className}`}>
        {/* 保存/更新按钮 */}
        <button
          onClick={currentBoardId ? handleUpdate : () => setShowSaveDialog(true)}
          disabled={saveStatus === 'saving'}
          className={`
            px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200
            ${getSaveStatusStyle()}
            bg-blue-50 dark:bg-blue-900/20
            hover:bg-blue-100 dark:hover:bg-blue-900/40
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center space-x-1 whitespace-nowrap
          `}
        >
          {saveStatus === 'saving' && (
            <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
          )}
          <span>{getSaveStatusText()}</span>
        </button>
        
        {/* 另存为按钮 */}
        {currentBoardId && (
          <button
            onClick={() => setShowSaveDialog(true)}
            className="
              px-3 py-1.5 text-sm font-medium rounded-md
              text-purple-600 dark:text-purple-400
              bg-purple-50 dark:bg-purple-900/20
              hover:bg-purple-100 dark:hover:bg-purple-900/40
              transition-colors duration-200
              whitespace-nowrap
            "
          >
            创建副本
          </button>
        )}
        
        {/* 我的白板按钮 */}
        <button
          onClick={() => setShowBoardList(true)}
          className="
            px-3 py-1.5 text-sm font-medium rounded-md
            text-gray-600 dark:text-gray-400
            bg-gray-50 dark:bg-gray-700
            hover:bg-gray-100 dark:hover:bg-gray-600
            transition-colors duration-200
            whitespace-nowrap
          "
        >
          我的白板
        </button>
        
        {/* 导入按钮 */}
        <label className="
          px-3 py-1.5 text-sm font-medium rounded-md cursor-pointer
          text-green-600 dark:text-green-400
          bg-green-50 dark:bg-green-900/20
          hover:bg-green-100 dark:hover:bg-green-900/40
          transition-colors duration-200
          flex items-center space-x-1 whitespace-nowrap
        ">
          {isImporting && (
            <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
          )}
          <span>{isImporting ? '导入中...' : '导入'}</span>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            disabled={isImporting}
            className="hidden"
          />
        </label>
      </div>
      
      {/* 保存对话框 */}
      <SaveBoardDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSave={handleSave}
        existingBoardId={currentBoardId}
      />
      
      {/* 白板列表对话框 */}
      <BoardListDialog
        isOpen={showBoardList}
        onClose={() => setShowBoardList(false)}
        onLoad={handleLoad}
      />
    </>
  );
};

export default StorageManager;