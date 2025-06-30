import React from 'react';
import { Link } from 'react-router-dom';
import { useBoardStore } from '@/stores/boardStore';
    
/**
 * 白板列表组件
 */
const BoardList: React.FC = () => {
  const { items: boards } = useBoardStore();

  return (
    <div className="p-8">
      <div className="
        max-w-7xl mx-auto
        space-y-8
      ">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            我的白板
          </h1>
          <Link
            to="/board/new"
            className="
              px-4 py-2 rounded-lg
              bg-primary text-white
              hover:bg-primary/90
              transition-colors duration-200
            "
          >
            新建白板
          </Link>
        </div>

        <div className="
          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
          gap-6
        ">
          {boards.map(board => (
            <Link
              key={board.id}
              to={`/board/${board.id}`}
              className="
                group
                bg-white dark:bg-slate-800
                rounded-lg shadow-md
                overflow-hidden
                transition-all duration-200
                hover:shadow-lg
                hover:scale-[1.02]
                border border-slate-200 dark:border-slate-700
              "
            >
              <div className="
                aspect-video
                bg-slate-100 dark:bg-slate-700
                flex items-center justify-center
                text-slate-400 dark:text-slate-500
              ">
                预览图
              </div>
              <div className="p-4">
                <h3 className="
                  text-lg font-medium
                  text-slate-900 dark:text-white
                  group-hover:text-primary
                  transition-colors duration-200
                ">
                  {board.title}
                </h3>
                <p className="
                  mt-1 text-sm
                  text-slate-500 dark:text-slate-400
                ">
                  最后编辑：{new Date(board.updatedAt).toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoardList;