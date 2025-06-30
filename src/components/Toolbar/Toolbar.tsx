import React from 'react';
import { useDispatch } from 'react-redux';
import { addNode } from '../../store/slices/nodeSlice';

interface ToolbarProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onResetCanvas: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  zoom,
  onZoomChange,
  onResetCanvas,
}) => {
  const dispatch = useDispatch();

  const handleAddNode = () => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: 'component' as const,
      position: { x: 100, y: 100 },
      size: { width: 200, height: 150 },
      data: {},
    };
    dispatch(addNode(newNode));
  };

  const handleRemoveSelectedNodes = () => {
    // 这里需要从 Redux 获取选中的节点，但为了简单起见，我们先不实现
  };

  return (
    <div className="
      fixed top-4 left-1/2 -translate-x-1/2
      flex items-center gap-2 p-2
      bg-white/80 dark:bg-slate-800/80
      backdrop-blur-sm rounded-lg shadow-lg
      border border-slate-200 dark:border-slate-700
      transition-all duration-200
    ">
      <button
        onClick={handleAddNode}
        className="
          p-2 rounded-md
          bg-emerald-500 text-white
          hover:bg-emerald-600
          transition-colors duration-200
        "
      >
        添加节点
      </button>
      <button
        onClick={handleRemoveSelectedNodes}
        className="
          p-2 rounded-md
          bg-red-500 text-white
          hover:bg-red-600
          transition-colors duration-200
        "
      >
        删除节点
      </button>
      <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2" />
      <button
        onClick={() => onZoomChange(zoom - 0.1)}
        className="
          p-2 rounded-md
          bg-slate-100 dark:bg-slate-700
          hover:bg-slate-200 dark:hover:bg-slate-600
          transition-colors duration-200
        "
      >
        -
      </button>
      <span className="min-w-[3rem] text-center">
        {Math.round(zoom * 100)}%
      </span>
      <button
        onClick={() => onZoomChange(zoom + 0.1)}
        className="
          p-2 rounded-md
          bg-slate-100 dark:bg-slate-700
          hover:bg-slate-200 dark:hover:bg-slate-600
          transition-colors duration-200
        "
      >
        +
      </button>
      <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2" />
      <button
        onClick={onResetCanvas}
        className="
          p-2 rounded-md
          bg-slate-100 dark:bg-slate-700
          hover:bg-slate-200 dark:hover:bg-slate-600
          transition-colors duration-200
        "
      >
        重置画布
      </button>
    </div>
  );
};

export default Toolbar;