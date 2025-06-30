import React, { useState, useCallback } from 'react';
import { type NodeProps, type Node } from '@xyflow/react';
import { useNodeStore } from '@/stores/nodeStore';
import MonacoEditor from '@/components/CodeEditor/MonacoEditor';
import LanguageSelector from '@/components/CodeEditor/LanguageSelector';
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
  const [isCompact, setIsCompact] = useState(true);

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
   * 处理代码变化
   */
  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
  }, []);

  /**
   * 处理语言变化
   */
  const handleLanguageChange = useCallback((newLanguage: string) => {
    setLanguage(newLanguage);
    updateNodeData(id, { content: code, title, language: newLanguage });
  }, [id, code, title, updateNodeData]);

  /**
   * 切换紧凑模式
   */
  const toggleCompact = useCallback(() => {
    setIsCompact(!isCompact);
  }, [isCompact]);

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
      
      {/* 工具栏 */}
      <div className="flex items-center justify-between mb-2 gap-2">
        <LanguageSelector
          value={language}
          onChange={handleLanguageChange}
          className="flex-1"
        />
        
        <div className="flex items-center gap-1">
          <button
            onClick={toggleCompact}
            className="
              px-2 py-1 text-xs rounded
              bg-gray-100 dark:bg-gray-700
              text-gray-600 dark:text-gray-400
              hover:bg-gray-200 dark:hover:bg-gray-600
              transition-colors duration-200
            "
          >
            {isCompact ? '展开' : '收起'}
          </button>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="
              px-2 py-1 text-xs rounded
              bg-blue-100 dark:bg-blue-900
              text-blue-600 dark:text-blue-400
              hover:bg-blue-200 dark:hover:bg-blue-800
              transition-colors duration-200
            "
          >
            {isEditing ? '预览' : '编辑'}
          </button>
        </div>
      </div>
      
      {/* 代码内容 */}
      <div className={`${isCompact ? 'h-32' : 'h-64'} transition-all duration-200`}>
        {isEditing ? (
          <MonacoEditor
            value={code}
            onChange={handleCodeChange}
            language={language}
            theme="vs-dark"
            height="100%"
            minimap={false}
            fontSize={12}
            lineNumbers="off"
            wordWrap="on"
            onMount={(editor) => {
              // 编辑器失去焦点时保存
              editor.onDidBlurEditorText(() => {
                handleBlur();
              });
            }}
          />
        ) : (
          <pre
            className="
              w-full h-full bg-gray-900 text-green-400 
              font-mono text-xs p-2 rounded cursor-text
              overflow-auto whitespace-pre-wrap
              border border-gray-600
            "
            onDoubleClick={handleDoubleClick}
          >
            {code || '// 双击编辑代码'}
          </pre>
        )}
      </div>
    </NodeContainer>
  );
};

export default CodeNode;