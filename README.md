# Flow-Flat 项目介绍

## 项目概述

Flow-Flat 是一个创新的智能白板平台，融合了 Notion 的"区块"理念和苹果"无边记"（Freeform）的自由白板体验。它允许用户在无限画布上创建、编辑和连接各种类型的节点，每个节点可以是组件、代码块或富文本内容。同时，平台集成了 AI 助手功能，为用户提供智能化的创作支持。

## 核心特性

### 1. 自由白板
- 无限画布，支持自由缩放和拖拽
- 支持多个白板的创建和管理
- 白板内容可保存和编辑

### 2. 多样化节点
- **组件节点**：可插入自研UI组件
- **代码节点**：支持代码编辑和高亮
- **富文本节点**：支持 Markdown 编辑和预览
- 节点间可建立连接关系

### 3. AI 助手
- 全局 AI 页面：独立的 AI 对话界面
- 悬浮 AI 助手：每个页面右下角的快速访问入口

## 技术架构

### 前端技术栈
- **框架**：React + TypeScript
- **构建工具**：Vite
- **状态管理**：Redux Toolkit
- **路由**：React Router
- **样式**：Tailwind CSS
- **代码高亮**：Prism.js
- **Markdown 解析**：Marked.js

### 项目结构
```
/src
  /components      // 自研基础组件库
  /editor          // 代码编辑器模块
  /richtext        // 富文本/Markdown编辑器模块
  /flow            // 节点流程图模块
  /pages           // 页面级组件
  /store           // Redux相关
  /router          // 路由配置
  /api             // 与后端交互
  /utils           // 工具函数
```

## 开发计划

项目采用 7 天 MVP 开发计划，每天聚焦一个核心功能：

1. **第1天**：项目初始化与基础架构
2. **第2天**：白板画布与节点系统雏形
3. **第3天**：组件节点实现
4. **第4天**：代码节点实现
5. **第5天**：富文本节点实现
6. **第6天**：节点连线与数据管理
7. **第7天**：AI助手与基础优化

## 设计理念

- **简洁现代**：采用 Fluent Design 和 macOS Big Sur 的设计语言
- **模块化**：所有内容都是可组合的节点
- **智能辅助**：AI 助手随时提供支持
- **自由创作**：无限画布，无拘无束的创作空间

## 数据结构

```typescript
interface Board {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
}

interface Node {
  id: string;
  type: 'component' | 'code' | 'richtext';
  position: { x: number; y: number };
  size: { width: number; height: number };
  data: any;
}

interface Edge {
  from: string;
  to: string;
  // 其他连线属性
}
```

## 后续规划

1. 完善节点类型和功能
2. 增强 AI 助手能力
3. 添加协作功能
4. 优化性能和用户体验
5. 支持更多导入导出格式