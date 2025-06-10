import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Board {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface BoardsState {
  items: Board[];
  loading: boolean;
  error: string | null;
}

const initialState: BoardsState = {
  items: [
    {
      id: '1',
      title: '示例白板',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ],
  loading: false,
  error: null,
};

const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    addBoard: (state, action: PayloadAction<Board>) => {
      state.items.push(action.payload);
    },
    removeBoard: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(board => board.id !== action.payload);
    },
    updateBoard: (state, action: PayloadAction<Board>) => {
      const index = state.items.findIndex(board => board.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
  },
});

export const { addBoard, removeBoard, updateBoard } = boardsSlice.actions;

export default boardsSlice.reducer; 