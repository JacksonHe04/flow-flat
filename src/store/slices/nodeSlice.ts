import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Node {
  id: string;
  type: 'component' | 'code' | 'richtext';
  position: Position;
  size: Size;
  data: any;
}

interface NodeState {
  nodes: Record<string, Node>;
  selectedNodeIds: string[];
}

const initialState: NodeState = {
  nodes: {},
  selectedNodeIds: [],
};

const nodeSlice = createSlice({
  name: 'nodes',
  initialState,
  reducers: {
    addNode: (state, action: PayloadAction<Node>) => {
      state.nodes[action.payload.id] = action.payload;
    },
    removeNode: (state, action: PayloadAction<string>) => {
      delete state.nodes[action.payload];
      state.selectedNodeIds = state.selectedNodeIds.filter(id => id !== action.payload);
    },
    updateNodePosition: (
      state,
      action: PayloadAction<{ id: string; position: Position }>
    ) => {
      const node = state.nodes[action.payload.id];
      if (node) {
        node.position = action.payload.position;
      }
    },
    updateNodeSize: (
      state,
      action: PayloadAction<{ id: string; size: Size }>
    ) => {
      const node = state.nodes[action.payload.id];
      if (node) {
        node.size = action.payload.size;
      }
    },
    updateNodeData: (
      state,
      action: PayloadAction<{ id: string; data: any }>
    ) => {
      const node = state.nodes[action.payload.id];
      if (node) {
        node.data = { ...node.data, ...action.payload.data };
      }
    },
    selectNode: (state, action: PayloadAction<string>) => {
      if (!state.selectedNodeIds.includes(action.payload)) {
        state.selectedNodeIds.push(action.payload);
      }
    },
    deselectNode: (state, action: PayloadAction<string>) => {
      state.selectedNodeIds = state.selectedNodeIds.filter(id => id !== action.payload);
    },
    clearSelection: (state) => {
      state.selectedNodeIds = [];
    },
  },
});

export const {
  addNode,
  removeNode,
  updateNodePosition,
  updateNodeSize,
  updateNodeData,
  selectNode,
  deselectNode,
  clearSelection,
} = nodeSlice.actions;

export default nodeSlice.reducer; 