import React, { useState, useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useNodeStore } from '../../stores/nodeStore';

interface ToolbarProps {
  onDeleteSelected: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onDeleteSelected }) => {
  const { addNode } = useNodeStore();
  const { zoomIn, zoomOut, fitView, getZoom } = useReactFlow();
  const [zoom, setZoom] = useState(getZoom());

  // 监听缩放变化
  useEffect(() => {
    const updateZoom = () => {
      setZoom(getZoom());
    };

    // 定时更新缩放值，因为React Flow没有直接的缩放监听事件
    const interval = setInterval(updateZoom, 100);

    return () => clearInterval(interval);
  }, [getZoom]);

  /**
   * 处理添加节点
   */
  const handleAddNode = () => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: 'richtext' as const,
      position: { x: 100, y: 100 },
      size: { width: 200, height: 150 },
      data: { content: '新建节点' },
    };
    addNode(newNode);
  };

  /**
   * 处理重置画布
   */
  const handleResetCanvas = () => {
    fitView();
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-lg backdrop-blur-md bg-white/80 dark:bg-slate-800/80 border border-white/20 dark:border-slate-700/50 shadow-lg">
      <button
        onClick={handleAddNode}
        className="btn btn-primary btn-sm"
      >
        添加节点
      </button>
      <button
        onClick={onDeleteSelected}
        className="btn btn-error btn-sm"
      >
        删除节点
      </button>
      <div className="w-px h-6 bg-neutral-300 dark:bg-slate-600" />
      <button
        onClick={() => zoomOut()}
        className="btn btn-outline btn-sm w-8 h-8 p-0 flex items-center justify-center"
      >
        -
      </button>
      <span className="min-w-[3rem] text-center text-sm text-neutral-600 dark:text-slate-400 font-medium">
        {Math.round(zoom * 100)}%
      </span>
      <button
        onClick={() => zoomIn()}
        className="btn btn-outline btn-sm w-8 h-8 p-0 flex items-center justify-center"
      >
        +
      </button>
      <div className="w-px h-6 bg-neutral-300 dark:bg-slate-600" />
      <button
        onClick={handleResetCanvas}
        className="btn btn-outline btn-sm"
      >
        自适应大小
      </button>
    </div>
  );
};

export default Toolbar;