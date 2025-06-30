# Redux 迁移至 Zustand
## 🎯 开发目标

本次开发的核心目标是将项目的状态管理库从 **Redux** 完全迁移到 **Zustand**，以简化代码、减少样板代码，并提升开发效率。

## 📝 开发过程摘要

1.  **状态分析**：首先，通过 `view_files` 工具检查了现有的 Redux 状态结构，包括 `store/index.ts`、`store/slices/nodeSlice.ts` 和 `store/slices/boardsSlice.ts`，以全面了解现有的状态逻辑。
2.  **依赖确认**：查看了 `package.json` 文件，确认项目中已安装 `zustand`，为迁移做好了准备。
3.  **创建 Zustand Store**：创建了两个新的 Zustand store 文件，`stores/nodeStore.ts` 和 `stores/boardStore.ts`，并使用 `immer` 中间件来复现并替代原有的 Redux Slices 功能。
4.  **移除 Redux Provider**：修改了入口文件 `src/main.tsx`，移除了包裹根组件的 Redux `<Provider>`。
5.  **组件重构**：逐个重构了所有使用 Redux hooks (`useDispatch`, `useSelector`) 的组件，包括 `Toolbar`、`RichTextNode`、`Board` 和 `BoardList`，将它们切换为使用新的 Zustand hooks。
6.  **功能增强**：在重构 `NodeContainer` 组件时，利用新的 Zustand store 实现了更直接的节点选择逻辑。
7.  **清理旧代码**：删除了整个 `/src/store` 目录，彻底清除了所有旧的 Redux 相关代码文件。
8.  **验证与测试**：启动了开发服务器，并通过预览确认所有功能（如节点添加/删除、拖拽、编辑、画布操作等）均正常工作，验证了迁移的成功。

## 💻 关键代码实现

以下是迁移后核心的 Zustand store 和组件实现。

**文件路径：[nodeStore.ts](https://github.com/JacksonHe04/flow-flat/tree/main/src/stores/nodeStore.ts)**

```typescript
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// ... (接口定义) ...

/**
 * 节点状态管理store
 */
export const useNodeStore = create<NodeState & NodeActions>()(immer((set) => ({
  // 初始状态
  nodes: {},
  selectedNodeIds: [],

  // 操作方法
  addNode: (node) => set((state) => {
    state.nodes[node.id] = node;
  }),

  removeNode: (id) => set((state) => {
    delete state.nodes[id];
    state.selectedNodeIds = state.selectedNodeIds.filter(nodeId => nodeId !== id);
  }),

  updateNodePosition: (id, position) => set((state) => {
    const node = state.nodes[id];
    if (node) {
      node.position = position;
    }
  }),

  // ... (其他 actions)
})));
```

**文件路径：[Board.tsx](https://github.com/JacksonHe04/flow-flat/tree/main/src/pages/boards/components/Board.tsx)**

```typescript
import React, { useState, useCallback, useEffect } from 'react';
import NodeContainer from '../../../components/Node/NodeContainer';
import RichTextNode from '../../../components/Node/RichTextNode';
import Toolbar from '../../../components/Toolbar/Toolbar';
import { useNodeStore, type Node } from '../../../stores/nodeStore';

const Board: React.FC = () => {
  const { 
    nodes, 
    selectedNodeIds, 
    updateNodePosition, 
    clearSelection, 
    addNode, 
    removeNode 
  } = useNodeStore();

  // ... (组件内部逻辑，现在直接调用 useNodeStore 返回的函数)

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).id === 'board-canvas') {
      // ... (计算位置)
      const newNode: Node = {
        id: `node-${Date.now()}`,
        type: 'richtext',
        position: { x, y },
        size: { width: 200, height: 150 },
        data: { content: '双击编辑文本' }
      };
      addNode(newNode); // 直接调用 store action
    }
  }, [addNode, pan, zoom]);

  // ... (其他事件处理)

  return (
    // ... (JSX 结构)
  );
};

export default Board;
```

## 🐛 问题与解决方案

-   **问题**：项目原先使用 Redux，导致状态管理逻辑分散，样板代码较多，不够现代化。
-   **解决方案**：决定并实施了从 Redux 到 Zustand 的整体迁移。通过创建对等的 store 和 actions，并重构相关组件，成功替换了状态管理方案，使得代码更简洁、直观。

-   **问题**：在尝试通过 `pnpm remove` 移除 Redux 依赖包时，命令执行失败。
-   **解决方案**：通过分析命令输出的错误信息 `ERR_PNPM_CANNOT_REMOVE_MISSING_DEPS`，确认这些依赖已在之前的步骤中被移除或在 `package.json` 中不存在。因此，这个问题无需修复，迁移已正确完成。

## ✅ 最终结论

本次开发任务圆满完成。项目已成功从 Redux 迁移至 Zustand，所有核心功能均已通过测试，运行正常。代码库变得更加简洁和易于维护，为后续的开发工作奠定了良好的基础。
        