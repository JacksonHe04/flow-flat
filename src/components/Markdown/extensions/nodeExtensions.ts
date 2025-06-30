import { Extension } from '@tiptap/core';
import { getBaseExtensions } from './baseExtensions';

/**
 * 获取节点场景的扩展配置
 * 针对MarkdownNode组件优化，功能相对简化
 */
export const getNodeExtensions = (placeholder?: string): Extension[] => {
  const baseExtensions = getBaseExtensions(placeholder || '双击编辑内容...');
  
  // 过滤掉一些在节点中不太需要的扩展
  return baseExtensions.filter(extension => {
    const name = extension.name;
    // 在节点中暂时不需要表格和任务列表功能
    return !['table', 'tableRow', 'tableHeader', 'tableCell', 'taskList', 'taskItem'].includes(name);
  });
};

/**
 * 获取节点预览模式的扩展配置
 */
export const getNodePreviewExtensions = (): Extension[] => {
  const nodeExtensions = getNodeExtensions();
  
  // 移除占位符扩展，因为预览模式不需要
  return nodeExtensions.filter(extension => extension.name !== 'placeholder');
};