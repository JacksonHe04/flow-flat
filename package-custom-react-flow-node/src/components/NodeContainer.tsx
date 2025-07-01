import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { NodeContainerProps } from '../types';

/**
 * 通用节点容器组件
 * 包含连接点、删除按钮和基础样式
 */
const NodeContainer: React.FC<NodeContainerProps> = ({
  selected,
  onDelete,
  children,
  className = ''
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  /**
   * 处理删除按钮点击事件
   */
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <div 
      className={`
        custom-node-container
        ${selected ? 'custom-node-selected' : ''}
        ${className}
      `}
      style={{
        backgroundColor: 'white',
        border: `2px solid ${selected ? '#3b82f6' : '#e2e8f0'}`,
        borderRadius: '8px',
        boxShadow: isHovered 
          ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.2s',
        position: 'relative',
        minWidth: '200px',
        minHeight: '100px'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 连接点 */}
      <Handle 
        type="target" 
        position={Position.Left} 
        id="input" 
        style={{
          width: '16px',
          height: '16px',
          backgroundColor: '#3b82f6',
          border: '2px solid white'
        }}
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="output" 
        style={{
          width: '16px',
          height: '16px',
          backgroundColor: '#10b981',
          border: '2px solid white'
        }}
      />
      
      {/* 删除按钮 */}
      {onDelete && (
        <button
          className="custom-node-delete-btn"
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            width: '24px',
            height: '24px',
            backgroundColor: '#ef4444',
            color: 'white',
            borderRadius: '50%',
            border: 'none',
            opacity: isHovered ? 1 : 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
          onClick={handleDelete}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#dc2626';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ef4444';
          }}
        >
          ×
        </button>
      )}

      {/* 节点内容 */}
      <div 
        className="custom-node-content"
        style={{
          width: '100%',
          height: '100%',
          padding: '8px'
        }}
      >
        {children}
      </div>
      

    </div>
  );
};

export default NodeContainer;