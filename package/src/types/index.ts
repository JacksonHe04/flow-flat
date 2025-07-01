import { type Edge } from '@xyflow/react';

/**
 * 节点位置接口
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * 节点尺寸接口
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * 基础节点数据接口
 */
export interface BaseNodeData extends Record<string, unknown> {
  nodeType?: string;
  title?: string;
  content?: string;
  onDelete?: () => void;
  onDataChange?: (id: string, data: any) => void;
}

/**
 * 节点接口
 */
export interface FlowFlatNode {
  id: string;
  type: string;
  position: Position;
  size?: Size;
  data: BaseNodeData;
}

/**
 * 节点类型配置接口
 */
export interface NodeTypeConfig {
  id: string;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  defaultSize?: Size;
}

/**
 * 白板数据接口
 */
export interface BoardData {
  id: string;
  name: string;
  nodes: FlowFlatNode[];
  edges: Edge[];
  viewport?: {
    x: number;
    y: number;
    zoom: number;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * 工具栏属性接口
 */
export interface ToolbarProps {
  onDeleteSelected?: () => void;
  onAddNode?: (node: FlowFlatNode) => void;
  nodeTypes?: NodeTypeConfig[];
  className?: string;
}

/**
 * 白板组件属性接口
 */
export interface BoardProps {
  boardId?: string;
  nodes?: FlowFlatNode[];
  edges?: Edge[];
  initialNodes?: FlowFlatNode[];
  initialEdges?: Edge[];
  onNodeAdd?: (node: FlowFlatNode) => void;
  onNodeDelete?: (nodeId: string) => void;
  onNodeDataChange?: (nodeId: string, data: any) => void;
  onNodesChange?: (changes: any[]) => void;
  onEdgesChange?: (changes: any[]) => void;
  showToolbar?: boolean;
  showControls?: boolean;
  showMiniMap?: boolean;
  className?: string;
}

/**
 * 节点组件属性接口
 */
export interface NodeComponentProps {
  id: string;
  data: BaseNodeData;
  selected?: boolean;
  onDataChange?: (id: string, data: Partial<BaseNodeData>) => void;
  onDelete?: (id: string) => void;
}

export * from '@xyflow/react';