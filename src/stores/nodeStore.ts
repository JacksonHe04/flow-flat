import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

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
 * 节点接口
 */
export interface Node {
  id: string;
  type: 'component' | 'code' | 'richtext' | 'customNode';
  position: Position;
  size: Size;
  data: Record<string, unknown>;
}

/**
 * 节点状态接口
 */
interface NodeState {
  nodes: Record<string, Node>;
  selectedNodeIds: string[];
}

/**
 * 节点操作接口
 */
interface NodeActions {
  /**
   * 添加节点
   */
  addNode: (node: Node) => void;
  /**
   * 删除节点
   */
  removeNode: (id: string) => void;
  /**
   * 更新节点位置
   */
  updateNodePosition: (id: string, position: Position) => void;
  /**
   * 更新节点尺寸
   */
  updateNodeSize: (id: string, size: Size) => void;
  /**
   * 更新节点数据
   */
  updateNodeData: (id: string, data: Record<string, unknown>) => void;
  /**
   * 选择节点
   */
  selectNode: (id: string) => void;
  /**
   * 取消选择节点
   */
  deselectNode: (id: string) => void;
  /**
   * 清空选择
   */
  clearSelection: () => void;
}

/**
 * 节点状态管理store
 */
export const useNodeStore = create<NodeState & NodeActions>()(immer((set) => ({
  // 初始状态
  nodes: {},
  selectedNodeIds: [],

  // 操作方法
  addNode: (node) => set((state) => {
    state.nodes[node.id] = node;
  }),

  removeNode: (id) => set((state) => {
    delete state.nodes[id];
    state.selectedNodeIds = state.selectedNodeIds.filter(nodeId => nodeId !== id);
  }),

  updateNodePosition: (id, position) => set((state) => {
    const node = state.nodes[id];
    if (node) {
      node.position = position;
    }
  }),

  updateNodeSize: (id, size) => set((state) => {
    const node = state.nodes[id];
    if (node) {
      node.size = size;
    }
  }),

  updateNodeData: (id, data) => set((state) => {
    const node = state.nodes[id];
    if (node) {
      node.data = { ...node.data, ...data };
    }
  }),

  selectNode: (id) => set((state) => {
    if (!state.selectedNodeIds.includes(id)) {
      state.selectedNodeIds.push(id);
    }
  }),

  deselectNode: (id) => set((state) => {
    state.selectedNodeIds = state.selectedNodeIds.filter(nodeId => nodeId !== id);
  }),

  clearSelection: () => set((state) => {
    state.selectedNodeIds = [];
  }),
})));