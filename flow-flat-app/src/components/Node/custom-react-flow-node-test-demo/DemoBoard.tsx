import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  type Node as FlowNode,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  Panel,
  type NodeTypes,
  useReactFlow,
  ReactFlowProvider,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { DemoNode, createDemoNode, getAvailableNodeTypes } from './index';

// 定义节点类型
const nodeTypes: NodeTypes = {
  demoNode: DemoNode,
};

/**
 * 演示工具栏组件
 */
const DemoToolbar: React.FC<{
  onAddNode: (nodeType: string) => void;
  onDeleteSelected: () => void;
}> = ({ onAddNode, onDeleteSelected }) => {
  const availableTypes = getAvailableNodeTypes();
  
  return (
    <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">添加节点:</span>
      
      {/* 文本节点 */}
      <button
        onClick={() => onAddNode('text')}
        className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        文本
      </button>
      
      {/* 代码节点 */}
      <button
        onClick={() => onAddNode('custom-code')}
        className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        代码
      </button>
      
      {/* 图片节点 */}
      <button
        onClick={() => onAddNode('custom-image')}
        className="px-3 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
      >
        图片
      </button>
      
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
      
      {/* 删除按钮 */}
      <button
        onClick={onDeleteSelected}
        className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      >
        删除选中
      </button>
      
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
      
      {/* 节点类型统计 */}
      <span className="text-xs text-gray-500 dark:text-gray-400">
        已注册 {Object.keys(availableTypes).length} 种节点类型
      </span>
    </div>
  );
};

/**
 * 内部演示Board组件
 */
const DemoBoardInner: React.FC = () => {
  const { screenToFlowPosition } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [lastClickTime, setLastClickTime] = useState(0);

  /**
   * 处理节点连接
   */
  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  /**
   * 添加新节点
   */
  const handleAddNode = useCallback((nodeType: string) => {
    // 在画布中心添加节点
    const position = { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 };
    const newNode = createDemoNode(nodeType, position);
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  /**
   * 删除选中的节点
   */
  const handleDeleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter(node => !node.selected));
  }, [setNodes]);

  /**
   * 处理画布双击创建节点
   */
  const onPaneClick = useCallback(
    (event: React.MouseEvent) => {
      const currentTime = Date.now();
      const timeDiff = currentTime - lastClickTime;
      
      // 检测双击（300ms内的两次点击）
      if (timeDiff < 300 && timeDiff > 0) {
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const newNode = createDemoNode('text', position);
        setNodes((nds) => [...nds, newNode]);
        setLastClickTime(0);
      } else {
        setLastClickTime(currentTime);
      }
    },
    [screenToFlowPosition, lastClickTime, setNodes]
  );

  return (
    <div className="w-full h-screen bg-slate-50 dark:bg-slate-900">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        className="bg-slate-50 dark:bg-slate-900"
        fitView
      >
        <Controls className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
        <MiniMap 
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          nodeColor="#10b981"
        />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={12} 
          size={1} 
          className="bg-slate-100 dark:bg-slate-800" 
        />
        <Panel position="top-center">
          <DemoToolbar 
            onAddNode={handleAddNode}
            onDeleteSelected={handleDeleteSelected}
          />
        </Panel>
      </ReactFlow>
    </div>
  );
};

/**
 * 演示Board组件包装器
 */
const DemoBoard: React.FC = () => {
  return (
    <ReactFlowProvider>
      <DemoBoardInner />
    </ReactFlowProvider>
  );
};

export default DemoBoard;