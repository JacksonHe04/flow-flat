import React, { useState, useCallback, useEffect } from 'react';

interface NodeHeaderProps {
  nodeType: string;
  title: string;
  onTitleChange: (title: string) => void;
}

const getNodeTypeDisplayName = (nodeType: string): string => {
  const typeMap: Record<string, string> = {
    text: 'Text',
    code: 'Code',
    image: 'Image',
    markdown: 'Markdown',
    todo: 'Todo'
  };
  return typeMap[nodeType] || nodeType;
};

/**
 * 通用节点头部组件
 * 显示节点类型和可编辑的标题
 */
const NodeHeader: React.FC<NodeHeaderProps> = ({
  nodeType,
  title,
  onTitleChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(title);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    onTitleChange(localTitle);
  }, [localTitle, onTitleChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      (e.currentTarget as HTMLElement).blur();
    }
    e.stopPropagation();
  }, []);

  // 同步外部title变化
  useEffect(() => {
    setLocalTitle(title);
  }, [title]);

  return (
    <div className="mb-2">
      {/* 节点类型显示 */}
      <div className="text-xs text-slate-400 text-center mb-1">
        {getNodeTypeDisplayName(nodeType)}
      </div>
      
      {/* 节点标题 */}
      {isEditing ? (
        <input
          className="w-full bg-transparent border-none outline-none text-sm font-semibold text-slate-600 dark:text-slate-300 text-center"
          value={localTitle}
          onChange={(e) => setLocalTitle(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <h3 
          className="text-sm font-semibold text-slate-600 dark:text-slate-300 cursor-pointer hover:text-slate-800 dark:hover:text-slate-100 text-center"
          onDoubleClick={handleDoubleClick}
        >
          {title}
        </h3>
      )}
    </div>
  );
};

export default NodeHeader;