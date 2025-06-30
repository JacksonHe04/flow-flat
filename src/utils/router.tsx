import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import Home from '@/pages/home';
import BoardList from '@/pages/boards';
import Board from '@/pages/boards/components/Board';
import MarkdownList from '@/pages/markdown';
import MarkdownEditor from '@/components/Markdown/MarkdownEditor';
import CodeList from '@/pages/code';
import CodeEditor from '@/pages/code/components/CodeEditor';
import Docs from '@/pages/docs';

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
        element: <MarkdownEditor />,
      },
      {
        path: '/code',
        element: <CodeList />,
      },
      {
        path: '/code/:id',
        element: <CodeEditor />,
      },
      {
        path: '/docs',
        element: <Docs />,
      },
    ],
  },

]);