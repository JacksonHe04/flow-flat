import React from 'react';
import { useIdeStore } from '@/stores/ideStore';
import ItemList from '@/components/ItemList';
    
/**
 * IDE项目列表组件
 */
const IdeList: React.FC = () => {
  const { items: ideProjects } = useIdeStore();

  return (
    <ItemList
      title="我的IDE项目"
      items={ideProjects}
      createButtonText="新建项目"
      createButtonLink="/ide/new"
      getItemLink={(id) => `/ide/${id}`}
      previewPlaceholder="项目预览"
    />
  );
};

export default IdeList;