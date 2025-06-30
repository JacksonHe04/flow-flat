import React from 'react';
import { useBoardStore } from '@/stores/boardStore';
import ItemList from '@/components/ItemList';
    
/**
 * 白板列表组件
 */
const BoardList: React.FC = () => {
  const { items: boards } = useBoardStore();

  return (
    <ItemList
      title="我的白板"
      items={boards}
      createButtonText="新建白板"
      createButtonLink="/board/new"
      getItemLink={(id) => `/board/${id}`}
      previewPlaceholder="预览图"
    />
  );
};

export default BoardList;