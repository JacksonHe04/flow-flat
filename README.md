# Flow Flat 🚀

> 一个集成了自研 React Flow 节点组件库的综合开发平台

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

## 📖 项目概述

Flow Flat 是一个现代化的可视化开发平台，集成了**节点流程图**、**富文本编辑器**、**代码编辑器**三大核心功能模块，提供了完整的节点流程图解决方案。项目采用 monorepo 架构，包含自研的 React Flow 节点组件库和基于该组件库的 Web 应用平台。其核心亮点是自研的 `custom-react-flow-node` 组件库，为 React Flow 提供了更加灵活和强大的节点系统。

### 🎯 核心特性

- 🎨 **自研节点组件库**：完全自主开发的 React Flow 节点系统，即 `custom-react-flow-node` 包。
- 🔧 **完整 TypeScript 支持**：类型安全的开发体验。
- 🔌 **高度可扩展**：支持自定义节点类型注册。
- 📦 **轻量级设计**：最小化依赖，高性能表现。
- 🎯 **多功能集成**：节点流程图 + 富文本编辑 + 代码编辑。
- 🎪 **丰富的内置组件**：TextNode、CodeNode、ImageNode 等多种节点类型，以及各类编辑器组件。
- 🌙 **主题系统**：统一的亮色/暗色主题支持。

## 🏗️ 项目架构

本仓库采用 **Monorepo** 架构，包含以下几个主要部分：

```
flow-flat/
├── 📦 package-custom-react-flow-node/    # 自研 React Flow 节点组件库
│   ├── src/
│   │   ├── components/                   # 核心组件
│   │   │   ├── Node.tsx                  # 通用节点组件
│   │   │   ├── NodeContainer.tsx         # 节点容器
│   │   │   ├── NodeHeader.tsx            # 节点头部
│   │   │   ├── NodeStoreAdapter.tsx      # 状态适配器
│   │   │   └── TextNode.tsx              # 文本节点
│   │   └── types/                        # 类型定义
│   └── dist/                             # 构建输出
├── 🌐 flow-flat-app/                     # Web 应用平台
│   ├── src/
│   │   ├── components/
│   │   │   ├── Node/                      # 节点系统
│   │   │   │   ├── NodeLayout/            # 原项目节点布局
│   │   │   │   ├── Nodes/                 # 内置节点类型
│   │   │   │   ├── ImportExport/          # 导入导出功能
│   │   │   │   └── custom-react-flow-node-test-demo/  # 本地包集成演示
│   │   │   ├── Markdown/                  # 富文本编辑器模块
│   │   │   └── CodeEditor/                # 代码编辑器模块
│   │   ├── pages/                         # 页面组件
│   │   ├── stores/                        # Zustand 状态管理
│   │   └── utils/                         # 工具函数
│   └── ...
└── docs/                                  # 项目文档
```

## 📦 核心组件库：custom-react-flow-node

### ✨ 特性

- 🎨 **可定制节点**：支持自定义节点类型和样式。
- 🔧 **类型安全**：完整的 TypeScript 支持。
- 🎯 **易于使用**：简单的 API 设计。
- 🔌 **可扩展**：支持注册自定义节点类型。
- 📦 **轻量级**：最小化依赖。
- 🎪 **内置组件**：提供常用的节点组件。

### 🚀 快速开始

```bash
# 安装依赖
npm install custom-react-flow-node
# 或
pnpm add custom-react-flow-node
```

### 📝 基础使用

```tsx
import React from 'react';
import { ReactFlow, Node as FlowNode } from '@xyflow/react';
import { Node, BaseNodeData } from 'custom-react-flow-node';

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
```

### 🔧 自定义节点

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

// 注册节点类型
import { registerNodeType } from 'custom-react-flow-node';
registerNodeType('myCustom', MyCustomNode);
```

## 🌐 Web 应用平台：flow-flat-app

### 🎯 功能模块

#### 1. 📊 节点流程图系统

基于自研 `custom-react-flow-node` 包实现的可视化节点编辑器：

- **核心组件展示**：NodeLayout、内置节点类型、导入导出功能。
- **本地包集成演示**：完整的集成方案和示例。
- **集成方案特点**：向后兼容、渐进式迁移、扩展能力、状态同步。
- **原生节点支持**：TextNode、CodeNode、ImageNode、MarkdownNode、TodoNode。
- **自定义节点演示**：CustomCodeNode、CustomImageNode。
- **导入导出**：支持流程图的保存和加载。

#### 2. 📝 富文本编辑器模块

基于 TipTap 的完整富文本编辑解决方案：

- **核心组件**：RichText、MarkdownNodeEditor。
- **工具栏系统**：完整的格式化工具栏。
- **扩展配置**：基础扩展、节点扩展、页面扩展。
- **功能特性**：Markdown 支持、所见即所得、自动保存、主题支持。
- 📝 **完整 Markdown 语法支持**。
- 🎨 **所见即所得编辑体验**。
- 💾 **自动保存功能**。
- 🎯 **节点内嵌和页面级两种场景**。
- 🌙 **亮色/暗色主题支持**。

#### 3. 💻 代码编辑器模块

基于 Monaco Editor 的专业代码编辑功能：

- **核心组件**：MonacoEditor、LanguageSelector。
- **功能特性**：语法高亮、智能提示、错误检测、主题支持。
- **支持语言**：26+ 种编程语言。
- 🔤 **支持 26+ 种编程语言语法高亮**。
- 🧠 **智能代码补全和建议**。
- 🔍 **实时语法和语义检查**。
- 🎨 **主题支持**。
- ⚙️ **高度可配置**。
- 📱 **响应式设计**。

### 🛠️ 技术栈

- **框架**：React + TypeScript
- **构建工具**：Vite + Rollup
- **状态管理**：Zustand
- **节点流程图**：React Flow + custom-react-flow-node
- **富文本编辑**：TipTap
- **代码编辑器**：Monaco Editor
- **样式**：Tailwind CSS
- **包管理**：pnpm

## 🚀 快速开始

### 📋 环境要求

- Node.js >= 16.0.0
- pnpm >= 7.0.0
- React >= 16.8.0
- @xyflow/react >= 12.0.0

### 🔧 安装和运行

```bash
# 克隆仓库
git clone https://github.com/JacksonHe04/flow-flat.git
cd flow-flat

# 安装依赖
pnpm install

# 构建组件库
cd package-custom-react-flow-node
pnpm run build

# 启动开发服务器
cd ../flow-flat-app
pnpm run dev
```

### 🌐 访问应用

开发服务器启动后，访问 [http://localhost:5173](http://localhost:5173) 即可体验完整功能。

## 📚 使用场景

### 🔬 节点流程图开发
- **独立开发测试**：使用 `DemoBoard` 独立测试新节点类型。
- **集成验证**：使用 `TestBoard` 验证与原项目的兼容性。
- **生产替换**：使用 `NodeLayoutReplacement` 直接替换原项目的 NodeLayout。
- **扩展开发**：参考自定义节点示例开发新的节点类型。

### 📝 富文本编辑
- **流程图节点内容编辑**：轻量级的节点内嵌编辑器。
- **文档页面编辑**：完整的页面级编辑器。
- **自定义编辑器**：根据需要进行配置的编辑器。

### 💻 代码编辑
- **代码节点编辑**：在流程图节点中编辑代码。
- **独立代码编辑**：专业的代码编辑页面。
- **多语言支持**：支持主流编程语言的语法高亮。

## 🎨 技术亮点

1. **🔧 自研组件包**：完全自主开发的 React Flow 节点组件库。
2. **🔄 适配器模式**：通过 `NodeStoreAdapter` 实现与现有系统的无缝集成。
3. **📈 渐进式迁移**：支持从原有系统平滑迁移到新的节点系统。
4. **🎯 多场景支持**：同时支持节点内嵌和页面级的编辑场景。
5. **🛡️ 完整的类型支持**：全面的 TypeScript 类型定义。
6. **⚙️ 高度可配置**：丰富的配置选项满足不同需求。

## 📖 文档

- [组件库文档](./package-custom-react-flow-node/README.md) - custom-react-flow-node 详细文档
- [Web应用文档](./flow-flat-app/README.md) - flow-flat-app 详细文档
- [开发文档](./docs/)

## 🤝 贡献

我们欢迎所有形式的贡献！请查看我们的贡献指南：

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 👨‍💻 作者

**Jackson He**
- GitHub: [@JacksonHe04](https://github.com/JacksonHe04)
- 项目链接: [https://github.com/JacksonHe04/flow-flat](https://github.com/JacksonHe04/flow-flat)

## 🙏 致谢

感谢以下开源项目的支持：

- [React Flow](https://reactflow.dev/) - 强大的流程图库
- [TipTap](https://tiptap.dev/) - 现代富文本编辑器
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - VS Code 编辑器核心
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Zustand](https://github.com/pmndrs/zustand) - 轻量级状态管理