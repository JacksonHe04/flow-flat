import React from 'react';
import { Handle, Position } from '@xyflow/react';

interface NodeContainerProps {
  selected?: boolean;
  onDelete?: () => void;
  children: React.ReactNode;
  className?: string;
}

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
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <div className={`card card-hover ${selected ? 'border-primary' : ''} relative group ${className}`}>
      {/* 连接点 */}
      <Handle 
        type="target" 
        position={Position.Left} 
        id="input" 
        style={{
          width: '16px',
          height: '16px',
          backgroundColor: 'var(--color-primary)',
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
          backgroundColor: 'var(--color-secondary)',
          border: '2px solid white'
        }}
      />
      
      {/* 删除按钮 */}
      {onDelete && (
        <button
          className="
            absolute -top-2 -right-2 w-6 h-6
            bg-error text-white rounded-full
            opacity-0 group-hover:opacity-100
            hover:bg-red-600 transition-all duration-200
            flex items-center justify-center
          "
          onClick={handleDelete}
        >
          ×
        </button>
      )}

      {/* 节点内容 */}
      <div className="w-full h-full p-2">
        {children}
      </div>
    </div>
  );
};

export default NodeContainer;