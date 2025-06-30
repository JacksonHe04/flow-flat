import React, { useState } from 'react';
import { RichTextEditor, MarkdownNode, MarkdownEditor } from '../index';

/**
 * 基础使用示例
 */
export const BasicUsageExample: React.FC = () => {
  const [content, setContent] = useState('');
  const [nodeContent, setNodeContent] = useState('');
  const [editorContent, setEditorContent] = useState('');

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold mb-6">Markdown 组件使用示例</h1>
      
      {/* RichTextEditor 基础示例 */}
      <section>
        <h2 className="text-xl font-semibold mb-4">1. RichTextEditor - 基础富文本编辑器</h2>
        <div className="border rounded-lg p-4">
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="请输入内容..."
            variant="page"
            showToolbar={true}
          />
        </div>
        <details className="mt-2">
          <summary className="cursor-pointer text-sm text-gray-600">查看内容</summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
            {content || '(空内容)'}
          </pre>
        </details>
      </section>

      {/* MarkdownNode 示例 */}
      <section>
        <h2 className="text-xl font-semibold mb-4">2. MarkdownNode - 节点内嵌编辑器</h2>
        <div className="border rounded-lg p-4 bg-gray-50">
          <p className="text-sm text-gray-600 mb-2">适用于 Flow 节点内的轻量级编辑：</p>
          <MarkdownNode
            content={nodeContent}
            onChange={setNodeContent}
            placeholder="点击编辑节点内容..."
            minHeight={60}
            maxHeight={200}
          />
        </div>
        <details className="mt-2">
          <summary className="cursor-pointer text-sm text-gray-600">查看内容</summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
            {nodeContent || '(空内容)'}
          </pre>
        </details>
      </section>

      {/* MarkdownEditor 示例 */}
      <section>
        <h2 className="text-xl font-semibold mb-4">3. MarkdownEditor - 完整页面编辑器</h2>
        <div className="border rounded-lg overflow-hidden">
          <MarkdownEditor
            content={editorContent}
            onChange={setEditorContent}
            onSave={async (content) => {
              console.log('保存内容:', content);
              // 模拟保存延迟
              await new Promise(resolve => setTimeout(resolve, 1000));
            }}
            placeholder="开始创作你的文档..."
            autoSave={true}
            showStatusBar={true}
            localStorageKey="demo-editor-content"
          />
        </div>
        <details className="mt-2">
          <summary className="cursor-pointer text-sm text-gray-600">查看内容</summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
            {editorContent || '(空内容)'}
          </pre>
        </details>
      </section>
    </div>
  );
};

/**
 * 高级配置示例
 */
export const AdvancedUsageExample: React.FC = () => {
  const [content, setContent] = useState('');

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold mb-6">高级配置示例</h1>
      
      {/* 自定义工具栏配置 */}
      <section>
        <h2 className="text-xl font-semibold mb-4">自定义工具栏配置</h2>
        <div className="border rounded-lg">
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="自定义工具栏示例..."
            toolbarConfig={{
              compact: true,
              showTable: false,
              showMedia: true,
              showHistory: false,
            }}
          />
        </div>
      </section>

      {/* 只读模式 */}
      <section>
        <h2 className="text-xl font-semibold mb-4">只读预览模式</h2>
        <div className="border rounded-lg">
          <RichTextEditor
            content="# 这是只读内容\n\n这个编辑器处于**只读模式**，无法编辑。\n\n- 列表项 1\n- 列表项 2\n- 列表项 3"
            editable={false}
            showToolbar={false}
          />
        </div>
      </section>

      {/* 节点模式对比 */}
      <section>
        <h2 className="text-xl font-semibold mb-4">节点模式 vs 页面模式</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">节点模式（简化工具栏）</h3>
            <RichTextEditor
              content={content}
              onChange={setContent}
              variant="node"
              placeholder="节点模式编辑器..."
            />
          </div>
          <div>
            <h3 className="font-medium mb-2">页面模式（完整工具栏）</h3>
            <RichTextEditor
              content={content}
              onChange={setContent}
              variant="page"
              placeholder="页面模式编辑器..."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default BasicUsageExample;