import type { Edge } from '@xyflow/react';
import type { Node } from '@/stores/nodeStore';

/**
 * 导出数据接口
 */
export interface ExportData {
  version: string;
  timestamp: string;
  nodes: Node[];
  edges: Edge[];
  metadata: {
    nodeCount: number;
    edgeCount: number;
    exportedBy: string;
  };
}

/**
 * 导出节点和连线数据为JSON格式
 * @param nodes 节点数据对象
 * @param edges 连线数据数组
 * @returns 格式化的导出数据
 */
export const exportFlowDataToJSON = (nodes: Record<string, Node>, edges: Edge[]): ExportData => {
  const nodeArray = Object.values(nodes);
  
  const exportData: ExportData = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    nodes: nodeArray,
    edges: edges,
    metadata: {
      nodeCount: nodeArray.length,
      edgeCount: edges.length,
      exportedBy: 'Flow-Flat'
    }
  };
  
  return exportData;
};

/**
 * 下载JSON文件
 * @param data 要下载的数据
 * @param filename 文件名
 */
export const downloadJSON = (data: ExportData, filename: string = 'flow-nodes') => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

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
export const resolveNodeIdConflicts = (nodes: Node[], existingNodes: Record<string, Node>): Node[] => {
  const existingIds = new Set(Object.keys(existingNodes));
  
  return nodes.map(node => {
    if (existingIds.has(node.id)) {
      // 生成新的唯一ID
      let newId = `${node.id}_imported_${Date.now()}`;
      let counter = 1;
      
      while (existingIds.has(newId)) {
        newId = `${node.id}_imported_${Date.now()}_${counter}`;
        counter++;
      }
      
      existingIds.add(newId);
      return { ...node, id: newId };
    }
    
    existingIds.add(node.id);
    return node;
  });
};

/**
 * 导入流程图数据
 * @param file 导入的文件
 * @param existingNodes 现有节点数据
 * @returns Promise<{nodes: Node[], edges: Edge[]}>
 */
export const importFlowData = async (
  file: File, 
  existingNodes: Record<string, Node>
): Promise<{ nodes: Node[], edges: Edge[] }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        if (!validateImportData(data)) {
          reject(new Error('无效的文件格式'));
          return;
        }
        
        // 处理节点ID冲突
        const processedNodes = resolveNodeIdConflicts(data.nodes, existingNodes);
        
        resolve({
          nodes: processedNodes,
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