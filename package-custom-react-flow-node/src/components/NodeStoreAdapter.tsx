import React from 'react';
import { type NodeProps, type Node as FlowNode } from '@xyflow/react';
import { CustomNodeProps, BaseNodeData } from '../types';
import Node from './Node';

/**
 * 节点存储适配器组件
 * 将 React Flow 的 NodeProps 转换为 CustomNodeProps，并集成外部的 store 系统
 */
interface NodeStoreAdapterProps<T extends BaseNodeData = BaseNodeData> extends NodeProps<FlowNode<T>> {
  updateNodeData?: (id: string, data: Partial<T>) => void;
}

const NodeStoreAdapter = <T extends BaseNodeData = BaseNodeData>({
  updateNodeData,
  ...props
}: NodeStoreAdapterProps<T>) => {
  const { id, data } = props;

  // 创建数据变更处理函数
  const handleDataChange = React.useCallback(
    (newData: Partial<T>) => {
      if (updateNodeData) {
        updateNodeData(id, newData);
      }
    },
    [id, updateNodeData]
  );

  // 转换为 CustomNodeProps
  const customNodeProps: CustomNodeProps<T> = {
    ...props,
    data: {
      ...data,
      onDataChange: handleDataChange,
    } as T,
  };

  return <Node {...customNodeProps} />;
};

export default NodeStoreAdapter;