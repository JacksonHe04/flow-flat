import React, { useState, useCallback } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { useNodeStore } from '@/stores/nodeStore';

interface ImageNodeData extends Record<string, unknown> {
  title?: string;
  imageUrl?: string;
  alt?: string;
  onDelete?: () => void;
}

/**
 * 图片节点组件
 */
const ImageNode: React.FC<NodeProps<Node<ImageNodeData>>> = ({ id, data, selected }) => {
  const { updateNodeData } = useNodeStore();
  const [isEditing, setIsEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState(data?.imageUrl || '');
  const [title, setTitle] = useState(data?.title || '图片节点');
  const [alt, setAlt] = useState(data?.alt || '图片描述');

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
    if (imageUrl !== data?.imageUrl || title !== data?.title || alt !== data?.alt) {
      updateNodeData(id, { imageUrl, title, alt });
    }
  }, [id, imageUrl, title, alt, data?.imageUrl, data?.title, data?.alt, updateNodeData]);

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

  /**
   * 处理图片加载错误
   */
  const handleImageError = useCallback(() => {
    console.log('图片加载失败');
  }, []);

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
          <span className="mr-1">🖼️</span>
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
        
        {/* 图片内容 */}
        {isEditing ? (
          <div className="space-y-2">
            <input
              className="
                w-full bg-transparent border border-gray-300 rounded px-2 py-1
                focus:outline-none focus-ring dark:text-white
              "
              placeholder="图片URL"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
            <input
              className="
                w-full bg-transparent border border-gray-300 rounded px-2 py-1
                focus:outline-none focus-ring dark:text-white
              "
              placeholder="图片描述"
              value={alt}
              onChange={e => setAlt(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
          </div>
        ) : (
          <div className="w-full flex-1 cursor-pointer" onDoubleClick={handleDoubleClick}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={alt}
                className="w-full h-auto max-h-32 object-contain rounded"
                onError={handleImageError}
              />
            ) : (
              <div className="
                w-full h-24 bg-gray-100 dark:bg-gray-700 
                border-2 border-dashed border-gray-300 dark:border-gray-600
                rounded flex items-center justify-center
                text-gray-500 dark:text-gray-400
              ">
                <div className="text-center">
                  <div className="text-2xl mb-1">🖼️</div>
                  <div className="text-xs">双击添加图片</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageNode;