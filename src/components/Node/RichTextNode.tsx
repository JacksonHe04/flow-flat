import React, { useState, useCallback } from 'react';
import { useNodeStore } from '../../stores/nodeStore';

interface RichTextNodeProps {
  id: string;
  content: string;
}

const RichTextNode: React.FC<RichTextNodeProps> = ({ id, content }) => {
  const { updateNodeData } = useNodeStore();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(content);

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
    if (text !== content) {
      updateNodeData(id, { content: text });
    }
  }, [id, text, content, updateNodeData]);

  /**
   * 处理键盘事件
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      (e.currentTarget as HTMLElement).blur();
    }
  }, []);

  if (isEditing) {
    return (
      <textarea
        className="
          w-full h-full p-2
          bg-transparent
          resize-none
          focus:outline-none focus:ring-2 focus:ring-emerald-400
          dark:text-white
        "
        value={text}
        onChange={e => setText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    );
  }

  return (
    <div
      className="w-full h-full p-2 whitespace-pre-wrap dark:text-white"
      onDoubleClick={handleDoubleClick}
    >
      {text}
    </div>
  );
};

export default RichTextNode;