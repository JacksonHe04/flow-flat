# Flow Flat 节点流程图平台

## 项目概述

Flow Flat 是一个整合节点流程图、富文本编辑器、代码编辑器三大核心功能模块的集成开发平台。平台提供可视化的节点流程图编辑能力，同时内置强大的富文本编辑器和代码编辑器，为用户提供一站式的创作和开发体验。

## 技术架构

### 前端技术栈
- **框架**：React + TypeScript
- **构建工具**：Vite
- **状态管理**：Zustand
- **节点流程图**：React Flow
- **代码编辑器**：Monaco Editor
- **样式**：Tailwind CSS

## 核心特性

### 1. 可视化节点流程图
- 集成 React Flow 实现可视化节点流程图编辑器
- 支持拖拽、连线、节点配置等交互功能
- 提供丰富的节点类型和连接方式
- 支持流程图的导入导出功能

### 2. 富文本编辑器
- 内置强大的富文本编辑器
- 支持 Markdown 语法编写和解析
- 提供实时预览功能
- 支持文本格式化和样式设置

### 3. 代码编辑器
- 集成 Monaco Editor 专业代码编辑器
- 提供语法高亮显示
- 支持代码补全和智能提示
- 内置错误检测和提示功能
- 支持多种编程语言

### 4. 轻量级状态管理
- 使用 Zustand 进行状态管理
- 实现跨组件的数据共享
- 支持响应式数据更新
- 简化状态管理复杂度

## 项目结构
```
/src
  /components      // 基础组件库
  /pages           // 页面级组件
    /boards        // 节点流程图页面
    /docs          // 文档页面
    /richtext      // 富文本编辑页面
    /ide           // 代码编辑页面
  /store           // Zustand状态管理
  /router          // 路由配置
  /api             // API接口
  /utils           // 工具函数
  /styles          // 样式文件
```

## 数据结构

```typescript
/**
 * 节点流程图数据结构
 */
interface FlowBoard {
  id: string;
  name: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  viewport: Viewport;
}

/**
 * 流程图节点
 */
interface FlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: any;
}

/**
 * 流程图连线
 */
interface FlowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

/**
 * 富文本文档
 */
interface RichTextDoc {
  id: string;
  title: string;
  content: string;
  format: 'markdown' | 'html';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 代码文件
 */
interface CodeFile {
  id: string;
  name: string;
  language: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 开发特性

- **模块化架构**：各功能模块独立开发，便于维护和扩展
- **TypeScript 支持**：提供完整的类型定义，提升开发体验
- **响应式设计**：适配不同屏幕尺寸和设备
- **热重载开发**：基于 Vite 的快速开发体验
- **组件复用**：构建可复用的组件库

## 后续规划

1. 增强节点流程图的交互功能
2. 扩展富文本编辑器的功能特性
3. 优化代码编辑器的性能和体验
4. 添加协作和分享功能
5. 支持更多文件格式的导入导出
6. 集成 AI 辅助功能
7. 添加插件系统支持扩展