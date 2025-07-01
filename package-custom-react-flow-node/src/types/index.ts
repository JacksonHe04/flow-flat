import { type NodeProps, type Node as FlowNode } from '@xyflow/react';

/**
 * 基础节点数据接口
 */
export interface BaseNodeData extends Record<string, unknown> {
  nodeType?: string;
  title?: string;
  content?: string;
  onDelete?: () => void;
}

/**
 * 节点容器组件属性
 */
export interface NodeContainerProps {
  selected?: boolean;
  onDelete?: () => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * 节点头部组件属性
 */
export interface NodeHeaderProps {
  nodeType: string;
  title: string;
  onTitleChange: (title: string) => void;
}

/**
 * 节点组件属性
 */
export interface CustomNodeProps<T extends BaseNodeData = BaseNodeData> extends NodeProps<FlowNode<T>> {
  // 可以在这里添加额外的属性
}

/**
 * 节点类型注册器
 */
export interface NodeTypeRegistry {
  [key: string]: React.ComponentType<CustomNodeProps<any>>;
}

/**
 * 节点类型配置
 */
export interface NodeTypeConfig {
  id: string;
  name: string;
  component: React.ComponentType<CustomNodeProps<any>>;
  defaultData?: Partial<BaseNodeData>;
}