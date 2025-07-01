import React from 'react';
import { type NodeProps, type Node as FlowNode } from '@xyflow/react';
import {
  Node,
  // NodeContainer,
  // NodeHeader,
  // TextNode,
  // registerNodeType,
  type CustomNodeProps,
  type BaseNodeData
} from 'custom-react-flow-node';

interface TestNodeData extends BaseNodeData {
  title?: string;
  content?: string;
  onDelete?: () => void;
  onDataChange?: (data: Partial<TestNodeData>) => void;
}

/**
 * 测试节点组件，使用本地包的组件
 */
const TestNode: React.FC<NodeProps<FlowNode<TestNodeData>>> = (props) => {
  const { data } = props;
  
  // 将 React Flow 的 NodeProps 转换为 CustomNodeProps
  const customNodeProps: CustomNodeProps<TestNodeData> = {
    ...props,
    data: {
      ...data,
      onDataChange: (newData: Partial<TestNodeData>) => {
        // 这里可以添加数据变更的处理逻辑
        console.log('Data changed:', newData);
      }
    }
  };
  
  // 使用本地包的 Node 组件
  return <Node {...customNodeProps} />;
};

export default TestNode;