import { createBrowserRouter } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import Home from '@/pages/home';
import BoardList from '@/pages/boards';
import Board from '@/pages/boards/components/Board';
import MarkdownList from '@/pages/markdown';
import IdeList from '@/pages/ide';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      // 把/home重定向到/
      {
        path: '/home',
        element: <Navigate to="/" replace />,
      },
      {
        path: '/boards',
        element: <BoardList />,
      },
      {
        path: '/board/:id',
        element: <Board />,
      },
      {
        path: '/markdown',
        element: <MarkdownList />,
      },
      {
        path: '/markdown/:id',
        element: <div>Markdown编辑器页面</div>,
      },
      {
        path: '/ide',
        element: <IdeList />,
      },
      {
        path: '/ide/:id',
        element: <div>IDE编辑器页面</div>,
      },
    ],
  },

]);