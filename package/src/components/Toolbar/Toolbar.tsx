import React, { useState, useEffect, useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { nodeTypes, type NodeTypeConfig, getDefaultNodeData } from '../../utils/nodeTypes';
import { type ToolbarProps } from '../../types';

/**
 * 工具栏组件
 * 提供节点添加、缩放控制等功能
 */
const Toolbar: React.FC<ToolbarProps> = ({ 
  onAddNode, 
  onDeleteSelected, 
  className = '' 
}) => {
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
  const handleAddNode = useCallback(() => {
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
      type: selectedNodeType.id,
      position: flowPosition,
      data: getDefaultNodeData(selectedNodeType.id),
    };
    
    onAddNode?.(newNode);
    setShowNodeTypeMenu(false);
  }, [selectedNodeType, screenToFlowPosition, onAddNode]);

  /**
   * 处理选择节点类型
   */
  const handleSelectNodeType = useCallback((nodeType: NodeTypeConfig) => {
    setSelectedNodeType(nodeType);
    setShowNodeTypeMenu(false);
  }, []);

  /**
   * 处理重置画布
   */
  const handleResetCanvas = useCallback(() => {
    fitView();
  }, [fitView]);

  /**
   * 处理缩放
   */
  const handleZoomIn = useCallback(() => {
    zoomIn();
  }, [zoomIn]);

  const handleZoomOut = useCallback(() => {
    zoomOut();
  }, [zoomOut]);

  return (
    <div className={`flex items-center gap-3 px-6 py-3 rounded-xl backdrop-blur-md bg-white/80 dark:bg-slate-800/80 border border-white/20 dark:border-slate-700/50 shadow-lg transition-all duration-200 ${className}`}>
      {/* 节点类型选择器 */}
      <div className="relative node-type-selector">
        <button
          onClick={() => setShowNodeTypeMenu(!showNodeTypeMenu)}
          className="flex items-center gap-2 min-w-[120px] justify-between px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <div className="flex items-center gap-2">
            <span>{selectedNodeType.icon}</span>
            <span className="text-xs">{selectedNodeType.name}</span>
          </div>
          <span className="text-xs transform transition-transform duration-200 ${showNodeTypeMenu ? 'rotate-180' : ''}">
            ▼
          </span>
        </button>
        
        {/* 下拉菜单 */}
        {showNodeTypeMenu && (
          <div className="absolute top-full left-0 mt-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-white/20 dark:border-slate-700/50 rounded-xl shadow-lg z-50 min-w-[160px] transition-all duration-200">
            {nodeTypes.map((nodeType) => (
              <button
                key={nodeType.id}
                onClick={() => handleSelectNodeType(nodeType)}
                className={`
                  w-full px-4 py-3 text-left hover:bg-white/60 dark:hover:bg-slate-700/60
                  flex items-center gap-3 text-sm transition-colors
                  ${selectedNodeType.id === nodeType.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-l-2 border-blue-500' : ''}
                  first:rounded-t-xl last:rounded-b-xl
                `}
              >
                <span>{nodeType.icon}</span>
                <div>
                  <div className="font-medium">{nodeType.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{nodeType.description}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* 添加节点按钮 */}
      <button
        onClick={handleAddNode}
        className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        title="添加节点"
      >
        +
      </button>
      
      {/* 删除选中节点按钮 */}
      <button
        onClick={onDeleteSelected}
        className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        title="删除选中节点"
      >
        −
      </button>
      
      {/* 分隔线 */}
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
      
      {/* 缩放控制 */}
      <button
        onClick={handleZoomOut}
        className="w-9 h-9 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        title="缩小"
      >
        −
      </button>
      
      <span className="min-w-[4rem] text-center text-sm text-gray-600 dark:text-gray-400 font-medium px-2 py-1 rounded-md bg-white/50 dark:bg-gray-700/50">
        {Math.round(zoom * 100)}%
      </span>
      
      <button
        onClick={handleZoomIn}
        className="w-9 h-9 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        title="放大"
      >
        +
      </button>
      
      {/* 分隔线 */}
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
      
      {/* 自适应画布大小 */}
      <button
        onClick={handleResetCanvas}
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        title="自适应画布大小"
      >
        自适应大小
      </button>
    </div>
  );
};

export default Toolbar;