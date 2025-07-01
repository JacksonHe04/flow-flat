import React from 'react';
import { exportFlowData } from './exportUtils';
import { importFlowData, type ImportResult } from './importUtils';
import { useNodeStore, type Node } from '../../../stores/nodeStore';
import type { Edge } from '@xyflow/react';

/**
 * 导入导出按钮组件属性接口
 */
interface ImportExportButtonsProps {
  edges?: Edge[];
  onEdgesChange?: (edges: Edge[]) => void;
}

/**
 * 导入导出按钮组件
 */
export const ImportExportButtons: React.FC<ImportExportButtonsProps> = ({ 
  edges = [], 
  onEdgesChange 
}) => {
  const { nodes, addNode } = useNodeStore();

  /**
   * 处理导出
   */
  const handleExport = () => {
    try {
      exportFlowData(nodes, edges);
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请重试');
    }
  };

  /**
   * 处理导入
   */
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const importResult: ImportResult = await importFlowData(file);
        
        // 添加导入的节点到store
        importResult.nodes.forEach((node: Node) => {
          addNode(node);
        });
        
        // 添加导入的连线
        if (onEdgesChange && importResult.edges.length > 0) {
          onEdgesChange(importResult.edges);
        }
        
        alert(`成功导入 ${importResult.nodes.length} 个节点和 ${importResult.edges.length} 条连线`);
      } catch (error) {
        console.error('导入失败:', error);
        alert(`导入失败: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    };
    input.click();
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExport}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        title="导出节点数据"
      >
        导出
      </button>
      <button
        onClick={handleImport}
        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        title="导入节点数据"
      >
        导入
      </button>
    </div>
  );
};