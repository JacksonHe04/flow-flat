import { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  type Node,
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Toolbar from '../../../components/Toolbar/Toolbar';
import RichTextNode from '../../../components/Node/RichTextNode';
import { useNodeStore } from '../../../stores/nodeStore';

// 定义自定义节点类型
const nodeTypes: NodeTypes = {
  richtext: RichTextNode,
};

const Board: React.FC = () => {
  const { nodes: storeNodes, addNode, removeNode, updateNodePosition } = useNodeStore();
  
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
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

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
    (_event: React.MouseEvent, node: Node) => {
      updateNodePosition(node.id, node.position);
    },
    [updateNodePosition]
  );

  /**
   * 处理画布点击创建节点（使用 useReactFlow 获取正确的坐标）
   */
  const onPaneClick = useCallback(
    (event: React.MouseEvent) => {
      // 简化为单击创建节点，因为 React Flow 12 没有 onPaneDoubleClick
      const reactFlowBounds = (event.target as HTMLElement).getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode = {
        id: `node-${Date.now()}`,
        type: 'richtext' as const,
        position,
        size: { width: 200, height: 150 },
        data: { content: '点击编辑文本' },
      };

      addNode(newNode);
    },
    [addNode]
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
        fitView
        className="bg-slate-50 dark:bg-slate-900"
      >
        <Controls className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
        <MiniMap 
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          nodeColor="#10b981"
        />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} className="bg-slate-100 dark:bg-slate-800" />
        <Panel position="top-center">
          <Toolbar onDeleteSelected={handleDeleteSelected} />
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default Board;