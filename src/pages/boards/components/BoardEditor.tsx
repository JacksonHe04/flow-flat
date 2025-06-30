import React from 'react';
import Board from './Board';

/**
 * 白板编辑器组件
 */
const BoardEditor: React.FC = () => {
  return (
    <div className="board-editor">
      <Board />
    </div>
  );
};

export default BoardEditor;