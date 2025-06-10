import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Board {
  id: string;
  title: string;
  createdAt: string;
}

interface BoardsState {
  items: Board[];
  loading: boolean;
  error: string | null;
}

const initialState: BoardsState = {
  items: [
    { id: '1', title: '白板 1', createdAt: new Date().toISOString() },
    { id: '2', title: '白板 2', createdAt: new Date().toISOString() },
  ],
  loading: false,
  error: null,
};

const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    addBoard: (state, action: PayloadAction<Omit<Board, 'createdAt'>>) => {
      state.items.push({
        ...action.payload,
        createdAt: new Date().toISOString(),
      });
    },
    removeBoard: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(board => board.id !== action.payload);
    },
  },
});

export const { addBoard, removeBoard } = boardsSlice.actions;
export default boardsSlice.reducer; 