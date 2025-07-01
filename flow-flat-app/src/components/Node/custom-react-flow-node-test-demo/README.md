# Custom React Flow Node Test Demo
## 📁 文件功能概览

### 1. <mcfile name="README.md" path="/Users/jackson/Codes/flow-flat/flow-flat-app/src/components/Node/custom-react-flow-node-test-demo/README.md"></mcfile>
**项目说明文档**
- 详细介绍了整个测试演示系统的架构和使用方法
- 包含文件结构说明、核心组件介绍、使用指南
- 提供了如何在原项目中集成本地包的具体步骤
- 说明了两种集成方式：直接替换和渐进式迁移

### 2. <mcfile name="index.ts" path="/Users/jackson/Codes/flow-flat/flow-flat-app/src/components/Node/custom-react-flow-node-test-demo/index.ts"></mcfile>
**统一导出文件**
- 导出所有演示组件和测试组件
- 重新导出本地包 `custom-react-flow-node` 的所有内容
- 提供统一的入口点，方便其他模块引用

### 3. <mcfile name="TestNode.tsx" path="/Users/jackson/Codes/flow-flat/flow-flat-app/src/components/Node/custom-react-flow-node-test-demo/TestNode.tsx"></mcfile>
**基础测试节点组件**
- 最简单的测试节点实现
- 将 React Flow 的 `NodeProps` 转换为本地包的 `CustomNodeProps`
- 使用本地包的 `Node` 组件进行渲染
- 主要用于验证本地包的基本功能

### 4. <mcfile name="DemoNode.tsx" path="/Users/jackson/Codes/flow-flat/flow-flat-app/src/components/Node/custom-react-flow-node-test-demo/DemoNode.tsx"></mcfile>
**演示节点组件**
- 支持多种节点类型的演示组件
- 自动导入并注册自定义节点类型（CustomCodeNode、CustomImageNode）
- 提供 `getAvailableNodeTypes()` 函数获取已注册的节点类型
- 提供 `createDemoNode()` 辅助函数创建新节点
- 根据 `nodeType` 自动选择合适的组件进行渲染

### 5. <mcfile name="NodeLayoutReplacement.tsx" path="/Users/jackson/Codes/flow-flat/flow-flat-app/src/components/Node/custom-react-flow-node-test-demo/NodeLayoutReplacement.tsx"></mcfile>
**NodeLayout 替代组件（核心组件）**
- 直接替代原项目的 `NodeLayout/Node.tsx` 组件
- 使用本地包的 `NodeStoreAdapter` 与原项目的 store 系统集成
- 通过适配器模式兼容原项目的所有节点类型（text、code、image、markdown、todo）
- 同时支持本地包的自定义节点类型
- 实现了无缝的向后兼容

### 6. <mcfile name="CustomCodeNode.tsx" path="/Users/jackson/Codes/flow-flat/flow-flat-app/src/components/Node/custom-react-flow-node-test-demo/CustomCodeNode.tsx"></mcfile>
**自定义代码节点**
- 功能丰富的代码编辑节点
- 支持多种编程语言选择（JavaScript、TypeScript、Python、Java、C++）
- 双击进入编辑模式，失焦自动保存
- 使用本地包的 `NodeContainer` 和 `NodeHeader` 组件
- 自动注册为 `custom-code` 节点类型
- 包含语法高亮样式（终端风格的黑底绿字）

### 7. <mcfile name="CustomImageNode.tsx" path="/Users/jackson/Codes/flow-flat/flow-flat-app/src/components/Node/custom-react-flow-node-test-demo/CustomImageNode.tsx"></mcfile>
**自定义图片节点**
- 支持图片展示和编辑的节点
- 支持两种图片添加方式：URL 输入和文件上传
- 包含图片 Alt 文本和描述信息编辑
- 双击进入编辑模式，支持多字段编辑
- 自动注册为 `custom-image` 节点类型
- 包含图片加载错误处理

### 8. <mcfile name="DemoBoard.tsx" path="/Users/jackson/Codes/flow-flat/flow-flat-app/src/components/Node/custom-react-flow-node-test-demo/DemoBoard.tsx"></mcfile>
**独立演示画板**
- 完全独立的 React Flow 画板，不依赖原项目的 store
- 使用 `DemoNode` 组件渲染节点
- 包含工具栏，支持添加不同类型的节点
- 支持画布双击创建节点
- 显示已注册节点类型的统计信息
- 适合独立测试本地包功能

### 9. <mcfile name="TestBoard.tsx" path="/Users/jackson/Codes/flow-flat/flow-flat-app/src/components/Node/custom-react-flow-node-test-demo/TestBoard.tsx"></mcfile>
**集成测试画板**
- 与原项目的 `nodeStore` 完全集成的测试画板
- 使用 `NodeLayoutReplacement` 组件
- 节点数据与原项目的 store 同步
- 支持节点拖拽位置更新
- 验证本地包与原项目 store 系统的兼容性
- 适合测试替换方案的可行性

## 🔄 组件关系图

```
本地包 (custom-react-flow-node)
├── Node (核心组件)
├── NodeContainer
├── NodeHeader
├── NodeStoreAdapter
└── registerNodeType

测试演示系统
├── TestNode (基础测试)
├── DemoNode (演示节点)
├── NodeLayoutReplacement (替代组件)
├── CustomCodeNode (自定义代码节点)
├── CustomImageNode (自定义图片节点)
├── DemoBoard (独立演示)
└── TestBoard (集成测试)
```

## 🎯 使用场景

1. **独立开发测试**: 使用 `DemoBoard` 独立测试新节点类型
2. **集成验证**: 使用 `TestBoard` 验证与原项目的兼容性
3. **生产替换**: 使用 `NodeLayoutReplacement` 直接替换原项目的 NodeLayout
4. **扩展开发**: 参考 `CustomCodeNode` 和 `CustomImageNode` 开发新的节点类型

这个测试演示系统提供了完整的本地包集成方案，既保证了向后兼容性，又提供了强大的扩展能力。
