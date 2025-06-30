# Markdown 富文本编辑器组件

基于 TipTap 构建的高度可配置、模块化的富文本编辑器组件系统，专为 Flow-Flat 项目设计。

## 🚀 特性

- **模块化设计**: 支持节点内嵌和独立页面两种使用场景
- **高度可配置**: 灵活的工具栏配置和扩展系统
- **TypeScript 支持**: 完整的类型定义
- **主题支持**: 内置亮色/暗色主题
- **自动保存**: 支持本地存储和远程保存
- **性能优化**: 防抖更新、懒加载扩展
- **可访问性**: 符合 WCAG 标准
- **响应式设计**: 适配各种屏幕尺寸

## 📦 组件概览

### 核心组件

1. **RichTextEditor** - 基础富文本编辑器
2. **MarkdownNode** - 节点内嵌编辑器
3. **MarkdownEditor** - 完整页面编辑器

### 工具栏组件

- **ToolbarContainer** - 工具栏容器
- **ToolbarButton** - 工具栏按钮
- **ToolbarGroup** - 工具栏分组
- **ToolbarDropdown** - 工具栏下拉菜单

## 🛠 安装和依赖

项目已包含以下 TipTap 相关依赖：

```json
{
  "@tiptap/react": "^2.1.13",
  "@tiptap/pm": "^2.1.13",
  "@tiptap/starter-kit": "^2.1.13",
  "@tiptap/extension-placeholder": "^2.1.13",
  "@tiptap/extension-typography": "^2.1.13",
  "@tiptap/extension-link": "^2.1.13",
  "@tiptap/extension-image": "^2.1.13",
  "@tiptap/extension-table": "^2.1.13",
  "@tiptap/extension-table-row": "^2.1.13",
  "@tiptap/extension-table-cell": "^2.1.13",
  "@tiptap/extension-table-header": "^2.1.13",
  "@tiptap/extension-task-list": "^2.1.13",
  "@tiptap/extension-task-item": "^2.1.13",
  "@tiptap/extension-code-block-lowlight": "^2.1.13",
  "@tiptap/extension-mention": "^2.1.13",
  "@tiptap/extension-character-count": "^2.1.13",
  "lowlight": "^3.1.0",
  "@types/hast": "^3.0.4"
}
```

## 📖 使用指南

### 基础使用

```tsx
import { RichTextEditor } from '@/components/Markdown';

function MyComponent() {
  const [content, setContent] = useState('');

  return (
    <RichTextEditor
      content={content}
      onChange={setContent}
      placeholder="请输入内容..."
    />
  );
}
```

### 节点内嵌编辑器

```tsx
import { MarkdownNode } from '@/components/Markdown';

function FlowNode() {
  const [content, setContent] = useState('');

  return (
    <MarkdownNode
      content={content}
      onChange={setContent}
      placeholder="点击编辑..."
      minHeight={60}
      maxHeight={200}
    />
  );
}
```

### 完整页面编辑器

```tsx
import { MarkdownEditor } from '@/components/Markdown';

function DocumentEditor() {
  const [content, setContent] = useState('');

  const handleSave = async (content: string) => {
    // 保存到服务器
    await api.saveDocument(content);
  };

  return (
    <MarkdownEditor
      content={content}
      onChange={setContent}
      onSave={handleSave}
      autoSave={true}
      showStatusBar={true}
      localStorageKey="my-document"
    />
  );
}
```

## ⚙️ 配置选项

### RichTextEditor Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `content` | `string` | `''` | 编辑器内容 |
| `onChange` | `(content: string) => void` | - | 内容变化回调 |
| `placeholder` | `string` | - | 占位符文本 |
| `editable` | `boolean` | `true` | 是否可编辑 |
| `variant` | `'node' \| 'page'` | `'page'` | 编辑器变体 |
| `showToolbar` | `boolean` | `true` | 是否显示工具栏 |
| `toolbarConfig` | `ToolbarConfig` | - | 工具栏配置 |
| `autoFocus` | `boolean` | `false` | 自动聚焦 |
| `debounceDelay` | `number` | `300` | 防抖延迟（毫秒） |

### ToolbarConfig

```tsx
interface ToolbarConfig {
  compact?: boolean;        // 紧凑模式
  showTable?: boolean;      // 显示表格工具
  showMedia?: boolean;      // 显示媒体工具
  showHistory?: boolean;    // 显示历史操作
}
```

### MarkdownEditor 额外 Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `onSave` | `(content: string) => Promise<void>` | - | 保存回调 |
| `autoSave` | `boolean` | `true` | 自动保存 |
| `autoSaveDelay` | `number` | `2000` | 自动保存延迟 |
| `localStorageKey` | `string` | - | 本地存储键名 |
| `showStatusBar` | `boolean` | `true` | 显示状态栏 |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | 主题模式 |
| `fullHeight` | `boolean` | `false` | 全高度模式 |

## 🎨 样式定制

### CSS 变量

组件使用 CSS 变量支持主题定制：

```css
:root {
  --editor-bg: #ffffff;
  --editor-text: #1f2937;
  --editor-border: #e5e7eb;
  --toolbar-bg: #f9fafb;
  --button-hover: #f3f4f6;
}

[data-theme="dark"] {
  --editor-bg: #1f2937;
  --editor-text: #f9fafb;
  --editor-border: #374151;
  --toolbar-bg: #111827;
  --button-hover: #374151;
}
```

### 自定义样式类

```tsx
<RichTextEditor
  className="my-custom-editor"
  content={content}
  onChange={setContent}
/>
```

## 🔧 扩展系统

### 使用自定义扩展

```tsx
import { Extension } from '@tiptap/core';
import { RichTextEditor } from '@/components/Markdown';

const CustomExtension = Extension.create({
  name: 'customExtension',
  // 扩展配置
});

function MyEditor() {
  return (
    <RichTextEditor
      extensions={[CustomExtension]}
      content={content}
      onChange={setContent}
    />
  );
}
```

### 预设扩展配置

```tsx
import { getPageExtensions, getNodeExtensions } from '@/components/Markdown';

// 获取页面模式扩展
const pageExtensions = getPageExtensions('请输入内容...');

// 获取节点模式扩展
const nodeExtensions = getNodeExtensions('点击编辑...');
```

## 🎯 使用场景

### 1. Flow 节点内嵌编辑

```tsx
// 在 Flow 节点中使用
function FlowTextNode({ data, onChange }) {
  return (
    <div className="flow-node">
      <MarkdownNode
        content={data.content}
        onChange={(content) => onChange({ ...data, content })}
        placeholder="输入文本..."
        minHeight={40}
        maxHeight={150}
      />
    </div>
  );
}
```

### 2. 文档编辑页面

```tsx
// 独立的文档编辑页面
function DocumentPage() {
  return (
    <div className="h-screen">
      <MarkdownEditor
        content={document.content}
        onChange={handleContentChange}
        onSave={handleSave}
        fullHeight={true}
        autoSave={true}
        localStorageKey={`doc-${document.id}`}
      />
    </div>
  );
}
```

### 3. 评论系统

```tsx
// 评论编辑器
function CommentEditor({ onSubmit }) {
  const [content, setContent] = useState('');

  return (
    <div>
      <RichTextEditor
        content={content}
        onChange={setContent}
        variant="node"
        placeholder="写下你的评论..."
        toolbarConfig={{ compact: true, showTable: false }}
      />
      <button onClick={() => onSubmit(content)}>
        发布评论
      </button>
    </div>
  );
}
```

## 🔍 API 参考

### Hooks

- `useRichTextEditor` - 编辑器核心 Hook
- `useToolbar` - 工具栏状态管理
- `useAutoSave` - 自动保存功能
- `useLocalAutoSave` - 本地存储自动保存

### 工具函数

- `isContentEmpty` - 检查内容是否为空
- `getPlainText` - 获取纯文本
- `getWordCount` - 获取字数统计
- `sanitizeContent` - 清理内容
- `markdownToHtml` / `htmlToMarkdown` - 格式转换

### 格式化操作

- `toggleBold` / `toggleItalic` / `toggleStrike` - 文本格式
- `setHeading` / `setParagraph` - 段落格式
- `toggleBulletList` / `toggleOrderedList` - 列表
- `insertImage` / `insertTable` - 插入元素

## 🐛 故障排除

### 常见问题

1. **编辑器不显示**
   - 检查是否正确导入组件
   - 确认 TipTap 依赖已安装

2. **样式异常**
   - 确认 Tailwind CSS 已正确配置
   - 检查 CSS 变量是否定义

3. **扩展不工作**
   - 检查扩展配置是否正确
   - 确认扩展依赖已安装

### 调试技巧

```tsx
// 启用调试模式
<RichTextEditor
  content={content}
  onChange={(newContent) => {
    console.log('Content changed:', newContent);
    setContent(newContent);
  }}
/>
```

## 📝 更新日志

### v1.0.0
- 初始版本发布
- 支持基础富文本编辑功能
- 提供节点和页面两种模式
- 集成工具栏和自动保存功能

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

MIT License