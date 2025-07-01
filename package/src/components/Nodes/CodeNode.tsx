import React, { useState, useCallback } from 'react';
import { type NodeProps, type Node } from '@xyflow/react';
import { type BaseNodeData } from '../../types';
import MonacoEditor from '../CodeEditor/MonacoEditor';
import LanguageSelector from '../CodeEditor/LanguageSelector';
import NodeContainer from '../NodeLayout/NodeContainer';
import NodeHeader from '../NodeLayout/NodeHeader';

export interface CodeNodeData extends BaseNodeData {
  title?: string;
  content?: string;
  language?: string;
}

/**
 * 代码节点组件
 */
const CodeNode: React.FC<NodeProps<Node<CodeNodeData>>> = ({ id, data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [code, setCode] = useState(data?.content || '\nconsole.log("Hello World!");');
  const [title, setTitle] = useState(data?.title || '代码节点');
  const [language, setLanguage] = useState(data?.language || 'javascript');
  const [isCompact, setIsCompact] = useState(true);

  /**
   * 处理失去焦点，保存内容
   */
  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (data?.onDataChange) {
      data.onDataChange(id, { content: code, title, language });
    }
  }, [id, code, title, language, data]);

  /**
   * 处理代码变化
   */
  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    // 立即保存
    if (data?.onDataChange) {
      data.onDataChange(id, { content: newCode, title, language });
    }
  }, [id, title, language, data]);

  /**
   * 处理语言变化
   */
  const handleLanguageChange = useCallback((newLanguage: string) => {
    setLanguage(newLanguage);
    if (data?.onDataChange) {
      data.onDataChange(id, { content: code, title, language: newLanguage });
    }
  }, [id, code, title, data]);

  /**
   * 切换紧凑模式
   */
  const toggleCompact = useCallback(() => {
    setIsCompact(!isCompact);
  }, [isCompact]);

  const handleTitleChange = useCallback((newTitle: string) => {
    setTitle(newTitle);
    if (data?.onDataChange) {
      data.onDataChange(id, { title: newTitle, content: code, language });
    }
  }, [id, code, language, data]);

  return (
    <NodeContainer 
      selected={selected} 
      onDelete={data?.onDelete}
      className="min-w-[400px]"
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
              bg-slate-100 dark:bg-slate-700
              text-slate-600 dark:text-slate-400
              hover:bg-slate-200 dark:hover:bg-slate-600
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
        <MonacoEditor
          value={code}
          onChange={isEditing ? handleCodeChange : () => {}}
          language={language}
          theme="vs-dark"
          height="100%"
          minimap={false}
          fontSize={12}
          lineNumbers="off"
          wordWrap="on"
          readOnly={!isEditing}
          compact={true}
          onMount={(editor) => {
            // 编辑器失去焦点时保存
            if (isEditing) {
              editor.onDidBlurEditorText(() => {
                handleBlur();
              });
            }
          }}
        />
      </div>
    </NodeContainer>
  );
};

export default CodeNode;