import React from 'react';
import { useMarkdownStore } from '@/stores/markdownStore';
import ItemList from '@/components/ItemList';
    
/**
 * Markdown文档列表组件
 */
const MarkdownList: React.FC = () => {
  const { items: markdownDocs } = useMarkdownStore();

  return (
    <ItemList
      title="我的Markdown文档"
      items={markdownDocs}
      createButtonText="新建文档"
      createButtonLink="/markdown/new"
      getItemLink={(id) => `/markdown/${id}`}
      previewPlaceholder="文档预览"
    />
  );
};

export default MarkdownList;