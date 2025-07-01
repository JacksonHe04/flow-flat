import React from 'react';
import { type NodeProps, type Node as FlowNode } from '@xyflow/react';
import {
  Node,
  getRegisteredNodeTypes,
  type CustomNodeProps,
  type BaseNodeData
} from 'custom-react-flow-node';

// 导入自定义节点类型（这会自动注册它们）
import './CustomCodeNode';
import './CustomImageNode';

interface DemoNodeData extends BaseNodeData {
  title?: string;
  content?: string;
  onDelete?: () => void;
  onDataChange?: (data: Partial<DemoNodeData>) => void;
}

/**
 * 演示节点组件
 * 使用本地包的 Node 组件，支持所有注册的节点类型
 */
const DemoNode: React.FC<NodeProps<FlowNode<DemoNodeData>>> = (props) => {
  const { data } = props;
  
  // 将 React Flow 的 NodeProps 转换为 CustomNodeProps
  const customNodeProps: CustomNodeProps<DemoNodeData> = {
    ...props,
    data: {
      ...data,
      onDataChange: (newData: Partial<DemoNodeData>) => {
        // 这里可以添加数据变更的处理逻辑
        console.log('Demo Node Data changed:', newData);
        // 可以在这里调用 updateNodeData 或其他状态管理逻辑
      }
    }
  };
  
  // 使用本地包的 Node 组件，它会根据 nodeType 自动选择合适的组件
  return <Node {...customNodeProps} />;
};

/**
 * 获取所有可用的节点类型
 */
export const getAvailableNodeTypes = () => {
  return getRegisteredNodeTypes();
};

/**
 * 创建新节点的辅助函数
 */
export const createDemoNode = (nodeType: string, position: { x: number; y: number }) => {
  const nodeTypeMap: Record<string, { name: string; description: string }> = {
    text: { name: '文本节点', description: '双击编辑文本内容' },
    'custom-code': { name: '代码节点', description: '// 在这里编写代码\nconsole.log("Hello World!");' },
    'custom-image': { name: '图片节点', description: '双击添加图片' }
  };
  
  const config = nodeTypeMap[nodeType] || { name: '未知节点', description: '' };
  
  return {
    id: `demo-node-${Date.now()}`,
    type: 'demoNode' as const,
    position,
    size: { width: 250, height: 180 },
    data: {
      nodeType,
      title: config.name,
      content: config.description
    }
  };
};

export default DemoNode;