import React from 'react';
import { type NodeProps, type Node as FlowNode } from '@xyflow/react';
import { CustomNodeProps, BaseNodeData, NodeTypeRegistry } from '../types';
import TextNode from './TextNode';

/**
 * 默认节点类型注册表
 */
const defaultNodeTypes: NodeTypeRegistry = {
  text: TextNode
};

/**
 * 节点类型注册表（可以被外部扩展）
 */
let nodeTypeRegistry: NodeTypeRegistry = { ...defaultNodeTypes };

/**
 * 注册新的节点类型
 */
export const registerNodeType = <T extends BaseNodeData = BaseNodeData>(
  nodeType: string, 
  component: any
) => {
  nodeTypeRegistry[nodeType] = component;
};

/**
 * 获取所有注册的节点类型
 */
export const getRegisteredNodeTypes = (): NodeTypeRegistry => {
  return { ...nodeTypeRegistry };
};

/**
 * 重置节点类型注册表为默认状态
 */
export const resetNodeTypes = () => {
  nodeTypeRegistry = { ...defaultNodeTypes };
};

/**
 * 通用节点组件
 * 根据节点类型动态渲染对应的节点组件
 * 支持 React Flow 的 NodeProps 和自定义的 CustomNodeProps
 */
const Node: React.FC<CustomNodeProps<BaseNodeData> | NodeProps<FlowNode<BaseNodeData>>> = (props) => {
  const { data } = props;
  const nodeType = data?.nodeType || 'text';
  
  // 获取对应的节点组件
  const NodeComponent = nodeTypeRegistry[nodeType];
  
  if (!NodeComponent) {
    console.warn(`未知的节点类型: ${nodeType}，使用默认文本节点`);
    // 默认使用文本节点
    const DefaultComponent = nodeTypeRegistry.text || TextNode;
    return <DefaultComponent {...props as CustomNodeProps<BaseNodeData>} />;
  }

  // 渲染对应的节点组件
  return <NodeComponent {...props as CustomNodeProps<BaseNodeData>} />;
};

export default Node;