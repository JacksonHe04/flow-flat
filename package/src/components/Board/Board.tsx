import React, { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
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
import Toolbar from '../Toolbar/Toolbar';
import { nodeComponents } from '../Nodes';
import { getDefaultNodeType, getDefaultNodeData } from '../../utils/nodeTypes';
import { type BoardProps, type FlowFlatNode } from '../../types';

// 定义自定义节点类型
const nodeTypes: NodeTypes = nodeComponents;

/**
 * 内部Board组件，使用useReactFlow hook
 */
const BoardInner: React.FC<BoardProps> = ({
  nodes: externalNodes = [],
  edges: externalEdges = [],
  onNodesChange: onExternalNodesChange,
  onEdgesChange: onExternalEdgesChange,
  onNodeAdd,
  onNodeDelete,
  onNodeDataChange,
  className = '',
}) => {
  const { screenToFlowPosition, setViewport } = useReactFlow();
  const [lastClickTime, setLastClickTime] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // 将外部节点转换为React Flow节点格式
  const convertToReactFlowNodes = useCallback((nodes: FlowFlatNode[]) => {
    return nodes.map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: {
        ...node.data,
        onDelete: () => onNodeDelete?.(node.id),
        onDataChange: (nodeId: string, newData: any) => {
          onNodeDataChange?.(nodeId, newData);
        },
      },
      style: {
        width: node.size?.width,
        height: node.size?.height,
      },
    }));
  }, [onNodeDelete, onNodeDataChange]);

  const [nodes, setNodes, onNodesChange] = useNodesState(convertToReactFlowNodes(externalNodes));
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(externalEdges);

  // 同步外部节点到React Flow节点
  useEffect(() => {
    setNodes(convertToReactFlowNodes(externalNodes));
  }, [externalNodes, convertToReactFlowNodes, setNodes]);

  // 同步外部边到React Flow边
  useEffect(() => {
    setEdges(externalEdges);
  }, [externalEdges, setEdges]);

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
    (params) => {
      const newEdges = addEdge(params, edges);
      setEdges(newEdges);
      onExternalEdgesChange?.(newEdges);
    },
    [edges, setEdges, onExternalEdgesChange]
  );

  /**
   * 处理节点变化
   */
  const handleNodesChange = useCallback(
    (changes: any[]) => {
      onNodesChange(changes);
      // 将变化传递给外部
      onExternalNodesChange?.(changes);
    },
    [onNodesChange, onExternalNodesChange]
  );

  /**
   * 处理边变化
   */
  const handleEdgesChange = useCallback(
    (changes: any[]) => {
      onEdgesChange(changes);
      // 将变化传递给外部
      onExternalEdgesChange?.(changes);
    },
    [onEdgesChange, onExternalEdgesChange]
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
        const newNode: FlowFlatNode = {
          id: `node-${Date.now()}`,
          type: defaultNodeType.id,
          position,
          size: defaultNodeType.defaultSize,
          data: getDefaultNodeData(defaultNodeType.id),
        };

        onNodeAdd?.(newNode);
        setLastClickTime(0); // 重置点击时间
      } else {
        setLastClickTime(currentTime);
      }
    },
    [onNodeAdd, screenToFlowPosition, lastClickTime]
  );

  /**
   * 处理添加节点
   */
  const handleAddNode = useCallback((node: FlowFlatNode) => {
    onNodeAdd?.(node);
  }, [onNodeAdd]);

  /**
   * 处理删除选中节点
   */
  const handleDeleteSelected = useCallback(() => {
    nodes.forEach(node => {
      // React Flow 节点的 selected 属性
      if ('selected' in node && node.selected) {
        onNodeDelete?.(node.id);
      }
    });
  }, [nodes, onNodeDelete]);

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
    <div className={`w-full h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-200 ${className}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
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
          <Toolbar 
            onAddNode={handleAddNode}
            onDeleteSelected={handleDeleteSelected} 
          />
        </Panel>
      </ReactFlow>
    </div>
  );
};

/**
 * Board组件包装器，提供ReactFlowProvider上下文
 */
const Board: React.FC<BoardProps> = (props) => {
  return (
    <ReactFlowProvider>
      <BoardInner {...props} />
    </ReactFlowProvider>
  );
};

export default Board;