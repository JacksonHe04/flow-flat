import React, { useState, useCallback, useEffect } from 'react';
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
import Toolbar from '@/components/Toolbar/Toolbar';
import CustomNode from '@/components/Node/NodeLayout/Node';
import { useNodeStore } from '@/stores/nodeStore';
import { getDefaultNodeType } from '@/config/nodeTypes';

// 定义自定义节点类型
const nodeTypes: NodeTypes = {
  customNode: CustomNode,
};

/**
 * 内部Board组件，使用useReactFlow hook
 */
const BoardInner: React.FC = () => {
  const { nodes: storeNodes, addNode, removeNode, updateNodePosition } = useNodeStore();
  const { screenToFlowPosition, setViewport } = useReactFlow();
  const [lastClickTime, setLastClickTime] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  
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

  // 初始化画布，设置默认缩放为100%
  useEffect(() => {
    if (!isInitialized) {
      // 设置默认缩放为100%（1.0）
      setViewport({ x: 0, y: 0, zoom: 1 });
      setIsInitialized(true);
    }
  }, [setViewport, isInitialized]);

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
   * 处理画布点击，检测双击创建节点
   */
  const onPaneClick = useCallback(
    (event: React.MouseEvent) => {
      const currentTime = Date.now();
      const timeDiff = currentTime - lastClickTime;
      
      // 检测双击（300ms内的两次点击）
      if (timeDiff < 300 && timeDiff > 0) {
        // 使用 screenToFlowPosition 获取正确的流程图坐标
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const defaultNodeType = getDefaultNodeType();
        const newNode = {
          id: `node-${Date.now()}`,
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
        setLastClickTime(0); // 重置点击时间
      } else {
        setLastClickTime(currentTime);
      }
    },
    [addNode, screenToFlowPosition, lastClickTime]
  );

  /**
   * 处理删除选中节点
   */
  const handleDeleteSelected = useCallback(() => {
    nodes.forEach(node => {
      // React Flow 节点的 selected 属性
      if ('selected' in node && node.selected) {
        removeNode(node.id);
      }
    });
  }, [nodes, removeNode]);

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        handleDeleteSelected();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDeleteSelected]);

  return (
    <div className="fixed inset-0 top-16 bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
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
      >
        <Controls className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
        <MiniMap 
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          nodeColor="#10b981"
        />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} className="bg-slate-100 dark:bg-slate-800" />
        <Panel position="top-center">
          <Toolbar 
            onDeleteSelected={handleDeleteSelected} 
            edges={edges}
            onEdgesChange={setEdges}
          />
        </Panel>
      </ReactFlow>
    </div>
  );
};

/**
 * Board组件包装器，提供ReactFlowProvider上下文
 */
const Board: React.FC = () => {
  return (
    <ReactFlowProvider>
      <BoardInner />
    </ReactFlowProvider>
  );
};

export default Board;