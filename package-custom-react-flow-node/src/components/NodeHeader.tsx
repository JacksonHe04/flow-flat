import React, { useState, useCallback, useEffect } from 'react';
import { NodeHeaderProps } from '../types';

/**
 * 获取节点类型显示名称
 */
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

  /**
   * 处理双击编辑事件
   */
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  /**
   * 处理失去焦点事件
   */
  const handleBlur = useCallback(() => {
    setIsEditing(false);
    onTitleChange(localTitle);
  }, [localTitle, onTitleChange]);

  /**
   * 处理键盘事件
   */
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
    <div 
      className="custom-node-header"
      style={{
        marginBottom: '8px'
      }}
    >
      {/* 节点类型显示 */}
      <div 
        className="custom-node-type"
        style={{
          fontSize: '12px',
          color: '#9ca3af',
          textAlign: 'center',
          marginBottom: '4px'
        }}
      >
        {getNodeTypeDisplayName(nodeType)}
      </div>
      
      {/* 节点标题 */}
      {isEditing ? (
        <input
          className="custom-node-title-input"
          style={{
            width: '100%',
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '14px',
            fontWeight: '600',
            color: '#4b5563',
            textAlign: 'center',
            padding: '2px 4px'
          }}
          value={localTitle}
          onChange={(e) => setLocalTitle(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <h3 
          className="custom-node-title"
          style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#4b5563',
            cursor: 'pointer',
            textAlign: 'center',
            margin: 0,
            padding: '2px 4px',
            transition: 'color 0.2s'
          }}
          onDoubleClick={handleDoubleClick}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#1f2937';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#4b5563';
          }}
        >
          {title}
        </h3>
      )}
    </div>
  );
};

export default NodeHeader;