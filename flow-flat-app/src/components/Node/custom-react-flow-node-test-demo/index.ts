// 导出主要的演示组件
export { default as DemoNode, getAvailableNodeTypes, createDemoNode } from './DemoNode';
export { default as TestNode } from './TestNode';
export { default as CustomCodeNode } from './CustomCodeNode';
export { default as CustomImageNode } from './CustomImageNode';
export { default as NodeLayoutReplacement } from './NodeLayoutReplacement';
export { default as DemoBoard } from './DemoBoard';
export { default as TestBoard } from './TestBoard';

// 重新导出本地包的所有内容，方便使用
export {
  Node,
  NodeContainer,
  NodeHeader,
  TextNode,
  registerNodeType,
  getRegisteredNodeTypes,
  resetNodeTypes,
  type BaseNodeData,
  type NodeContainerProps,
  type NodeHeaderProps,
  type CustomNodeProps,
  type NodeTypeRegistry,
  type NodeTypeConfig
} from 'custom-react-flow-node';