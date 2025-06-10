import React, { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import NodeContainer from '../../../components/Node/NodeContainer';
import RichTextNode from '../../../components/Node/RichTextNode';
import Toolbar from '../../../components/Toolbar/Toolbar';
import { 
  updateNodePosition, 
  clearSelection, 
  addNode,
  removeNode,
  type Node 
} from '../../../store/slices/nodeSlice';

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 3;
const ZOOM_SPEED = 0.001;
const DEFAULT_NODE_SIZE = { width: 200, height: 150 };

const Board: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const nodes = useSelector((state: RootState) => state.nodes.nodes);
  const selectedNodeIds = useSelector((state: RootState) => state.nodes.selectedNodeIds);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // 处理缩放
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * ZOOM_SPEED;
    setZoom(z => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z + delta)));
  }, []);

  // 处理画布平移
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || e.button === 2) { // 中键或右键
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      dispatch(clearSelection());
    }
  }, [pan, dispatch]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  }, [isPanning, panStart]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // 处理双击创建节点
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    // 确保双击的是画布而不是节点
    if ((e.target as HTMLElement).id === 'board-canvas') {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;
      
      const newNode: Node = {
        id: `node-${Date.now()}`,
        type: 'richtext',
        position: { x, y },
        size: DEFAULT_NODE_SIZE,
        data: { content: '双击编辑文本' }
      };
      
      dispatch(addNode(newNode));
    }
  }, [dispatch, pan, zoom]);

  // 处理节点位置更新
  const handleNodePositionChange = useCallback((id: string, newPosition: { x: number; y: number }) => {
    dispatch(updateNodePosition({ id, position: newPosition }));
  }, [dispatch]);

  // 处理节点删除
  const handleDeleteNode = useCallback((id: string) => {
    dispatch(removeNode(id));
  }, [dispatch]);

  // 处理画布重置
  const handleResetCanvas = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const canvas = document.getElementById('board-canvas');
    canvas?.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      canvas?.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  // 添加键盘快捷键支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        selectedNodeIds.forEach(id => handleDeleteNode(id));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeIds, handleDeleteNode]);

  return (
    <div
      id="board-canvas"
      className="
        fixed inset-0 top-16 overflow-hidden
        bg-slate-50 dark:bg-slate-900
        transition-colors duration-200
      "
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onContextMenu={e => e.preventDefault()}
      onDoubleClick={handleDoubleClick}
    >
      <Toolbar
        zoom={zoom}
        onZoomChange={setZoom}
        onResetCanvas={handleResetCanvas}
      />
      <div
        className="absolute inset-0 origin-center"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
        {Object.values(nodes).map((node: Node) => (
          <NodeContainer
            key={node.id}
            id={node.id}
            position={node.position}
            size={node.size}
            selected={selectedNodeIds.includes(node.id)}
            onPositionChange={handleNodePositionChange}
            onDelete={() => handleDeleteNode(node.id)}
          >
            <div className="w-full h-full bg-white dark:bg-slate-800 rounded-lg shadow-md">
              {node.type === 'richtext' ? (
                <RichTextNode
                  id={node.id}
                  content={node.data?.content || '双击编辑文本'}
                />
              ) : (
                <div className="p-4">{node.type}</div>
              )}
            </div>
          </NodeContainer>
        ))}
      </div>
    </div>
  );
};

export default Board; 