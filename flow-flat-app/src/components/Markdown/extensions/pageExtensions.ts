import { Extension } from '@tiptap/core';
import { getBaseExtensions } from './baseExtensions';

/**
 * 获取页面编辑器扩展
 * 包含基础扩展和页面专用扩展
 */
export const getPageExtensions = () => {
  const baseExtensions = getBaseExtensions();
  
  // 添加页面专用的扩展
  return [
    ...baseExtensions,
    // 可以在这里添加更多页面专用扩展
  ];
};

/**
 * 获取页面预览模式的扩展配置
 */
export const getPagePreviewExtensions = (): Extension[] => {
  const pageExtensions = getPageExtensions();
  
  // 移除占位符和提及扩展，因为预览模式不需要
  return pageExtensions.filter(extension => 
    !['placeholder', 'mention'].includes(extension.name)
  );
};