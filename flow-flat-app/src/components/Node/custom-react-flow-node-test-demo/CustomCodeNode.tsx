import React, { useState, useCallback } from 'react';
import {
  NodeContainer,
  NodeHeader,
  registerNodeType,
  type CustomNodeProps,
  type BaseNodeData
} from 'custom-react-flow-node';

interface CustomCodeNodeData extends BaseNodeData {
  language?: string;
  code?: string;
  onDataChange?: (data: Partial<CustomCodeNodeData>) => void;
}

/**
 * 自定义代码节点组件
 * 使用本地包的 NodeContainer 和 NodeHeader 组件
 */
const CustomCodeNode: React.FC<CustomNodeProps<CustomCodeNodeData>> = ({ data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [code, setCode] = useState(data?.code || '// 在这里编写代码\nconsole.log("Hello World!");');
  const [title, setTitle] = useState(data?.title || '自定义代码节点');
  const [language, setLanguage] = useState(data?.language || 'javascript');

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
    if (code !== data?.code || title !== data?.title || language !== data?.language) {
      data?.onDataChange?.({ code, title, language });
    }
  }, [code, title, language, data]);

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
      data?.onDataChange?.({ title: newTitle, code, language });
    }
  }, [code, language, data]);

  /**
   * 处理语言变更
   */
  const handleLanguageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    data?.onDataChange?.({ title, code, language: newLanguage });
  }, [title, code, data]);

  return (
    <NodeContainer 
      selected={selected} 
      onDelete={data?.onDelete}
      className="min-w-80"
    >
      <NodeHeader
        nodeType="custom-code"
        title={title}
        onTitleChange={handleTitleChange}
      />
      
      {/* 语言选择器 */}
      <div className="mb-2">
        <select
          value={language}
          onChange={handleLanguageChange}
          className="
            w-full px-2 py-1 text-xs rounded
            bg-gray-100 dark:bg-gray-700
            border border-gray-300 dark:border-gray-600
            text-gray-700 dark:text-gray-300
            focus:outline-none focus:ring-1 focus:ring-blue-500
          "
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
      </div>
      
      {/* 代码内容 */}
      {isEditing ? (
        <textarea
          className="
            w-full h-32 bg-gray-900 text-green-400 font-mono text-xs
            border border-gray-600 rounded p-2 resize-none
            focus:outline-none focus:ring-1 focus:ring-blue-500
          "
          value={code}
          onChange={e => setCode(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          placeholder="在这里编写代码..."
        />
      ) : (
        <div
          className="
            w-full h-32 bg-gray-900 text-green-400 font-mono text-xs
            border border-gray-600 rounded p-2 cursor-text
            overflow-auto whitespace-pre-wrap
          "
          onDoubleClick={handleDoubleClick}
        >
          {code || (
            <span className="text-gray-500">
              双击编辑代码
            </span>
          )}
        </div>
      )}
      
      {/* 语言标识 */}
      <div className="mt-1 text-xs text-gray-500 text-right">
        {language}
      </div>
    </NodeContainer>
  );
};

// 注册自定义节点类型
registerNodeType('custom-code', CustomCodeNode);

export default CustomCodeNode;