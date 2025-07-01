import React, { useState, useCallback } from 'react';
import { type NodeProps, type Node } from '@xyflow/react';
import { useNodeStore } from '@/stores/nodeStore';
import NodeContainer from '../NodeLayout/NodeContainer';
import NodeHeader from '../NodeLayout/NodeHeader';

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
  const [text, setText] = useState(data?.content || '');
  const [title, setTitle] = useState(data?.title || '文本节点');

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

  const handleTitleChange = useCallback((newTitle: string) => {
    setTitle(newTitle);
    if (newTitle !== data?.title) {
      updateNodeData(id, { title: newTitle, content: text });
    }
  }, [id, text, data?.title, updateNodeData]);

  return (
    <NodeContainer 
      selected={selected} 
      onDelete={data?.onDelete}
    >
      <NodeHeader
        nodeType="text"
        title={title}
        onTitleChange={handleTitleChange}
      />
      
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
          {text || <span className="text-gray-400">双击编辑文本</span>}
        </div>
      )}
    </NodeContainer>
  );
};

export default TextNode;