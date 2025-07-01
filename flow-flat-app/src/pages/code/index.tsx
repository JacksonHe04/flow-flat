import React from 'react';
import { useCodeStore } from '@/stores/codeStore';
import ItemList from '@/components/ItemList';
    
/**
 * 代码编辑器项目列表组件
 */
const CodeList: React.FC = () => {
  const { items: codeProjects } = useCodeStore();

  return (
    <ItemList
      title="我的代码"
      items={codeProjects}
      createButtonText="新建代码"
      createButtonLink="/code/new"
      getItemLink={(id) => `/code/${id}`}
      previewPlaceholder="项目预览"
    />
  );
};

export default CodeList;