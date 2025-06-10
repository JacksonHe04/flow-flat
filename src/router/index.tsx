import { createBrowserRouter } from 'react-router-dom';
import BoardList from '../pages/BoardList';
import BoardEditor from '../pages/BoardEditor';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <BoardList />,
  },
  {
    path: '/board/:id',
    element: <BoardEditor />,
  },
]); 