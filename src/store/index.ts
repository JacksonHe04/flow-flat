import { configureStore } from '@reduxjs/toolkit';
import nodeReducer from './slices/nodeSlice';
import boardsReducer from './slices/boardsSlice';

export const store = configureStore({
  reducer: {
    nodes: nodeReducer,
    boards: boardsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 