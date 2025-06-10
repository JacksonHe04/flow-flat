import React from 'react';
import { useParams } from 'react-router-dom';

const BoardEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="board-editor">
      <h1>白板编辑器 - {id}</h1>
      <div className="canvas-container">
        {/* 这里将来会放置画布组件 */}
        <div className="placeholder">画布区域</div>
      </div>
    </div>
  );
};

export default BoardEditor; 