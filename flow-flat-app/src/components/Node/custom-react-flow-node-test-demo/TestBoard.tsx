import React, { useState, useEffect, useCallback } from 'react';
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
import { NodeLayoutReplacement } from './index';
import { useNodeStore } from '@/stores/nodeStore';
import { getDefaultNodeType } from '@/config/nodeTypes';

// 定义节点类型，使用我们的替代组件
const nodeTypes: NodeTypes = {
  customNode: NodeLayoutReplacement,
};

/**
 * 测试工具栏组件
 */
const TestToolbar: React.FC<{
  onAddNode: (nodeType: string) => void;
  onDeleteSelected: () => void;
}> = ({ onAddNode, onDeleteSelected }) => {
  return (
    <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">测试节点:</span>
      
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
      
      <span className="text-xs text-gray-500 dark:text-gray-400">
        使用 NodeLayoutReplacement
      </span>
    </div>
  );
};

/**
 * 内部测试Board组件
 */
const TestBoardInner: React.FC = () => {
  const { screenToFlowPosition } = useReactFlow();
  const { nodes: storeNodes, addNode, removeNode, updateNodePosition } = useNodeStore();
  const [lastClickTime, setLastClickTime] = useState(0);

  // 将store中的节点转换为React Flow节点格式
  const convertToReactFlowNodes = useCallback(() => {
    return Object.values(storeNodes).map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: {
        ...node.data,
        onDelete: () => removeNode(node.id),
      },
      style: {
        width: node.size.width,
        height: node.size.height,
      },
    }));
  }, [storeNodes, removeNode]);

  const [nodes, setNodes, onNodesChange] = useNodesState(convertToReactFlowNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // 同步store节点到React Flow节点
  useEffect(() => {
    setNodes(convertToReactFlowNodes());
  }, [storeNodes, convertToReactFlowNodes, setNodes]);

  /**
   * 处理节点连接
   */
  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  /**
   * 处理节点拖拽结束，更新store中的位置
   */
  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: FlowNode) => {
      updateNodePosition(node.id, node.position);
    },
    [updateNodePosition]
  );

  /**
   * 添加新节点
   */
  const handleAddNode = useCallback((nodeType: string) => {
    const position = { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 };
    
    const nodeTypeMap: Record<string, { name: string; description: string }> = {
      text: { name: '文本节点', description: '双击编辑文本内容' },
      'custom-code': { name: '代码节点', description: '// 在这里编写代码\nconsole.log("Hello World!");' },
      'custom-image': { name: '图片节点', description: '双击添加图片' }
    };
    
    const config = nodeTypeMap[nodeType] || { name: '未知节点', description: '' };
    
    const newNode = {
      id: `test-node-${Date.now()}`,
      type: 'customNode' as const,
      position,
      size: { width: 250, height: 180 },
      data: {
        nodeType,
        title: config.name,
        content: config.description
      },
    };

    addNode(newNode);
  }, [addNode]);

  /**
   * 删除选中的节点
   */
  const handleDeleteSelected = useCallback(() => {
    nodes.forEach(node => {
      if ('selected' in node && node.selected) {
        removeNode(node.id);
      }
    });
  }, [nodes, removeNode]);

  /**
   * 处理画布双击创建节点
   */
  const onPaneClick = useCallback(
    (event: React.MouseEvent) => {
      const currentTime = Date.now();
      const timeDiff = currentTime - lastClickTime;
      
      if (timeDiff < 300 && timeDiff > 0) {
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const defaultNodeType = getDefaultNodeType();
        const newNode = {
          id: `test-node-${Date.now()}`,
          type: 'customNode' as const,
          position,
          size: { width: 200, height: 150 },
          data: { 
            nodeType: defaultNodeType.id,
            title: defaultNodeType.name,
            content: defaultNodeType.description 
          },
        };

        addNode(newNode);
        setLastClickTime(0);
      } else {
        setLastClickTime(currentTime);
      }
    },
    [addNode, screenToFlowPosition, lastClickTime]
  );

  return (
    <div className="w-full h-screen bg-slate-50 dark:bg-slate-900">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
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
          <TestToolbar 
            onAddNode={handleAddNode}
            onDeleteSelected={handleDeleteSelected}
          />
        </Panel>
      </ReactFlow>
    </div>
  );
};

/**
 * 测试Board组件包装器
 */
const TestBoard: React.FC = () => {
  return (
    <ReactFlowProvider>
      <TestBoardInner />
    </ReactFlowProvider>
  );
};

export default TestBoard;