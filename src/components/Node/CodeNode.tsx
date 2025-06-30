import React, { useState, useCallback } from 'react';
import { type NodeProps, type Node } from '@xyflow/react';
import { useNodeStore } from '@/stores/nodeStore';
import NodeContainer from './NodeContainer';
import NodeHeader from './NodeHeader';

interface CodeNodeData extends Record<string, unknown> {
  title?: string;
  content?: string;
  language?: string;
  onDelete?: () => void;
}

/**
 * 代码节点组件
 */
const CodeNode: React.FC<NodeProps<Node<CodeNodeData>>> = ({ id, data, selected }) => {
  const { updateNodeData } = useNodeStore();
  const [isEditing, setIsEditing] = useState(false);
  const [code, setCode] = useState(data?.content || '// 双击编辑代码\nconsole.log("Hello World!");');
  const [title, setTitle] = useState(data?.title || '代码节点');
  const [language, setLanguage] = useState(data?.language || 'javascript');

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  /**
   * 处理失去焦点，保存内容
   */
  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (code !== data?.content || title !== data?.title || language !== data?.language) {
      updateNodeData(id, { content: code, title, language });
    }
  }, [id, code, title, language, data?.content, data?.title, data?.language, updateNodeData]);

  /**
   * 处理键盘事件
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      setCode(code.substring(0, start) + '  ' + code.substring(end));
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
    e.stopPropagation();
  }, [code]);

  const handleTitleChange = useCallback((newTitle: string) => {
    setTitle(newTitle);
    if (newTitle !== data?.title) {
      updateNodeData(id, { title: newTitle, content: code, language });
    }
  }, [id, code, language, data?.title, updateNodeData]);

  return (
    <NodeContainer 
      selected={selected} 
      onDelete={data?.onDelete}
    >
      <NodeHeader
        nodeType="code"
        title={title}
        onTitleChange={handleTitleChange}
      />
      
      {/* 语言选择 */}
      {isEditing && (
        <div className="mb-2 flex justify-end">
          <select
            className="text-xs bg-transparent border border-gray-300 rounded px-2 py-1 dark:text-white"
            value={language}
            onChange={e => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
          </select>
        </div>
      )}
      
      {/* 代码内容 */}
      {isEditing ? (
        <textarea
          className="
            w-full flex-1 bg-gray-900 text-green-400 resize-none
            font-mono text-sm p-2 rounded
            focus:outline-none focus-ring
          "
          value={code}
          onChange={e => setCode(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck={false}
        />
      ) : (
        <pre
          className="
            w-full flex-1 bg-gray-900 text-green-400 
            font-mono text-sm p-2 rounded cursor-text
            overflow-auto whitespace-pre-wrap
          "
          onDoubleClick={handleDoubleClick}
        >
          {code}
        </pre>
      )}
    </NodeContainer>
  );
};

export default CodeNode;