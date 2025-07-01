# Flow Flat Components

一个基于 React Flow 的可视化白板组件库，提供丰富的节点类型和编辑功能。

## 特性

- 🎨 **多种节点类型**: 文本、代码、Markdown、图片、待办事项
- 🔧 **可定制**: 支持自定义节点类型和样式
- 📝 **富文本编辑**: 集成 Monaco Editor 和 TipTap 编辑器
- 🌙 **深色模式**: 内置深色主题支持
- 📱 **响应式**: 适配移动端和桌面端
- ⚡ **高性能**: 基于 React Flow 的高性能渲染
- 🎯 **TypeScript**: 完整的 TypeScript 类型支持

## 安装

```bash
npm install flow-flat-components
# 或
yarn add flow-flat-components
# 或
pnpm add flow-flat-components
```

### 对等依赖

确保你的项目中已安装以下依赖：

```bash
npm install react react-dom @xyflow/react @monaco-editor/react @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-typography
```

## 快速开始

### 基础用法

```tsx
import React, { useState } from 'react';
import { Board, type FlowFlatNode } from 'flow-flat-components';
import 'flow-flat-components/dist/style.css';

function App() {
  const [nodes, setNodes] = useState<FlowFlatNode[]>([]);
  const [edges, setEdges] = useState([]);

  const handleNodeAdd = (node: FlowFlatNode) => {
    setNodes(prev => [...prev, node]);
  };

  const handleNodeDelete = (nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
  };

  const handleNodeDataChange = (nodeId: string, newData: any) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { ...node, data: { ...node.data, ...newData } }
        : node
    ));
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Board
        nodes={nodes}
        edges={edges}
        onNodeAdd={handleNodeAdd}
        onNodeDelete={handleNodeDelete}
        onNodeDataChange={handleNodeDataChange}
        onNodesChange={(changes) => {
          // 处理节点位置变化等
        }}
        onEdgesChange={(changes) => {
          // 处理边的变化
        }}
      />
    </div>
  );
}

export default App;
```

### 使用单独的组件

```tsx
import React from 'react';
import { TextNode, CodeNode, MarkdownNode } from 'flow-flat-components';

// 使用文本节点
<TextNode
  id="text-1"
  data={{
    title: "文本节点",
    content: "这是一个文本节点",
    onDataChange: (id, data) => console.log('数据变化:', id, data),
    onDelete: () => console.log('删除节点')
  }}
  selected={false}
/>

// 使用代码节点
<CodeNode
  id="code-1"
  data={{
    title: "代码节点",
    code: "console.log('Hello World');",
    language: "javascript",
    onDataChange: (id, data) => console.log('数据变化:', id, data)
  }}
  selected={false}
/>
```

## 组件 API

### Board 组件

主要的白板组件，提供完整的可视化编辑功能。

#### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `nodes` | `FlowFlatNode[]` | `[]` | 节点数组 |
| `edges` | `Edge[]` | `[]` | 边数组 |
| `onNodeAdd` | `(node: FlowFlatNode) => void` | - | 添加节点回调 |
| `onNodeDelete` | `(nodeId: string) => void` | - | 删除节点回调 |
| `onNodeDataChange` | `(nodeId: string, data: any) => void` | - | 节点数据变化回调 |
| `onNodesChange` | `(changes: any[]) => void` | - | 节点变化回调 |
| `onEdgesChange` | `(changes: any[]) => void` | - | 边变化回调 |
| `className` | `string` | `''` | 自定义样式类名 |

### 节点组件

#### TextNode - 文本节点

```tsx
interface TextNodeData {
  title?: string;
  content?: string;
  onDataChange?: (nodeId: string, data: any) => void;
  onDelete?: () => void;
}
```

#### CodeNode - 代码节点

```tsx
interface CodeNodeData {
  title?: string;
  code?: string;
  language?: string;
  isCompact?: boolean;
  onDataChange?: (nodeId: string, data: any) => void;
  onDelete?: () => void;
}
```

#### MarkdownNode - Markdown节点

```tsx
interface MarkdownNodeData {
  title?: string;
  content?: string;
  onDataChange?: (nodeId: string, data: any) => void;
  onDelete?: () => void;
}
```

#### ImageNode - 图片节点

```tsx
interface ImageNodeData {
  title?: string;
  imageUrl?: string;
  alt?: string;
  description?: string;
  onDataChange?: (nodeId: string, data: any) => void;
  onDelete?: () => void;
}
```

#### TodoNode - 待办事项节点

```tsx
interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoNodeData {
  title?: string;
  todos?: TodoItem[];
  onDataChange?: (nodeId: string, data: any) => void;
  onDelete?: () => void;
}
```

### 工具栏组件

```tsx
interface ToolbarProps {
  onAddNode?: (node: FlowFlatNode) => void;
  onDeleteSelected?: () => void;
  className?: string;
}
```

## 类型定义

### FlowFlatNode

```tsx
interface FlowFlatNode {
  id: string;
  type: 'text' | 'code' | 'markdown' | 'image' | 'todo';
  position: { x: number; y: number };
  size?: { width: number; height: number };
  data: BaseNodeData;
}
```

### NodeTypeConfig

```tsx
interface NodeTypeConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  defaultSize: { width: number; height: number };
}
```

## 样式定制

### CSS 变量

你可以通过覆盖 CSS 变量来定制主题：

```css
:root {
  --flow-flat-primary: #3b82f6;
  --flow-flat-primary-hover: #2563eb;
  --flow-flat-success: #10b981;
  --flow-flat-error: #ef4444;
  
  --flow-flat-bg-light: #ffffff;
  --flow-flat-bg-dark: #1e293b;
  --flow-flat-border-light: #e2e8f0;
  --flow-flat-border-dark: #475569;
  
  --flow-flat-text-light: #334155;
  --flow-flat-text-dark: #f1f5f9;
}
```

### 深色模式

组件库内置深色模式支持，只需在父容器添加 `dark` 类名：

```tsx
<div className="dark">
  <Board {...props} />
</div>
```

## 高级用法

### 自定义节点类型

```tsx
import { nodeComponents } from 'flow-flat-components';

// 扩展节点类型
const customNodeTypes = {
  ...nodeComponents,
  custom: MyCustomNode,
};

// 在 ReactFlow 中使用
<ReactFlow nodeTypes={customNodeTypes} />
```

### 数据持久化

```tsx
const saveData = () => {
  const data = {
    nodes,
    edges,
    viewport: reactFlowInstance.getViewport(),
  };
  localStorage.setItem('flow-data', JSON.stringify(data));
};

const loadData = () => {
  const data = JSON.parse(localStorage.getItem('flow-data') || '{}');
  if (data.nodes) setNodes(data.nodes);
  if (data.edges) setEdges(data.edges);
  if (data.viewport) reactFlowInstance.setViewport(data.viewport);
};
```

## 开发

```bash
# 克隆仓库
git clone <repository-url>
cd flow-flat/package

# 安装依赖
pnpm install

# 构建
pnpm build

# 开发模式
pnpm dev
```

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！