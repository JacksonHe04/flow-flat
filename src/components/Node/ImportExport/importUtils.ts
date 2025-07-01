import type { Node } from '@/stores/nodeStore';
import type { Edge } from '@xyflow/react';
import type { ExportData } from './exportUtils';

/**
 * 验证导入数据格式
 * @param data 待验证的数据
 * @returns 是否为有效格式
 */
export const validateImportData = (data: unknown): data is ExportData => {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  const dataObj = data as Record<string, unknown>;
  
  // 检查必要字段
  if (!dataObj.version || !dataObj.nodes || !Array.isArray(dataObj.nodes)) {
    return false;
  }
  
  // edges字段是可选的，但如果存在必须是数组
  if (dataObj.edges && !Array.isArray(dataObj.edges)) {
    return false;
  }
  
  // 验证节点数据结构
  return dataObj.nodes.every((node: unknown) => {
    const nodeObj = node as Record<string, unknown>;
    return (
      nodeObj &&
      typeof nodeObj.id === 'string' &&
      typeof nodeObj.type === 'string' &&
      nodeObj.position &&
      typeof (nodeObj.position as Record<string, unknown>).x === 'number' &&
      typeof (nodeObj.position as Record<string, unknown>).y === 'number' &&
      nodeObj.size &&
      typeof (nodeObj.size as Record<string, unknown>).width === 'number' &&
      typeof (nodeObj.size as Record<string, unknown>).height === 'number' &&
      nodeObj.data &&
      typeof nodeObj.data === 'object'
    );
  });
};

/**
 * 处理节点ID冲突
 * @param nodes 导入的节点数组
 * @param existingNodes 现有节点对象
 * @returns 处理后的节点数组
 */
export const resolveNodeIdConflicts = (
  nodes: Node[],
  existingNodes: Record<string, Node>
): Node[] => {
  const existingIds = new Set(Object.keys(existingNodes));
  
  return nodes.map(node => {
    if (existingIds.has(node.id)) {
      // 生成新的唯一ID
      const newId = `${node.id}-imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      return {
        ...node,
        id: newId
      };
    }
    return node;
  });
};

/**
 * 导入结果接口
 */
export interface ImportResult {
  nodes: Node[];
  edges: Edge[];
}

/**
 * 从JSON文件导入流程图数据
 * @param file 上传的文件
 * @returns Promise<ImportResult> 解析后的节点和连线数据
 */
export const importFlowDataFromJSON = (file: File): Promise<ImportResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const jsonString = event.target?.result as string;
        const data = JSON.parse(jsonString);
        
        if (!validateImportData(data)) {
          reject(new Error('无效的文件格式'));
          return;
        }
        
        resolve({
          nodes: data.nodes,
          edges: data.edges || []
        });
      } catch {
        reject(new Error('文件解析失败'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * 从JSON文件导入节点数据（向后兼容）
 * @param file 上传的文件
 * @returns Promise<Node[]> 解析后的节点数组
 */
export const importNodesFromJSON = (file: File): Promise<Node[]> => {
  return importFlowDataFromJSON(file).then(result => result.nodes);
};

/**
 * 导入流程图数据（组合函数）
 * @param file 上传的文件
 * @returns Promise<ImportResult> 解析后的节点和连线数据
 */
export const importFlowData = importFlowDataFromJSON;

/**
 * 导入节点数据（向后兼容）
 * @param file 上传的文件
 * @returns Promise<Node[]> 解析后的节点数组
 */
export const importNodes = importNodesFromJSON;