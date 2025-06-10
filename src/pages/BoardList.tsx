import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

const BoardList: React.FC = () => {
  const boards = useSelector((state: RootState) => state.boards.items);

  return (
    <div className="board-list">
      <h1>我的白板</h1>
      <div className="board-grid">
        {boards.map(board => (
          <Link key={board.id} to={`/board/${board.id}`} className="board-item">
            <div className="board-preview">{board.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BoardList; 