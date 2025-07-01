import React, { useState, useCallback } from 'react';
import { type NodeProps, type Node } from '@xyflow/react';
import { type BaseNodeData } from '../../types';
import NodeContainer from '../NodeLayout/NodeContainer';
import NodeHeader from '../NodeLayout/NodeHeader';
import MarkdownEditor from '../Markdown/MarkdownEditor';

export interface MarkdownNodeData extends BaseNodeData {
  title?: string;
  content?: string;
}

/**
 * Markdown节点组件
 */
const MarkdownNode: React.FC<NodeProps<Node<MarkdownNodeData>>> = ({ id, data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [markdown, setMarkdown] = useState(data?.content || '');
  const [title, setTitle] = useState(data?.title || 'Markdown节点');

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  /**
   * 处理失去焦点，保存内容
   */
  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (data?.onDataChange) {
      data.onDataChange(id, { content: markdown, title });
    }
  }, [id, markdown, title, data]);

  /**
   * 处理焦点事件，自动切换到编辑模式
   */
  const handleFocus = useCallback(() => {
    if (!isEditing) {
      setIsEditing(true);
    }
  }, [isEditing]);

  const handleTitleChange = useCallback((newTitle: string) => {
    setTitle(newTitle);
    if (data?.onDataChange) {
      data.onDataChange(id, { title: newTitle, content: markdown });
    }
  }, [id, markdown, data]);

  const handleContentChange = useCallback((newContent: string) => {
    setMarkdown(newContent);
    if (data?.onDataChange) {
      data.onDataChange(id, { content: newContent, title });
    }
  }, [id, title, data]);

  return (
    <NodeContainer 
      selected={selected} 
      onDelete={data?.onDelete}
      className="min-w-[320px]"
    >
      <NodeHeader
        nodeType="markdown"
        title={title}
        onTitleChange={handleTitleChange}
      />
      
      {/* Markdown内容 */}
      <MarkdownEditor
        content={markdown}
        onChange={handleContentChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        editable={isEditing}
        autoFocus={isEditing}
        placeholder="输入Markdown内容..."
        className="w-full flex-1"
        minHeight={100}
        maxHeight={300}
        showPlaceholder={true}
      />
      
      {/* 非编辑模式下添加双击事件处理 */}
      {!isEditing && (
        <div
          className="absolute inset-0 cursor-text"
          onDoubleClick={handleDoubleClick}
        />
      )}
    </NodeContainer>
  );
};

export default MarkdownNode;