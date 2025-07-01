import React from 'react';
import { type NodeProps, type Node as FlowNode } from '@xyflow/react';
import { NodeStoreAdapter, registerNodeType } from 'custom-react-flow-node';
import { useNodeStore } from '@/stores/nodeStore';

// 导入原项目的节点类型
import OriginalTextNode from '../Nodes/TextNode';
import OriginalCodeNode from '../Nodes/CodeNode';
import OriginalImageNode from '../Nodes/ImageNode';
import OriginalMarkdownNode from '../Nodes/MarkdownNode';
import OriginalTodoNode from '../Nodes/TodoNode';

// 导入本地包自定义节点类型（这会自动注册它们）
import './CustomCodeNode';
import './CustomImageNode';

interface NodeData extends Record<string, unknown> {
  nodeType?: string;
  title?: string;
  content?: string;
  onDelete?: () => void;
}

/**
 * 原项目节点适配器
 * 将原项目的节点组件适配为本地包兼容的格式
 */
const createOriginalNodeAdapter = <T extends NodeData>(
  OriginalComponent: React.ComponentType<NodeProps<FlowNode<T>>>
) => {
  return ({ data, ...props }: NodeProps<FlowNode<T>>) => {
    // 直接渲染原项目的节点组件，不经过本地包的转换
    return <OriginalComponent {...props} data={data} />;
  };
};

// 注册原项目的节点类型到本地包系统
registerNodeType('text', createOriginalNodeAdapter(OriginalTextNode));
registerNodeType('code', createOriginalNodeAdapter(OriginalCodeNode));
registerNodeType('image', createOriginalNodeAdapter(OriginalImageNode));
registerNodeType('markdown', createOriginalNodeAdapter(OriginalMarkdownNode));
registerNodeType('todo', createOriginalNodeAdapter(OriginalTodoNode));

/**
 * NodeLayout 的替代组件
 * 使用本地包的 NodeStoreAdapter 来实现与原项目相同的功能
 * 同时支持原项目的节点类型和本地包的自定义节点类型
 */
const NodeLayoutReplacement: React.FC<NodeProps<FlowNode<NodeData>>> = (props) => {
  const { updateNodeData } = useNodeStore();
  
  return (
    <NodeStoreAdapter
      {...props}
      updateNodeData={updateNodeData}
    />
  );
};

export default NodeLayoutReplacement;