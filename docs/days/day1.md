# Day 1 开发计划：项目初始化与基础架构

## 目标
完成项目的基础搭建，为后续开发各核心模块打好基础。

---

## 主要任务

1. **使用 Vite 初始化 React 项目**
   - 创建项目骨架，选择 React + JavaScript/TypeScript。
   - 配置基础依赖（如 Redux、React Router）。

2. **搭建基础目录结构**
   - /src/components      // 自研基础组件库
   - /src/editor          // 代码编辑器模块
   - /src/richtext        // 富文本/Markdown编辑器模块
   - /src/flow            // 节点流程图模块
   - /src/pages           // 页面级组件
   - /src/store           // Redux 相关
   - /src/router          // 路由配置
   - /src/api             // 与后端交互
   - /src/utils           // 工具函数
   - App.jsx / main.jsx

3. **配置开发规范**
   - 集成 ESLint、Prettier，保证代码风格统一。
   - 可选：配置 Stylelint（如需统一样式规范）。

4. **实现首页与基础路由**
   - 首页为白板列表页（/），可跳转到白板编辑页（/board/:id）。
   - 配置 React Router，完成基础页面跳转。

5. **初始化 Redux**
   - 配置 Redux（推荐 Redux Toolkit），为后续状态管理做准备。

---

## 今日产出物
- Vite + React + Redux + React Router 项目骨架
- 规范化的目录结构
- 首页与白板编辑页的基础路由
- ESLint/Prettier 配置

---

## 明日展望
- 开始实现白板画布与节点系统雏形，实现节点的添加、拖拽、删除等基础功能。 