import React from 'react';
import { useReactFlow } from '@xyflow/react';
import { useNodeStore } from '../../stores/nodeStore';

interface ToolbarProps {
  onDeleteSelected: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onDeleteSelected }) => {
  const { addNode } = useNodeStore();
  const { zoomIn, zoomOut, fitView, getZoom } = useReactFlow();
  const zoom = getZoom();

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
    <div className="toolbar flex items-center gap-2 p-2">
      <button
        onClick={handleAddNode}
        className="btn btn-primary"
      >
        添加节点
      </button>
      <button
        onClick={onDeleteSelected}
        className="btn btn-error"
      >
        删除节点
      </button>
      <div className="divider" />
      <button
        onClick={() => zoomOut()}
        className="btn"
      >
        -
      </button>
      <span className="min-w-[3rem] text-center text-secondary">
        {Math.round(zoom * 100)}%
      </span>
      <button
        onClick={() => zoomIn()}
        className="btn"
      >
        +
      </button>
      <div className="divider" />
      <button
        onClick={handleResetCanvas}
        className="btn"
      >
        重置画布
      </button>
    </div>
  );
};

export default Toolbar;