# Flow Flat 节点流程图平台

## 项目概述

Flow Flat 是一个集成了节点流程图、富文本编辑器、代码编辑器三大核心功能模块的综合开发平台。本项目不仅是对自研 `custom-react-flow-node` 包的完整使用展示，同时提供了独立的富文本编辑和代码编辑功能模块，为用户提供一站式的创作和开发体验。

## 核心架构

### 自研组件包集成

本项目的核心节点系统基于仓库内的 [package-custom-react-flow-node](https://github.com/JacksonHe04/flow-flat/tree/main/package-custom-react-flow-node) 包构建，该包提供了：

- 🎨 **可定制节点系统**: 支持自定义节点类型和样式
- 🔧 **完整 TypeScript 支持**: 类型安全的开发体验
- 🔌 **可扩展架构**: 支持注册自定义节点类型
- 📦 **轻量级设计**: 最小化依赖，高性能表现
- 🎪 **内置组件**: 提供 TextNode、NodeContainer、NodeHeader 等常用组件

### 技术栈
- **框架**: React + TypeScript
- **构建工具**: Vite
- **状态管理**: Zustand
- **节点流程图**: React Flow + custom-react-flow-node
- **富文本编辑**: TipTap
- **代码编辑器**: Monaco Editor
- **样式**: Tailwind CSS

## 功能模块

### 1. 节点流程图系统

基于 [custom-react-flow-node](https://github.com/JacksonHe04/flow-flat/tree/main/package-custom-react-flow-node) 包实现的可视化节点编辑器，位于 [Node](https://github.com/JacksonHe04/flow-flat/tree/main/flow-flat-app/src/components/Node) 目录：

#### 核心组件展示
- **NodeLayout**: 原项目的节点布局系统
- **Nodes**: 内置节点类型（TextNode、CodeNode、ImageNode、MarkdownNode、TodoNode）
- **ImportExport**: 流程图导入导出功能

#### 本地包集成演示
[custom-react-flow-node-test-demo](https://github.com/JacksonHe04/flow-flat/tree/main/flow-flat-app/src/components/Node/custom-react-flow-node-test-demo) 目录提供了完整的集成方案：

- **[TestNode.tsx](https://github.com/JacksonHe04/flow-flat/blob/main/flow-flat-app/src/components/Node/custom-react-flow-node-test-demo/TestNode.tsx)**: 基础测试节点，验证本地包基本功能
- **[DemoNode.tsx](https://github.com/JacksonHe04/flow-flat/blob/main/flow-flat-app/src/components/Node/custom-react-flow-node-test-demo/DemoNode.tsx)**: 演示节点，支持多种节点类型的动态渲染
- **[NodeLayoutReplacement.tsx](https://github.com/JacksonHe04/flow-flat/blob/main/flow-flat-app/src/components/Node/custom-react-flow-node-test-demo/NodeLayoutReplacement.tsx)**: 核心替代组件，使用 `NodeStoreAdapter` 与原项目 store 系统无缝集成
- **[CustomCodeNode.tsx](https://github.com/JacksonHe04/flow-flat/blob/main/flow-flat-app/src/components/Node/custom-react-flow-node-test-demo/CustomCodeNode.tsx)**: 自定义代码节点，支持多语言语法高亮
- **[CustomImageNode.tsx](https://github.com/JacksonHe04/flow-flat/blob/main/flow-flat-app/src/components/Node/custom-react-flow-node-test-demo/CustomImageNode.tsx)**: 自定义图片节点，支持 URL 输入和文件上传
- **[DemoBoard.tsx](https://github.com/JacksonHe04/flow-flat/blob/main/flow-flat-app/src/components/Node/custom-react-flow-node-test-demo/DemoBoard.tsx)**: 独立演示画板，完全独立的测试环境
- **[TestBoard.tsx](https://github.com/JacksonHe04/flow-flat/blob/main/flow-flat-app/src/components/Node/custom-react-flow-node-test-demo/TestBoard.tsx)**: 集成测试画板，与原项目 store 完全集成

#### 集成方案特点
- **向后兼容**: 通过适配器模式兼容原项目所有节点类型
- **渐进式迁移**: 支持直接替换和渐进式迁移两种方案
- **扩展能力**: 可注册自定义节点类型，支持功能扩展
- **状态同步**: 与原项目 nodeStore 完全集成，数据实时同步

### 2. 富文本编辑器模块

[Markdown](https://github.com/JacksonHe04/flow-flat/tree/main/flow-flat-app/src/components/Markdown) 目录提供了基于 TipTap 的完整富文本编辑解决方案：

#### 核心组件
- **[RichText.tsx](https://github.com/JacksonHe04/flow-flat/blob/main/flow-flat-app/src/components/Markdown/RichText.tsx)**: 基础富文本编辑器组件
- **[MarkdownNodeEditor.tsx](https://github.com/JacksonHe04/flow-flat/blob/main/flow-flat-app/src/components/Markdown/MarkdownNodeEditor.tsx)**: 节点内嵌的轻量级编辑器

#### 工具栏系统
- **ToolbarContainer**: 工具栏容器，支持文本格式化
- **ToolbarButton**: 工具栏按钮组件
- **ToolbarGroup**: 工具栏分组管理
- **ToolbarDropdown**: 下拉菜单组件

#### 扩展配置
- **baseExtensions**: 基础扩展配置
- **nodeExtensions**: 节点场景专用扩展
- **pageExtensions**: 页面级编辑器扩展

#### 自定义钩子
- **useRichTextEditor**: 编辑器状态管理
- **useAutoSave**: 自动保存功能
- **useToolbar**: 工具栏状态管理

#### 功能特性
- 📝 **Markdown 支持**: 完整的 Markdown 语法支持
- 🎨 **富文本编辑**: 所见即所得的编辑体验
- 💾 **自动保存**: 支持本地存储和服务器保存
- 🎯 **场景适配**: 节点内嵌和页面级两种使用场景
- 🌙 **主题支持**: 亮色/暗色主题自动切换

### 3. 代码编辑器模块

[CodeEditor](https://github.com/JacksonHe04/flow-flat/tree/main/flow-flat-app/src/components/CodeEditor) 目录提供了基于 Monaco Editor 的专业代码编辑功能：

#### 核心组件
- **[MonacoEditor.tsx](https://github.com/JacksonHe04/flow-flat/blob/main/flow-flat-app/src/components/CodeEditor/MonacoEditor.tsx)**: Monaco Editor 基础组件
- **[LanguageSelector.tsx](https://github.com/JacksonHe04/flow-flat/blob/main/flow-flat-app/src/components/CodeEditor/LanguageSelector.tsx)**: 编程语言选择器
- **[constants.ts](https://github.com/JacksonHe04/flow-flat/blob/main/flow-flat-app/src/components/CodeEditor/constants.ts)**: 支持的编程语言配置

#### 功能特性
- 🔤 **语法高亮**: 支持 26+ 种编程语言
- 🧠 **智能提示**: 代码补全和智能建议
- 🔍 **错误检测**: 实时语法和语义检查
- 🎨 **主题支持**: 亮色/暗色主题切换
- ⚙️ **高度可配置**: 字体、行号、小地图等选项
- 📱 **响应式设计**: 支持紧凑模式和完整模式

#### 支持的语言
JavaScript、TypeScript、Python、Java、C++、C、C#、Go、Rust、PHP、Ruby、Swift、Kotlin、Scala、HTML、CSS、SCSS、Less、JSON、XML、YAML、Markdown、SQL、Shell、Dockerfile、Plain Text

## 项目结构

```
/flow-flat-app
├── src/
│   ├── components/
│   │   ├── Node/                    # 节点系统
│   │   │   ├── NodeLayout/          # 原项目节点布局
│   │   │   ├── Nodes/               # 内置节点类型
│   │   │   ├── ImportExport/        # 导入导出功能
│   │   │   └── custom-react-flow-node-test-demo/  # 本地包集成演示
│   │   ├── Markdown/                # 富文本编辑器模块
│   │   │   ├── Toolbar/             # 工具栏组件
│   │   │   ├── extensions/          # 扩展配置
│   │   │   ├── hooks/               # 自定义钩子
│   │   │   ├── styles/              # 样式配置
│   │   │   └── utils/               # 工具函数
│   │   └── CodeEditor/              # 代码编辑器模块
│   ├── pages/                       # 页面组件
│   ├── stores/                      # Zustand 状态管理
│   └── utils/                       # 工具函数
└── package-custom-react-flow-node/  # 自研节点组件包
    ├── src/
    │   ├── components/              # 核心组件
    │   └── types/                   # 类型定义
    └── dist/                        # 构建输出
```

## 使用场景

### 1. 节点流程图开发
- **独立开发测试**: 使用 `DemoBoard` 独立测试新节点类型
- **集成验证**: 使用 `TestBoard` 验证与原项目的兼容性
- **生产替换**: 使用 `NodeLayoutReplacement` 直接替换原项目的 NodeLayout
- **扩展开发**: 参考自定义节点示例开发新的节点类型

### 2. 富文本编辑
- **流程图节点内容编辑**: 轻量级的节点内嵌编辑器
- **文档页面编辑**: 完整的页面级编辑器
- **自定义编辑器**: 根据需要进行配置的编辑器

### 3. 代码编辑
- **代码节点编辑**: 在流程图节点中编辑代码
- **独立代码编辑**: 专业的代码编辑页面
- **多语言支持**: 支持主流编程语言的语法高亮

## 开发特性

- **模块化架构**: 各功能模块独立开发，便于维护和扩展
- **TypeScript 支持**: 提供完整的类型定义，提升开发体验
- **组件复用**: 构建可复用的组件库
- **响应式设计**: 适配不同屏幕尺寸和设备
- **热重载开发**: 基于 Vite 的快速开发体验
- **主题系统**: 统一的亮色/暗色主题支持

## 安装和运行

```bash
# 安装依赖
pnpm install

# 构建本地包
cd package-custom-react-flow-node
pnpm run build

# 启动开发服务器
cd ../flow-flat-app
pnpm run dev
```

## 技术亮点

1. **自研组件包**: 完全自主开发的 React Flow 节点组件库
2. **适配器模式**: 通过 `NodeStoreAdapter` 实现与现有系统的无缝集成
3. **渐进式迁移**: 支持从原有系统平滑迁移到新的节点系统
4. **多场景支持**: 同时支持节点内嵌和页面级的编辑场景
5. **完整的类型支持**: 全面的 TypeScript 类型定义
6. **高度可配置**: 丰富的配置选项满足不同需求