import type { Node } from '@/stores/nodeStore';
import type { Edge } from '@xyflow/react';

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
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

/**
 * 导出流程图数据（组合函数）
 * @param nodes 节点数据对象
 * @param edges 连线数据数组
 */
export const exportFlowData = (nodes: Record<string, Node>, edges: Edge[]) => {
  const exportData = exportFlowDataToJSON(nodes, edges);
  downloadJSON(exportData);
};

/**
 * 导出节点数据（向后兼容）
 * @param nodes 节点数据对象
 */
export const exportNodes = (nodes: Record<string, Node>) => {
  const exportData = exportFlowDataToJSON(nodes, []);
  downloadJSON(exportData);
};