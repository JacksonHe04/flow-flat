import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
// import Link from '@tiptap/extension-link'; // 暂时移除，存在类型兼容性问题
// import Image from '@tiptap/extension-image'; // 暂时移除，存在类型兼容性问题



/**
 * 获取基础扩展配置
 * 包含所有编辑器的通用扩展
 */
export const getBaseExtensions = (placeholder?: string): Extension[] => {
  return [
    StarterKit,
    Placeholder.configure({
      placeholder: placeholder || '开始输入...',
    }),
    Typography,
    // Link扩展暂时移除，存在类型兼容性问题
    // Image和Table扩展暂时移除，存在类型兼容性问题
  ];
};

/**
 * 获取只读模式的扩展配置
 * 用于预览模式
 */
export const getReadOnlyExtensions = (): Extension[] => {
  return [
    StarterKit.configure({
      codeBlock: false,
    }),
    Typography,
    // Link扩展暂时移除，存在类型兼容性问题
    // Image和Table扩展暂时移除，存在类型兼容性问题
  ];
};