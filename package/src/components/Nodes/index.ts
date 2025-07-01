import TextNode from './TextNode';
import CodeNode from './CodeNode';
import MarkdownNode from './MarkdownNode';
import ImageNode from './ImageNode';
import TodoNode from './TodoNode';

export { TextNode, CodeNode, MarkdownNode, ImageNode, TodoNode };
export type { TextNodeData } from './TextNode';
export type { CodeNodeData } from './CodeNode';
export type { MarkdownNodeData } from './MarkdownNode';
export type { ImageNodeData } from './ImageNode';
export type { TodoNodeData, TodoItem } from './TodoNode';

// 导出节点类型映射
export const nodeComponents = {
  text: TextNode,
  code: CodeNode,
  markdown: MarkdownNode,
  image: ImageNode,
  todo: TodoNode,
} as const;

export type NodeComponentType = keyof typeof nodeComponents;