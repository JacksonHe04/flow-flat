import React from 'react';
import { type NodeProps, type Node as FlowNode } from '@xyflow/react';
import { getNodeTypeById } from '@/config/nodeTypes';
import TextNode from './TextNode';
import CodeNode from './CodeNode';
import ImageNode from './ImageNode';
import MarkdownNode from './MarkdownNode';
import TodoNode from './TodoNode';

interface NodeData extends Record<string, unknown> {
  nodeType?: string;
  title?: string;
  content?: string;
  onDelete?: () => void;
}

/**
 * 通用节点组件
 * 根据节点类型动态渲染对应的节点组件
 */
const Node: React.FC<NodeProps<FlowNode<NodeData>>> = (props) => {
  const { data } = props;
  const nodeType = data?.nodeType || 'text';
  
  // 获取节点类型配置
  const nodeTypeConfig = getNodeTypeById(nodeType);
  
  if (!nodeTypeConfig) {
    console.warn(`未知的节点类型: ${nodeType}`);
    // 默认使用文本节点
    return <TextNode {...props} />;
  }

  // 根据节点类型渲染对应的组件
  switch (nodeType) {
    case 'text':
      return <TextNode {...props} />;
    case 'code':
      return <CodeNode {...props} />;
    case 'image':
      return <ImageNode {...props} />;
    case 'markdown':
      return <MarkdownNode {...props} />;
    case 'todo':
      return <TodoNode {...props} />;
    default:
      console.warn(`未实现的节点类型: ${nodeType}`);
      return <TextNode {...props} />;
  }
};

export default Node;