/**
 * 保存白板对话框组件
 */

import React, { useState, useEffect } from 'react';
import { useStorageStore, SaveStatus } from '@/stores/storageStore';

interface SaveBoardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description?: string) => void;
  initialName?: string;
  initialDescription?: string;
  isUpdate?: boolean; // 是否为更新现有白板
  existingBoardId?: string | null; // 现有白板ID
}

/**
 * 保存白板对话框
 */
const SaveBoardDialog: React.FC<SaveBoardDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialName = '',
  initialDescription = '',
  isUpdate = false,
}) => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [nameError, setNameError] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  
  const { 
    saveStatus, 
    saveError, 
    isBoardNameExists,
    currentBoardId,
  } = useStorageStore();

  // 重置表单
  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setDescription(initialDescription);
      setNameError('');
    }
  }, [isOpen, initialName, initialDescription]);

  /**
   * 验证白板名称
   */
  const validateName = async (boardName: string): Promise<boolean> => {
    if (!boardName.trim()) {
      setNameError('白板名称不能为空');
      return false;
    }
    
    if (boardName.length > 50) {
      setNameError('白板名称不能超过50个字符');
      return false;
    }
    
    // 检查名称是否已存在（更新时排除当前白板）
    setIsChecking(true);
    try {
      const exists = await isBoardNameExists(
        boardName.trim(), 
        isUpdate ? currentBoardId || undefined : undefined
      );
      
      if (exists) {
        setNameError('白板名称已存在');
        return false;
      }
    } catch {
      setNameError('验证名称时出错');
      return false;
    } finally {
      setIsChecking(false);
    }
    
    setNameError('');
    return true;
  };

  /**
   * 处理保存
   */
  const handleSave = async () => {
    const isValid = await validateName(name);
    if (!isValid) return;
    
    onSave(name.trim(), description.trim() || undefined);
  };

  /**
   * 处理键盘事件
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* 标题 */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isUpdate ? '更新白板' : '保存白板'}
          </h3>
        </div>
        
        {/* 内容 */}
        <div className="px-6 py-4 space-y-4">
          {/* 白板名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              白板名称 *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="请输入白板名称"
              className={`
                w-full px-3 py-2 border rounded-md
                bg-white dark:bg-gray-700
                text-gray-900 dark:text-white
                placeholder-gray-500 dark:placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500
                ${nameError 
                  ? 'border-red-500 dark:border-red-400' 
                  : 'border-gray-300 dark:border-gray-600'
                }
              `}
              autoFocus
            />
            {nameError && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {nameError}
              </p>
            )}
          </div>
          
          {/* 白板描述 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              描述（可选）
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请输入白板描述"
              rows={3}
              className="
                w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                bg-white dark:bg-gray-700
                text-gray-900 dark:text-white
                placeholder-gray-500 dark:placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500
                resize-none
              "
            />
          </div>
          
          {/* 错误信息 */}
          {saveError && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-600 dark:text-red-400">
                {saveError}
              </p>
            </div>
          )}
        </div>
        
        {/* 按钮 */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={saveStatus === SaveStatus.SAVING}
            className="
              px-4 py-2 text-sm font-medium rounded-md
              text-gray-700 dark:text-gray-300
              bg-gray-100 dark:bg-gray-700
              hover:bg-gray-200 dark:hover:bg-gray-600
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
            "
          >
            取消
          </button>
          
          <button
            onClick={handleSave}
            disabled={
              saveStatus === SaveStatus.SAVING || 
              isChecking || 
              !name.trim() || 
              !!nameError
            }
            className="
              px-4 py-2 text-sm font-medium rounded-md
              text-white bg-blue-600 hover:bg-blue-700
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
              flex items-center space-x-2
            "
          >
            {(saveStatus === SaveStatus.SAVING || isChecking) && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            <span>
              {saveStatus === SaveStatus.SAVING 
                ? '保存中...' 
                : isChecking 
                ? '检查中...' 
                : isUpdate 
                ? '更新' 
                : '保存'
              }
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveBoardDialog;