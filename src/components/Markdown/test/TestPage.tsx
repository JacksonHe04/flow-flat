import React from 'react';
import { BasicUsageExample, AdvancedUsageExample } from '../examples/BasicUsage';

/**
 * 测试页面组件
 * 用于验证 Markdown 组件的功能
 */
const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Markdown 组件测试页面
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            这个页面用于测试和演示 Markdown 富文本编辑器组件的各种功能。
          </p>
        </div>
        
        {/* 基础使用示例 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-8">
          <BasicUsageExample />
        </div>
        
        {/* 高级配置示例 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <AdvancedUsageExample />
        </div>
      </div>
    </div>
  );
};

export default TestPage;