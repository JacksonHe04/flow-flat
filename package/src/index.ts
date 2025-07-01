// 主要组件
export { default as Board } from './components/Board/Board';
export { default as Toolbar } from './components/Toolbar/Toolbar';

// 节点组件
export {
  TextNode,
  CodeNode,
  MarkdownNode,
  ImageNode,
  TodoNode,
  nodeComponents,
  type NodeComponentType,
} from './components/Nodes';

// 节点布局组件
export { default as NodeContainer } from './components/NodeLayout/NodeContainer';
export { default as NodeHeader } from './components/NodeLayout/NodeHeader';

// 编辑器组件
export { default as MonacoEditor } from './components/CodeEditor/MonacoEditor';
export { default as LanguageSelector } from './components/CodeEditor/LanguageSelector';
export { default as MarkdownEditor } from './components/Markdown/MarkdownEditor';
export { SUPPORTED_LANGUAGES } from './components/CodeEditor/constants';

// 类型定义
export type {
  Position,
  Size,
  BaseNodeData,
  FlowFlatNode,
  NodeTypeConfig,
  BoardData,
  ToolbarProps,
  BoardProps,
  NodeComponentProps,
} from './types';

// 工具函数
export {
  nodeTypes,
  getNodeTypeById,
  getDefaultNodeType,
  getDefaultNodeData,
} from './utils/nodeTypes';

// 样式
// CSS styles are imported separately
// import './styles/index.css';