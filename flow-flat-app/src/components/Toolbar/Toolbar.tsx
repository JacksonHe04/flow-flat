import React, { useState, useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useNodeStore } from '../../stores/nodeStore';
import { nodeTypes, type NodeTypeConfig } from '@/config/nodeTypes';
import StorageManager from '@/components/Storage/StorageManager';

interface ToolbarProps {
  onDeleteSelected: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onDeleteSelected }) => {
  const { addNode } = useNodeStore();
  const { zoomIn, zoomOut, fitView, getZoom, screenToFlowPosition } = useReactFlow();
  const [zoom, setZoom] = useState(getZoom());
  const [selectedNodeType, setSelectedNodeType] = useState<NodeTypeConfig>(nodeTypes[0]);
  const [showNodeTypeMenu, setShowNodeTypeMenu] = useState(false);

  // 监听缩放变化
  useEffect(() => {
    const updateZoom = () => {
      setZoom(getZoom());
    };

    // 定时更新缩放值，因为React Flow没有直接的缩放监听事件
    const interval = setInterval(updateZoom, 100);

    return () => clearInterval(interval);
  }, [getZoom]);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showNodeTypeMenu && !target.closest('.node-type-selector')) {
        setShowNodeTypeMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNodeTypeMenu]);

  /**
   * 处理添加节点
   */
  const handleAddNode = () => {
    // 获取当前视图的中心位置
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // 将屏幕坐标转换为流程图坐标
    const flowPosition = screenToFlowPosition({
      x: centerX,
      y: centerY,
    });
    
    const newNode = {
      id: `node-${Date.now()}`,
      type: 'customNode' as const,
      position: flowPosition,
      size: { width: 200, height: 150 },
      data: { 
         nodeType: selectedNodeType.id,
         title: selectedNodeType.name,
         
       },
    };
    addNode(newNode);
    setShowNodeTypeMenu(false);
  };

  /**
   * 处理选择节点类型
   */
  const handleSelectNodeType = (nodeType: NodeTypeConfig) => {
    setSelectedNodeType(nodeType);
    setShowNodeTypeMenu(false);
  };

  /**
   * 处理重置画布
   */
  const handleResetCanvas = () => {
    fitView();
  };

  return (
    <div className="flex items-center gap-3 px-6 py-3 rounded-xl backdrop-blur-md bg-white/80 dark:bg-slate-800/80 border border-white/20 dark:border-slate-700/50 shadow-lg hover-lift transition-natural">
      {/* 节点类型选择器 */}
      <div className="relative node-type-selector">
        <button
          onClick={() => setShowNodeTypeMenu(!showNodeTypeMenu)}
          className="btn btn-outline btn-sm flex items-center gap-2 min-w-[120px] justify-between hover-scale transition-natural focus-ring"
        >
          <div className="flex items-center gap-2">
             <span>{selectedNodeType.icon}</span>
             <span className="text-xs">{selectedNodeType.name}</span>
           </div>
          <span className="text-xs">▼</span>
        </button>
        
        {/* 下拉菜单 */}
        {showNodeTypeMenu && (
          <div className="absolute top-full left-0 mt-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-white/20 dark:border-slate-700/50 rounded-xl shadow-lg z-50 min-w-[160px] transition-natural">
            {nodeTypes.map((nodeType) => (
              <button
                key={nodeType.id}
                onClick={() => handleSelectNodeType(nodeType)}
                className={`
                  w-full px-4 py-3 text-left hover:bg-white/60 dark:hover:bg-slate-700/60
                  flex items-center gap-3 text-sm transition-natural hover-lift
                  ${selectedNodeType.id === nodeType.id ? 'bg-primary/10 text-primary border-l-2 border-primary' : ''}
                  first:rounded-t-xl last:rounded-b-xl
                `}
              >
                <span>{nodeType.icon}</span>
                 <div>
                   <div className="font-medium">{nodeType.name}</div>
                 </div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      <button
        onClick={handleAddNode}
        className="btn btn-primary btn-sm hover-scale transition-natural focus-ring"
      >
        +
      </button>
      <button
        onClick={onDeleteSelected}
        className="btn btn-error btn-sm hover-scale transition-natural focus-ring"
      >
        -
      </button>
      
      {/* 分隔线 */}
      <div className="divider w-px h-6 bg-neutral-300/60 dark:bg-slate-600/60" />
      
      {/* 存储管理 */}
      <StorageManager />
      
      {/* 分隔线 */}
      <div className="divider w-px h-6 bg-neutral-300/60 dark:bg-slate-600/60" />
      
      <button
        onClick={() => zoomOut()}
        className="btn btn-outline btn-sm w-9 h-9 p-0 flex items-center justify-center hover-scale transition-natural focus-ring"
        title="缩小"
      >
        −
      </button>
      <span className="min-w-[4rem] text-center text-sm text-neutral-600 dark:text-slate-400 font-medium px-2 py-1 rounded-md bg-white/50 dark:bg-slate-700/50">
        {Math.round(zoom * 100)}%
      </span>
      <button
        onClick={() => zoomIn()}
        className="btn btn-outline btn-sm w-9 h-9 p-0 flex items-center justify-center hover-scale transition-natural focus-ring"
        title="放大"
      >
        +
      </button>
      <div className="divider w-px h-6 bg-neutral-300/60 dark:bg-slate-600/60" />
      <button
        onClick={handleResetCanvas}
        className="btn btn-outline btn-sm hover-scale transition-natural focus-ring"
        title="自适应画布大小"
      >
        自适应大小
      </button>
    </div>
  );
};

export default Toolbar;