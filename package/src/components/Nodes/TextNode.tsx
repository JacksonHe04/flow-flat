import React, { useState, useCallback } from 'react';
import { type NodeProps, type Node } from '@xyflow/react';
import { type BaseNodeData } from '../../types';
import NodeContainer from '../NodeLayout/NodeContainer';
import NodeHeader from '../NodeLayout/NodeHeader';

export interface TextNodeData extends BaseNodeData {
  title?: string;
  content?: string;
}

/**
 * 文本节点组件
 */
const TextNode: React.FC<NodeProps<Node<TextNodeData>>> = ({ id, data, selected }) => {
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
    // 触发数据更新回调
    if (data?.onDataChange) {
      data.onDataChange(id, { content: text, title });
    }
  }, [id, text, title, data]);

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
    if (data?.onDataChange) {
      data.onDataChange(id, { title: newTitle });
    }
  }, [id, data]);

  return (
    <NodeContainer
      selected={selected}
      onDelete={data?.onDelete}
      className="min-w-[200px] min-h-[150px]"
    >
      <NodeHeader
        nodeType="text"
        title={title}
        onTitleChange={handleTitleChange}
      />
      
      <div className="flex-1 flex flex-col">
        {isEditing ? (
          <textarea
            className="
              w-full h-full resize-none
              bg-transparent border-none outline-none
              text-sm text-slate-700 dark:text-slate-300
              placeholder-slate-400
            "
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="双击编辑文本内容..."
            autoFocus
          />
        ) : (
          <div
            className="
              w-full h-full cursor-text
              text-sm text-slate-700 dark:text-slate-300
              whitespace-pre-wrap break-words
              min-h-[60px]
            "
            onDoubleClick={handleDoubleClick}
          >
            {text || (
              <span className="text-slate-400 italic">
                双击编辑文本内容...
              </span>
            )}
          </div>
        )}
      </div>
    </NodeContainer>
  );
};

export default TextNode;