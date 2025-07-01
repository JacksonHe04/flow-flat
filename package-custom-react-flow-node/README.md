# Custom React Flow Node

一个可定制的 React Flow 节点组件库，提供了灵活的节点系统和丰富的组件。

## 特性

- 🎨 **可定制节点**: 支持自定义节点类型和样式
- 🔧 **类型安全**: 完整的 TypeScript 支持
- 🎯 **易于使用**: 简单的 API 设计
- 🔌 **可扩展**: 支持注册自定义节点类型
- 📦 **轻量级**: 最小化依赖
- 🎪 **内置组件**: 提供常用的节点组件

## 安装

```bash
npm install custom-react-flow-node
# 或
yarn add custom-react-flow-node
# 或
pnpm add custom-react-flow-node
```

## 依赖要求

- React >= 16.8.0
- React DOM >= 16.8.0
- @xyflow/react >= 12.0.0

## 快速开始

### 基础使用

```tsx
import React from 'react';
import { ReactFlow, Node as FlowNode } from '@xyflow/react';
import { Node, TextNode, BaseNodeData } from 'custom-react-flow-node';

// 定义节点数据类型
interface MyNodeData extends BaseNodeData {
  title: string;
  content: string;
}

// 创建节点
const nodes: FlowNode<MyNodeData>[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 100, y: 100 },
    data: {
      nodeType: 'text',
      title: '我的节点',
      content: '这是节点内容'
    }
  }
];

// 定义节点类型
const nodeTypes = {
  custom: Node
};

function App() {
  return (
    <div style={{ height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
      />
    </div>
  );
}

export default App;
```

### 使用 NodeStoreAdapter

如果您需要与外部状态管理系统集成：

```tsx
import { NodeStoreAdapter } from 'custom-react-flow-node';

// 在您的状态管理中定义更新函数
const updateNodeData = (id: string, data: Partial<MyNodeData>) => {
  // 更新节点数据的逻辑
  console.log('更新节点', id, data);
};

// 使用适配器
const nodeTypes = {
  custom: (props) => (
    <NodeStoreAdapter
      {...props}
      updateNodeData={updateNodeData}
    />
  )
};
```

## API 文档

### 组件

#### Node

通用节点组件，根据节点类型动态渲染对应的节点组件。

```tsx
import { Node } from 'custom-react-flow-node';

<Node {...nodeProps} />
```

#### TextNode

内置的文本节点组件，支持双击编辑。

```tsx
import { TextNode } from 'custom-react-flow-node';

<TextNode {...nodeProps} />
```

#### NodeContainer

节点容器组件，提供统一的节点外观和交互。

**Props:**
- `selected?: boolean` - 是否选中
- `onDelete?: () => void` - 删除回调
- `children: React.ReactNode` - 子组件
- `className?: string` - 自定义样式类

```tsx
import { NodeContainer } from 'custom-react-flow-node';

<NodeContainer selected={true} onDelete={() => console.log('删除')}>
  <div>节点内容</div>
</NodeContainer>
```

#### NodeHeader

节点头部组件，显示节点类型和可编辑标题。

**Props:**
- `nodeType: string` - 节点类型
- `title: string` - 标题
- `onTitleChange: (title: string) => void` - 标题变更回调

```tsx
import { NodeHeader } from 'custom-react-flow-node';

<NodeHeader
  nodeType="text"
  title="我的标题"
  onTitleChange={(title) => console.log('标题变更:', title)}
/>
```

#### NodeStoreAdapter

节点存储适配器，用于集成外部状态管理系统。

**Props:**
- `updateNodeData?: (id: string, data: Partial<T>) => void` - 数据更新回调
- 继承所有 `NodeProps` 属性

### 工具函数

#### registerNodeType

注册新的节点类型。

```tsx
import { registerNodeType } from 'custom-react-flow-node';
import MyCustomNode from './MyCustomNode';

registerNodeType('myCustom', MyCustomNode);
```

#### getRegisteredNodeTypes

获取所有已注册的节点类型。

```tsx
import { getRegisteredNodeTypes } from 'custom-react-flow-node';

const nodeTypes = getRegisteredNodeTypes();
console.log(nodeTypes);
```

#### resetNodeTypes

重置节点类型注册表为默认状态。

```tsx
import { resetNodeTypes } from 'custom-react-flow-node';

resetNodeTypes();
```

### 类型定义

#### BaseNodeData

基础节点数据接口。

```tsx
interface BaseNodeData extends Record<string, unknown> {
  nodeType?: string;
  title?: string;
  content?: string;
  onDelete?: () => void;
}
```

#### CustomNodeProps

自定义节点组件属性接口。

```tsx
interface CustomNodeProps<T extends BaseNodeData = BaseNodeData> extends NodeProps<FlowNode<T>> {
  // 可以在这里添加额外的属性
}
```

## 自定义节点

### 创建自定义节点

```tsx
import React from 'react';
import { CustomNodeProps, BaseNodeData, NodeContainer, NodeHeader } from 'custom-react-flow-node';

interface MyNodeData extends BaseNodeData {
  value: number;
}

const MyCustomNode: React.FC<CustomNodeProps<MyNodeData>> = ({ data, selected }) => {
  const handleValueChange = (newValue: number) => {
    if (data?.onDataChange) {
      data.onDataChange({ value: newValue });
    }
  };

  return (
    <NodeContainer selected={selected} onDelete={data?.onDelete}>
      <NodeHeader
        nodeType="custom"
        title={data?.title || '自定义节点'}
        onTitleChange={(title) => data?.onDataChange?.({ title })}
      />
      <div>
        <input
          type="number"
          value={data?.value || 0}
          onChange={(e) => handleValueChange(Number(e.target.value))}
        />
      </div>
    </NodeContainer>
  );
};

export default MyCustomNode;
```

### 注册自定义节点

```tsx
import { registerNodeType } from 'custom-react-flow-node';
import MyCustomNode from './MyCustomNode';

// 注册节点类型
registerNodeType('myCustom', MyCustomNode);

// 在 React Flow 中使用
const nodes = [
  {
    id: '1',
    type: 'custom',
    position: { x: 100, y: 100 },
    data: {
      nodeType: 'myCustom',
      title: '我的自定义节点',
      value: 42
    }
  }
];
```

## 样式定制

组件使用内联样式，您可以通过 CSS 类名进行样式覆盖：

```css
/* 节点容器样式 */
.custom-node-container {
  /* 自定义样式 */
}

/* 选中状态样式 */
.custom-node-selected {
  /* 自定义样式 */
}

/* 删除按钮样式 */
.custom-node-delete-btn {
  /* 自定义样式 */
}

/* 节点头部样式 */
.custom-node-header {
  /* 自定义样式 */
}

/* 节点标题样式 */
.custom-node-title {
  /* 自定义样式 */
}

/* 文本节点内容样式 */
.custom-text-node-content {
  /* 自定义样式 */
}
```

## 开发

### 构建

```bash
npm run build
```

### 开发模式

```bash
npm run dev
```

## 许可证

MIT

## 作者

Jackson He
[https://github.com/JacksonHe04](https://github.com/JacksonHe04)

## 贡献

欢迎提交 Issue 和 Pull Request！