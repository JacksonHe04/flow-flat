import { type NodeTypeConfig } from '../types';

export type { NodeTypeConfig };

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
    description: '用于管理待办事项',
    icon: '✅',
    color: '#ef4444',
    defaultSize: { width: 250, height: 200 }
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
  return nodeTypes[0];
};

/**
 * 获取节点类型的默认数据
 */
export const getDefaultNodeData = (type: string) => {
  const baseData = {
    title: '',
    onDataChange: () => {},
    onDelete: () => {},
  };

  switch (type) {
    case 'text':
      return {
        ...baseData,
        title: '文本节点',
        content: '',
      };
    case 'code':
      return {
        ...baseData,
        title: '代码节点',
        code: '',
        language: 'javascript',
        isCompact: false,
      };
    case 'markdown':
      return {
        ...baseData,
        title: 'Markdown节点',
        content: '',
      };
    case 'image':
      return {
        ...baseData,
        title: '图片节点',
        imageUrl: '',
        alt: '',
        description: '',
      };
    case 'todo':
      return {
        ...baseData,
        title: '待办事项',
        todos: [],
      };
    default:
      return baseData;
  }
};

/**
 * 创建新节点的默认数据
 */
export const createDefaultNodeData = (nodeType: string, position: { x: number; y: number }) => {
  const typeConfig = getNodeTypeById(nodeType) || getDefaultNodeType();
  
  return {
    id: `${nodeType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'customNode' as const,
    position,
    size: typeConfig.defaultSize || { width: 200, height: 150 },
    data: {
      nodeType,
      title: typeConfig.name,
      content: ''
    }
  };
};