import { Editor } from '@tiptap/react';

/**
 * 格式化工具函数
 */

/**
 * 切换粗体格式
 */
export const toggleBold = (editor: Editor) => {
  editor.chain().focus().toggleBold().run();
};

/**
 * 切换斜体格式
 */
export const toggleItalic = (editor: Editor) => {
  editor.chain().focus().toggleItalic().run();
};

/**
 * 切换删除线格式
 */
export const toggleStrike = (editor: Editor) => {
  editor.chain().focus().toggleStrike().run();
};

/**
 * 切换代码格式
 */
export const toggleCode = (editor: Editor) => {
  editor.chain().focus().toggleCode().run();
};

/**
 * 设置标题级别
 */
export const setHeading = (editor: Editor, level: 1 | 2 | 3 | 4 | 5 | 6) => {
  editor.chain().focus().toggleHeading({ level }).run();
};

/**
 * 设置段落
 */
export const setParagraph = (editor: Editor) => {
  editor.chain().focus().setParagraph().run();
};

/**
 * 切换无序列表
 */
export const toggleBulletList = (editor: Editor) => {
  editor.chain().focus().toggleBulletList().run();
};

/**
 * 切换有序列表
 */
export const toggleOrderedList = (editor: Editor) => {
  editor.chain().focus().toggleOrderedList().run();
};


/**
 * 切换引用块
 */
export const toggleBlockquote = (editor: Editor) => {
  editor.chain().focus().toggleBlockquote().run();
};

/**
 * 切换代码块
 */
export const toggleCodeBlock = (editor: Editor) => {
  editor.chain().focus().toggleCodeBlock().run();
};

/**
 * 插入水平分割线
 */
export const insertHorizontalRule = (editor: Editor) => {
  editor.chain().focus().setHorizontalRule().run();
};

/**
 * 插入硬换行
 */
export const insertHardBreak = (editor: Editor) => {
  editor.chain().focus().setHardBreak().run();
};

/**
 * 撤销
 */
export const undo = (editor: Editor) => {
  editor.chain().focus().undo().run();
};

/**
 * 重做
 */
export const redo = (editor: Editor) => {
  editor.chain().focus().redo().run();
};

/**
 * 清除格式
 */
export const clearFormat = (editor: Editor) => {
  editor.chain().focus().clearNodes().unsetAllMarks().run();
};

/**
 * 检查格式状态
 */
export const getFormatState = (editor: Editor) => {
  return {
    bold: editor.isActive('bold'),
    italic: editor.isActive('italic'),
    strike: editor.isActive('strike'),
    code: editor.isActive('code'),
    heading1: editor.isActive('heading', { level: 1 }),
    heading2: editor.isActive('heading', { level: 2 }),
    heading3: editor.isActive('heading', { level: 3 }),
    paragraph: editor.isActive('paragraph'),
    bulletList: editor.isActive('bulletList'),
    orderedList: editor.isActive('orderedList'),
    blockquote: editor.isActive('blockquote'),
    codeBlock: editor.isActive('codeBlock'),
  };
};