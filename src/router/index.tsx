import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import Home from '@/pages/home';
import BoardList from '@/pages/boards';
import Board from '@/pages/boards/components/Board';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/boards',
        element: <BoardList />,
      },
      {
        path: '/board/:id',
        element: <Board />,
      },
    ],
  },

]);