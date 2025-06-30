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
 * 切换任务列表
 */
export const toggleTaskList = (editor: Editor) => {
  // TaskList扩展暂时移除，使用普通列表替代
  editor.chain().focus().toggleBulletList().run();
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
 * 设置链接
 */
export const toggleLink = (_editor: Editor, url?: string) => {
  // Link扩展暂时移除，功能暂不可用
  console.warn('Link功能暂时不可用', { url });
};

/**
 * 取消链接
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const removeLink = (_editor: Editor) => {
  // Link扩展暂时移除，功能暂不可用
  console.warn('Link功能暂时不可用');
};

/**
 * 插入图片
 */
export const insertImage = (_editor: Editor, src: string, alt: string = '') => {
  // Image扩展暂时移除，功能暂不可用
  console.warn('Image功能暂时不可用', { src, alt });
};

/**
 * 插入表格
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const insertTable = (_editor: Editor, _rows: number = 3, _cols: number = 3) => {
  // Table扩展暂时移除，功能暂不可用
  console.warn('Table功能暂时不可用');
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
    taskList: editor.isActive('taskList'),
    blockquote: editor.isActive('blockquote'),
    codeBlock: editor.isActive('codeBlock'),
    link: editor.isActive('link'),
  };
};