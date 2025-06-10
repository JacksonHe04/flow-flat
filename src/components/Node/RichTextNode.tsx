import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { updateNodeData } from '../../store/slices/nodeSlice';

interface RichTextNodeProps {
  id: string;
  content: string;
}

const RichTextNode: React.FC<RichTextNodeProps> = ({ id, content }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(content);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (text !== content) {
      dispatch(updateNodeData({ id, data: { content: text } }));
    }
  }, [id, text, content, dispatch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.blur();
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