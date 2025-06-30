import React, { useState, useCallback } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { useNodeStore } from '@/stores/nodeStore';

interface TextNodeData extends Record<string, unknown> {
  title?: string;
  content?: string;
  onDelete?: () => void;
}

/**
 * 文本节点组件
 */
const TextNode: React.FC<NodeProps<Node<TextNodeData>>> = ({ id, data, selected }) => {
  const { updateNodeData } = useNodeStore();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data?.content || '双击编辑文本');
  const [title, setTitle] = useState(data?.title || '文本节点');

  /**
   * 处理双击编辑
   */
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  /**
   * 处理失去焦点，保存内容
   */
  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (text !== data?.content || title !== data?.title) {
      updateNodeData(id, { content: text, title });
    }
  }, [id, text, title, data?.content, data?.title, updateNodeData]);

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

  /**
   * 处理删除节点
   */
  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    data?.onDelete?.();
  }, [data]);

  return (
    <div className={`card card-hover ${selected ? 'border-primary' : ''} relative group`}>
      {/* 连接点 */}
      <Handle 
        type="target" 
        position={Position.Left} 
        id="input" 
        className="w-3 h-3 bg-blue-500 border-2 border-white" 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="output" 
        className="w-3 h-3 bg-green-500 border-2 border-white" 
      />
      
      {/* 删除按钮 */}
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

      {/* 节点内容 */}
      <div className="w-full h-full p-2">
        {/* 标题 */}
        <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 flex items-center">
          <span className="mr-1">📝</span>
          {isEditing ? (
            <input
              className="bg-transparent border-none outline-none flex-1"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
          ) : (
            <span onDoubleClick={handleDoubleClick}>{title}</span>
          )}
        </div>
        
        {/* 内容 */}
        {isEditing ? (
          <textarea
            className="
              w-full flex-1 bg-transparent resize-none
              focus:outline-none focus-ring
              dark:text-white
            "
            value={text}
            onChange={e => setText(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <div
            className="w-full flex-1 whitespace-pre-wrap dark:text-white cursor-text"
            onDoubleClick={handleDoubleClick}
          >
            {text}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextNode;