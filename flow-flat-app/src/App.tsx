import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/utils/router';

const App: React.FC = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default App;
