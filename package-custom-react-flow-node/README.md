# Custom React Flow Node

一个可定制的 React Flow 节点组件库，提供基础的节点容器、头部和文本节点组件，支持自定义节点类型。

## 安装

```bash
npm install custom-react-flow-node
# 或
yarn add custom-react-flow-node
# 或
pnpm add custom-react-flow-node
```

## 依赖

确保你的项目已安装以下依赖：

```bash
npm install react react-dom @xyflow/react
```

## 基础使用

### 1. 使用内置的文本节点

```tsx
import React from 'react';
import { ReactFlow, Node } from '@xyflow/react';
import { Node as CustomNode } from 'custom-react-flow-node';

const nodeTypes = {
  customNode: CustomNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'customNode',
    position: { x: 100, y: 100 },
    data: {
      nodeType: 'text',
      title: '我的文本节点',
      content: '这是节点内容',
      onDataChange: (newData) => {
        console.log('数据更新:', newData);
      },
      onDelete: () => {
        console.log('删除节点');
      }
    }
  }
];

function App() {
  return (
    <ReactFlow
      nodes={initialNodes}
      nodeTypes={nodeTypes}
    />
  );
}
```

### 2. 创建自定义节点类型

```tsx
import React from 'react';
import { 
  NodeContainer, 
  NodeHeader, 
  CustomNodeProps, 
  BaseNodeData,
  registerNodeType 
} from 'custom-react-flow-node';

interface CodeNodeData extends BaseNodeData {
  language?: string;
  code?: string;
}

const CodeNode: React.FC<CustomNodeProps<CodeNodeData>> = ({ data, selected }) => {
  return (
    <NodeContainer selected={selected} onDelete={data?.onDelete}>
      <NodeHeader
        nodeType="code"
        title={data?.title || '代码节点'}
        onTitleChange={(title) => {
          data?.onDataChange?.({ title });
        }}
      />
      <div style={{ fontFamily: 'monospace', padding: '8px' }}>
        <div>语言: {data?.language || 'javascript'}</div>
        <pre>{data?.code || '// 在这里编写代码'}</pre>
      </div>
    </NodeContainer>
  );
};

// 注册自定义节点类型
registerNodeType('code', CodeNode);
```

### 3. 使用注册的节点类型

```tsx
const nodes: Node[] = [
  {
    id: '1',
    type: 'customNode',
    position: { x: 100, y: 100 },
    data: {
      nodeType: 'code', // 使用注册的代码节点
      title: '我的代码节点',
      language: 'typescript',
      code: 'console.log("Hello World!");'
    }
  }
];
```

## API 参考

### 组件

#### `Node`
主要的节点组件，根据 `data.nodeType` 动态渲染对应的节点类型。

#### `NodeContainer`
节点容器组件，提供基础的样式、连接点和删除按钮。

**Props:**
- `selected?: boolean` - 节点是否被选中
- `onDelete?: () => void` - 删除回调函数
- `children: React.ReactNode` - 子组件
- `className?: string` - 额外的CSS类名

#### `NodeHeader`
节点头部组件，显示节点类型和可编辑的标题。

**Props:**
- `nodeType: string` - 节点类型
- `title: string` - 节点标题
- `onTitleChange: (title: string) => void` - 标题变更回调

#### `TextNode`
内置的文本节点组件。

### 工具函数

#### `registerNodeType(nodeType: string, component: React.ComponentType)`
注册新的节点类型。

#### `getRegisteredNodeTypes(): NodeTypeRegistry`
获取所有已注册的节点类型。

#### `resetNodeTypes()`
重置节点类型注册表为默认状态。

### 类型定义

#### `BaseNodeData`
```tsx
interface BaseNodeData extends Record<string, unknown> {
  nodeType?: string;
  title?: string;
  content?: string;
  onDelete?: () => void;
  onDataChange?: (data: Partial<BaseNodeData>) => void;
}
```

#### `CustomNodeProps<T>`
```tsx
interface CustomNodeProps<T extends BaseNodeData = BaseNodeData> extends NodeProps<FlowNode<T>> {
  // 扩展属性
}
```

## 样式定制

组件使用内联样式，你可以通过 CSS 类名进行样式覆盖：

```css
.custom-node-container {
  /* 自定义节点容器样式 */
}

.custom-node-header {
  /* 自定义节点头部样式 */
}

.custom-text-node-content {
  /* 自定义文本节点内容样式 */
}
```

## 许可证

MIT