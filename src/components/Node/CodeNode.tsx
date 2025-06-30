import React, { useState, useCallback } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { useNodeStore } from '@/stores/nodeStore';

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
        {/* 标题和语言选择 */}
        <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-1">💻</span>
            {isEditing ? (
              <input
                className="bg-transparent border-none outline-none flex-1"
                value={title}
                onChange={e => setTitle(e.target.value)}
                onBlur={handleBlur}
              />
            ) : (
              <span onDoubleClick={handleDoubleClick}>{title}</span>
            )}
          </div>
          {isEditing && (
            <select
              className="text-xs bg-transparent border border-gray-300 rounded px-1"
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
          )}
        </div>
        
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
      </div>
    </div>
  );
};

export default CodeNode;