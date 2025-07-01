/**
 * 白板列表对话框组件
 */

import React, { useState, useEffect } from 'react';
import { useStorageStore } from '@/stores/storageStore';
import { type BoardListItem } from '@/utils/indexedDB';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface BoardListDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLoad: (boardId: string) => void;
  onExport?: (boardId: string) => void;
}

/**
 * 白板列表对话框
 */
const BoardListDialog: React.FC<BoardListDialogProps> = ({
  isOpen,
  onClose,
  onLoad,
  onExport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'updatedAt' | 'createdAt'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  // const [selectedBoards, setSelectedBoards] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  const {
    boards,
    isLoadingBoards,
    refreshBoardList,
    deleteBoard,
    exportBoardAsJSON,
  } = useStorageStore();

  // 加载白板列表
  useEffect(() => {
    if (isOpen) {
      refreshBoardList();
      setSearchTerm('');
      // setSelectedBoards(new Set());
    }
  }, [isOpen, refreshBoardList]);

  /**
   * 过滤和排序白板列表
   */
  const filteredAndSortedBoards = React.useMemo(() => {
    let filtered = boards;
    
    // 搜索过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = boards.filter(board => 
        board.name.toLowerCase().includes(term) ||
        (board.description && board.description.toLowerCase().includes(term))
      );
    }
    
    // 排序
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
        default:
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    return filtered;
  }, [boards, searchTerm, sortBy, sortOrder]);

  /**
   * 处理加载白板
   */
  const handleLoad = (boardId: string) => {
    onLoad(boardId);
    onClose();
  };

  /**
   * 处理删除白板
   */
  const handleDelete = async (boardId: string) => {
    try {
      await deleteBoard(boardId);
      setShowDeleteConfirm(null);
      // setSelectedBoards(prev => {
      //   const newSet = new Set(prev);
      //   newSet.delete(boardId);
      //   return newSet;
      // });
    } catch (error) {
      console.error('Failed to delete board:', error);
      // TODO: 显示错误提示
    }
  };

  /**
   * 处理导出白板
   */
  const handleExport = async (board: BoardListItem) => {
    try {
      const jsonData = await exportBoardAsJSON(board.boardId);
      
      // 下载文件
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${board.name}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      if (onExport) {
        onExport(board.boardId);
      }
    } catch (error) {
      console.error('Failed to export board:', error);
      // TODO: 显示错误提示
    }
  };

  /**
   * 切换选择状态
   */
  // const toggleSelection = (boardId: string) => {
  //   setSelectedBoards(prev => {
  //     const newSet = new Set(prev);
  //     if (newSet.has(boardId)) {
  //       newSet.delete(boardId);
  //     } else {
  //       newSet.add(boardId);
  //     }
  //     return newSet;
  //   });
  // };

  /**
   * 格式化时间
   */
  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: zhCN,
      });
    } catch {
      return '未知时间';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-80 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[80vh] flex flex-col">
        {/* 标题栏 */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            我的白板 ({filteredAndSortedBoards.length})
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* 搜索和排序 */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-4">
          {/* 搜索框 */}
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索白板名称或描述..."
              className="
                w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                bg-white dark:bg-gray-700
                text-gray-900 dark:text-white
                placeholder-gray-500 dark:placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
            />
          </div>
          
          {/* 排序选择 */}
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'updatedAt' | 'createdAt')}
              className="
                px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                bg-white dark:bg-gray-700
                text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
            >
              <option value="updatedAt">更新时间</option>
              <option value="createdAt">创建时间</option>
              <option value="name">名称</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="
                p-2 border border-gray-300 dark:border-gray-600 rounded-md
                bg-white dark:bg-gray-700
                text-gray-900 dark:text-white
                hover:bg-gray-50 dark:hover:bg-gray-600
                transition-colors duration-200
              "
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
        
        {/* 白板列表 */}
        <div className="flex-1 overflow-y-auto">
          {isLoadingBoards ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="ml-3 text-gray-600 dark:text-gray-400">加载中...</span>
            </div>
          ) : filteredAndSortedBoards.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm ? '没有找到匹配的白板' : '还没有保存的白板'}
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAndSortedBoards.map((board) => (
                <div key={board.boardId} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                          {board.name}
                        </h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>{board.nodeCount} 节点</span>
                          <span>•</span>
                          <span>{board.edgeCount} 连线</span>
                        </div>
                      </div>
                      
                      {board.description && (
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 truncate">
                          {board.description}
                        </p>
                      )}
                      
                      <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>创建于 {formatTime(board.createdAt)}</span>
                        <span>•</span>
                        <span>更新于 {formatTime(board.updatedAt)}</span>
                      </div>
                    </div>
                    
                    {/* 操作按钮 */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleLoad(board.boardId)}
                        className="
                          px-3 py-1 text-sm font-medium rounded-md
                          text-blue-600 dark:text-blue-400
                          bg-blue-50 dark:bg-blue-900/20
                          hover:bg-blue-100 dark:hover:bg-blue-900/40
                          transition-colors duration-200
                        "
                      >
                        加载
                      </button>
                      
                      <button
                        onClick={() => handleExport(board)}
                        className="
                          px-3 py-1 text-sm font-medium rounded-md
                          text-green-600 dark:text-green-400
                          bg-green-50 dark:bg-green-900/20
                          hover:bg-green-100 dark:hover:bg-green-900/40
                          transition-colors duration-200
                        "
                      >
                        导出
                      </button>
                      
                      <button
                        onClick={() => setShowDeleteConfirm(board.boardId)}
                        className="
                          px-3 py-1 text-sm font-medium rounded-md
                          text-red-600 dark:text-red-400
                          bg-red-50 dark:bg-red-900/20
                          hover:bg-red-100 dark:hover:bg-red-900/40
                          transition-colors duration-200
                        "
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* 底部按钮 */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="
              px-4 py-2 text-sm font-medium rounded-md
              text-gray-700 dark:text-gray-300
              bg-gray-100 dark:bg-gray-700
              hover:bg-gray-200 dark:hover:bg-gray-600
              transition-colors duration-200
            "
          >
            关闭
          </button>
        </div>
      </div>
      
      {/* 删除确认对话框 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="px-6 py-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                确认删除
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                确定要删除这个白板吗？此操作无法撤销。
              </p>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="
                  px-4 py-2 text-sm font-medium rounded-md
                  text-gray-700 dark:text-gray-300
                  bg-gray-100 dark:bg-gray-700
                  hover:bg-gray-200 dark:hover:bg-gray-600
                  transition-colors duration-200
                "
              >
                取消
              </button>
              
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="
                  px-4 py-2 text-sm font-medium rounded-md
                  text-white bg-red-600 hover:bg-red-700
                  transition-colors duration-200
                "
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardListDialog;