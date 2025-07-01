import React, { useState, useCallback } from 'react';
import { CustomNodeProps, BaseNodeData } from '../types';
import NodeContainer from './NodeContainer';
import NodeHeader from './NodeHeader';

interface TextNodeData extends BaseNodeData {
  title?: string;
  content?: string;
  onDelete?: () => void;
  onDataChange?: (data: Partial<TextNodeData>) => void;
}

/**
 * 文本节点组件
 * 提供基础的文本编辑功能
 */
const TextNode: React.FC<CustomNodeProps<TextNodeData>> = ({ id, data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data?.content || '');
  const [title, setTitle] = useState(data?.title || '文本节点');

  /**
   * 处理双击编辑事件
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
      // 如果提供了数据变更回调，则调用它
      if (data?.onDataChange) {
        data.onDataChange({ content: text, title });
      }
    }
  }, [text, title, data]);

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
   * 处理标题变更
   */
  const handleTitleChange = useCallback((newTitle: string) => {
    setTitle(newTitle);
    if (newTitle !== data?.title) {
      // 如果提供了数据变更回调，则调用它
      if (data?.onDataChange) {
        data.onDataChange({ title: newTitle, content: text });
      }
    }
  }, [text, data]);

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
          className="custom-text-node-textarea"
          style={{
            width: '100%',
            minHeight: '60px',
            backgroundColor: 'transparent',
            resize: 'none',
            border: 'none',
            outline: 'none',
            fontSize: '14px',
            lineHeight: '1.4',
            color: '#374151',
            padding: '4px'
          }}
          value={text}
          onChange={e => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <div
          className="custom-text-node-content"
          style={{
            width: '100%',
            minHeight: '60px',
            whiteSpace: 'pre-wrap',
            color: '#374151',
            cursor: 'text',
            fontSize: '14px',
            lineHeight: '1.4',
            padding: '4px'
          }}
          onDoubleClick={handleDoubleClick}
        >
          {text || (
            <span style={{ color: '#9ca3af' }}>
              双击编辑文本
            </span>
          )}
        </div>
      )}
    </NodeContainer>
  );
};

export default TextNode;