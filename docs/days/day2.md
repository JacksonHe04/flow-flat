## 第二天：白板画布与节点系统雏形

### 1. 白板编辑页面实现
- 创建 `/src/pages/Board.tsx` 组件
- 实现路由 `/board/:id` 的页面渲染
- 设计白板容器的基本样式：
  ```css
  .board-container {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    position: relative;
    background: #f5f5f5;
  }
  ```

### 2. 节点容器实现
- 创建 `/src/components/Node/NodeContainer.tsx`
- 实现基础节点容器：
  ```typescript
  interface NodeContainerProps {
    id: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    children?: React.ReactNode;
  }
  ```
- 实现拖拽功能：
  - 使用 `onMouseDown`、`onMouseMove`、`onMouseUp` 事件
  - 计算鼠标移动距离，更新节点位置
  - 添加拖拽时的视觉反馈

### 3. 节点管理系统
- 创建 `/src/store/slices/nodeSlice.ts`
- 定义节点数据结构：
  ```typescript
  interface Node {
    id: string;
    type: 'component' | 'code' | 'richtext';
    position: { x: number; y: number };
    size: { width: number; height: number };
    data: any;
  }
  ```
- 实现节点操作：
  - 添加节点
  - 删除节点
  - 更新节点位置
  - 更新节点大小

### 4. 白板交互功能
- 实现画布缩放：
  - 支持鼠标滚轮缩放
  - 添加缩放控制按钮
- 实现画布平移：
  - 支持鼠标拖拽画布
  - 添加平移控制按钮
- 实现节点选择：
  - 点击选中节点
  - 显示节点控制点
  - 支持多选功能

### 5. 工具栏实现
- 创建 `/src/components/Toolbar/Toolbar.tsx`
- 添加基础工具：
  - 添加节点按钮
  - 删除节点按钮
  - 缩放控制
  - 画布重置按钮

### 6. 样式与交互优化
- 添加节点拖拽时的阴影效果
- 实现节点选中状态的视觉反馈
- 添加简单的动画效果
- 优化拖拽性能

### 7. 测试用例
- 测试节点拖拽功能
- 测试节点添加/删除
- 测试画布缩放和平移
- 测试节点选择功能

### 8. 文档更新
- 更新项目文档，记录节点系统设计
- 记录已知问题和解决方案
- 制定第三天的工作计划

### 注意事项
1. 保持代码简洁，只实现核心功能
2. 确保代码可维护性和可扩展性
3. 注意性能优化，特别是拖拽操作
4. 保持UI风格统一，符合设计规范
5. 及时提交代码，做好版本控制

### 预期成果
- 可拖拽的节点系统
- 基础的白板交互功能
- 完整的节点数据结构
- 清晰的代码组织

### 技术要点
- 使用 React 的 `useState` 和 `useEffect` 管理状态
- 使用 Redux 管理节点数据
- 使用 CSS Transform 实现拖拽
- 使用 TypeScript 确保类型安全

这个计划遵循了MVP原则，只实现最基础、可用的版本，为后续功能扩展打好基础。每个任务都是可独立完成的，便于追踪进度和调试问题。