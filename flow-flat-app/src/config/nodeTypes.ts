/**
 * 节点类型配置
 */
export interface NodeTypeConfig {
  id: string;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  defaultSize?: {
    width: number;
    height: number;
  };
}

/**
 * 可用的节点类型列表
 */
export const nodeTypes: NodeTypeConfig[] = [
  {
    id: 'text',
    name: '文本节点',
    description: '用于编辑和显示文本内容',
    icon: '📝',
    color: '#3b82f6',
    defaultSize: { width: 200, height: 150 }
  },
  {
    id: 'code',
    name: '代码节点',
    description: '用于编辑和显示代码片段',
    icon: '💻',
    color: '#10b981',
    defaultSize: { width: 300, height: 200 }
  },
  {
    id: 'image',
    name: '图片节点',
    description: '用于显示图片内容',
    icon: '🖼️',
    color: '#f59e0b',
    defaultSize: { width: 250, height: 200 }
  },
  {
    id: 'markdown',
    name: 'Markdown节点',
    description: '用于编辑和预览Markdown内容',
    icon: '📄',
    color: '#8b5cf6',
    defaultSize: { width: 300, height: 250 }
  },
  {
    id: 'todo',
    name: '待办节点',
    description: '用于管理待办事项列表',
    icon: '✅',
    color: '#ef4444',
    defaultSize: { width: 250, height: 180 }
  }
];

/**
 * 根据ID获取节点类型配置
 */
export const getNodeTypeById = (id: string): NodeTypeConfig | undefined => {
  return nodeTypes.find(type => type.id === id);
};

/**
 * 获取默认节点类型
 */
export const getDefaultNodeType = (): NodeTypeConfig => {
  return nodeTypes[0]; // 默认返回文本节点
};