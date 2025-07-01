import React, { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Board as FlowFlatBoard, type FlowFlatNode, type BoardProps } from '@flow-flat/core';
import { type Edge, ReactFlowProvider, applyEdgeChanges, type EdgeChange } from '@xyflow/react';
import StorageManager from '@/components/Storage/StorageManager';
import { useNodeStore, type Node } from '@/stores/nodeStore';
import { useStorageStore } from '@/stores/storageStore';

/**
 * Board组件
 */
const Board: React.FC = () => {
  const { id: boardId } = useParams<{ id: string }>();
  const { nodes: storeNodes, addNode, removeNode, updateNodePosition, clearNodes } = useNodeStore();
  const { loadBoard, currentBoardId, setCurrentBoardId, init, isInitialized } = useStorageStore();
  const [isLoading, setIsLoading] = useState(false);
  const [edges, setEdges] = useState<unknown[]>([]);
  
  // 将store中的节点转换为FlowFlatNode格式
  const { updateNodeData } = useNodeStore();

  const convertToFlowFlatNodes = useCallback((): FlowFlatNode[] => {
    return Object.values(storeNodes).map(node => ({
      id: node.id,
      type: node.data.nodeType as string || 'text',
      position: node.position,
      size: node.size,
      data: {
        ...node.data,
        onDelete: () => removeNode(node.id),
        onDataChange: (nodeId: string, newData: unknown) => {
          updateNodeData(nodeId, newData as Record<string, unknown>);
        },
      },
    }));
  }, [storeNodes, removeNode, updateNodeData]);

  const flowFlatNodes = convertToFlowFlatNodes();

  // 初始化存储
  useEffect(() => {
    const initializeStorage = async () => {
      if (!isInitialized) {
        try {
          console.log('Initializing storage in Board component...');
          await init();
          console.log('Storage initialized successfully in Board component');
        } catch (error) {
          console.error('Failed to initialize storage in Board component:', error);
        }
      }
    };

    initializeStorage();
  }, [init, isInitialized]);

  // 加载白板数据
  useEffect(() => {
    const loadBoardData = async () => {
      // 确保存储已初始化
      if (!isInitialized) {
        console.log('Storage not initialized yet, waiting...');
        return;
      }

      if (!boardId || boardId === 'new') {
        // 新建白板或无效ID，清空当前数据
        if (currentBoardId) {
          clearNodes();
          setCurrentBoardId(null);
        }
        return;
      }

      // 如果已经是当前白板，不需要重新加载
      if (currentBoardId === boardId) {
        return;
      }

      setIsLoading(true);
      try {
        console.log('Loading board data for ID:', boardId);
        const boardData = await loadBoard(boardId);
        if (boardData) {
          console.log('Loaded board data:', boardData);
          console.log('Nodes to load:', boardData.nodes);
          console.log('Edges to load:', boardData.edges);
          
          // 清空当前节点
          clearNodes();
          // 设置当前白板ID
          setCurrentBoardId(boardId);
          
          // 加载新的节点数据
          boardData.nodes.forEach((node, index) => {
            console.log(`Adding node ${index + 1}/${boardData.nodes.length}:`, node);
            addNode(node);
          });
          
          // 设置边数据
          setEdges(boardData.edges as Edge[]);
          
          console.log('Board data loaded successfully:', boardId);
          console.log('Current store nodes after loading:', storeNodes);
        } else {
          console.warn('No board data found for ID:', boardId);
        }
      } catch (error) {
        console.error('Failed to load board:', error);
        alert(`加载白板失败: ${error instanceof Error ? error.message : '未知错误'}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadBoardData();
  }, [boardId, currentBoardId, loadBoard, clearNodes, addNode, setEdges, setCurrentBoardId, isInitialized]);

  /**
   * 处理添加节点
   */
  const handleNodeAdd = useCallback((node: FlowFlatNode) => {
    console.log('Adding node:', node);
    console.log('Current board ID:', currentBoardId);
    
    // 如果当前没有白板ID，说明是新白板，需要设置一个临时ID
    if (!currentBoardId && boardId && boardId !== 'new') {
      setCurrentBoardId(boardId);
    }
    
    const storeNode: Node = {
      id: node.id,
      type: node.type, // 保持原始节点类型
      position: node.position,
      size: node.size || { width: 200, height: 150 },
      data: {
        nodeType: node.type,
        ...node.data,
      },
    };
    addNode(storeNode);
    console.log('Node added to store:', storeNode);
  }, [addNode, currentBoardId, boardId, setCurrentBoardId]);

  /**
   * 处理删除节点
   */
  const handleNodeDelete = useCallback((nodeId: string) => {
    removeNode(nodeId);
  }, [removeNode]);

  /**
   * 处理节点数据变化
   */
  const handleNodeDataChange = useCallback((nodeId: string, newData: unknown) => {
    updateNodeData(nodeId, newData as Record<string, unknown>);
  }, [updateNodeData]);

  /**
   * 处理节点变化（位置、选择等）
   */
  const handleNodesChange = useCallback((changes: unknown[]) => {
    console.log('Nodes changes received:', changes);
    changes.forEach((change: unknown) => {
      const changeObj = change as Record<string, unknown>;
      if (changeObj.type === 'position' && changeObj.position) {
        updateNodePosition(changeObj.id as string, changeObj.position as { x: number; y: number });
      }
      // 处理其他类型的变化，如选择状态等
      console.log('Processing node change:', changeObj);
    });
  }, [updateNodePosition]);

  /**
   * 处理边变化
   */
  const handleEdgesChange = useCallback((changes: EdgeChange[]) => {
    console.log('Edges changed:', changes);
    
    // 使用React Flow的applyEdgeChanges来处理边变化
    setEdges(currentEdges => {
      const newEdges = applyEdgeChanges(changes, currentEdges);
      console.log('Updated edges state:', newEdges);
      return newEdges;
    });
  }, [setEdges]);

  /**
   * 处理连接创建
   * @param connection - 连接参数
   */
  const handleConnect = useCallback((connection: unknown) => {
    console.log('Connection created:', connection);
    
    // 确保连接参数包含必要的属性
    if (!connection || typeof connection !== 'object') {
      console.error('Invalid connection parameters:', connection);
      return;
    }
    
    const connectionObj = connection as Record<string, unknown>;
    if (!connectionObj.source || !connectionObj.target) {
      console.error('Connection missing source or target:', connection);
      return;
    }
    
    setEdges(currentEdges => {
      const newEdge = {
        ...connectionObj,
        id: `edge-${Date.now()}`,
      } as Edge;
      const newEdges = [...currentEdges, newEdge];
      console.log('New edge added via connection:', newEdge);
      console.log('All edges after connection:', newEdges);
      return newEdges;
    });
  }, [setEdges]);

  return (
    <div className="fixed inset-0 top-16 bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center z-50">
          <div className="flex items-center space-x-3 bg-white dark:bg-slate-800 px-6 py-4 rounded-lg shadow-lg">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-700 dark:text-gray-300">加载白板中...</span>
          </div>
        </div>
      )}
      <ReactFlowProvider>
        <div className="relative w-full h-full">
          <FlowFlatBoard
            nodes={flowFlatNodes}
            edges={edges as Edge[]}
            onNodeAdd={handleNodeAdd}
            onNodeDelete={handleNodeDelete}
            onNodeDataChange={handleNodeDataChange}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onConnect={handleConnect}
            className="w-full h-full"
          />
          {/* 存储管理面板 */}
          <div className="absolute top-4 right-4 z-10">
            <StorageManager />
          </div>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default Board;