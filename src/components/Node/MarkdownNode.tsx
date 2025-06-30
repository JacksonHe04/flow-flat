import React, { useState, useCallback } from 'react';
import { type NodeProps, type Node } from '@xyflow/react';
import { useNodeStore } from '@/stores/nodeStore';
import NodeContainer from './NodeContainer';
import NodeHeader from './NodeHeader';

interface MarkdownNodeData extends Record<string, unknown> {
  title?: string;
  content?: string;
  onDelete?: () => void;
}

/**
 * Markdown节点组件
 */
const MarkdownNode: React.FC<NodeProps<Node<MarkdownNodeData>>> = ({ id, data, selected }) => {
  const { updateNodeData } = useNodeStore();
  const [isEditing, setIsEditing] = useState(false);
  const [markdown, setMarkdown] = useState(data?.content || '# 标题\n\n双击编辑Markdown内容\n\n- 列表项1\n- 列表项2');
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
    if (markdown !== data?.content || title !== data?.title) {
      updateNodeData(id, { content: markdown, title });
    }
  }, [id, markdown, title, data?.content, data?.title, updateNodeData]);

  /**
   * 处理键盘事件
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      setMarkdown(markdown.substring(0, start) + '  ' + markdown.substring(end));
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
    e.stopPropagation();
  }, [markdown]);

  const handleTitleChange = useCallback((newTitle: string) => {
    setTitle(newTitle);
    if (newTitle !== data?.title) {
      updateNodeData(id, { title: newTitle, content: markdown });
    }
  }, [id, markdown, data?.title, updateNodeData]);

  return (
    <NodeContainer 
      selected={selected} 
      onDelete={data?.onDelete}
    >
      <NodeHeader
        nodeType="markdown"
        title={title}
        onTitleChange={handleTitleChange}
      />
      
      {/* Markdown内容 */}
      {isEditing ? (
        <textarea
          className="
            w-full flex-1 bg-transparent resize-none
            font-mono text-sm border border-gray-300 rounded p-2
            focus:outline-none focus-ring
            dark:text-white dark:border-gray-600
          "
          value={markdown}
          onChange={e => setMarkdown(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          placeholder="输入Markdown内容..."
        />
      ) : (
        <div
          className="
            w-full flex-1 cursor-text overflow-auto
            prose prose-sm dark:prose-invert max-w-none
          "
          onDoubleClick={handleDoubleClick}
        >
          {/* 这里留空，用于后续引入Markdown渲染组件 */}
          <pre className="whitespace-pre-wrap">{markdown}</pre>
        </div>
      )}
    </NodeContainer>
  );
};

export default MarkdownNode;