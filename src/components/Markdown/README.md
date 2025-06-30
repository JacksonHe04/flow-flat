# Flow Flat Markdown 组件库

## 简介

Flow Flat Markdown 组件库是一个基于 TipTap 的富文本编辑器组件集合，提供了丰富的 Markdown 编辑和预览功能。该组件库设计灵活，可以适应不同场景的需求，从简单的节点内嵌编辑器到完整的页面编辑器都有对应的实现。

## 组件结构

```
/Markdown
├── 主要组件
│   ├── RichText.tsx         # 基础富文本编辑器组件
│   ├── MarkdownNode.tsx     # 节点内嵌的轻量级编辑器组件
│   └── MarkdownEditor.tsx   # 完整的页面级编辑器组件
├── 工具栏组件
│   ├── ToolbarContainer.tsx # 工具栏容器
│   ├── ToolbarButton.tsx    # 工具栏按钮
│   ├── ToolbarGroup.tsx     # 工具栏分组
│   └── ToolbarDropdown.tsx  # 工具栏下拉菜单
├── 扩展配置
│   ├── baseExtensions.ts    # 基础扩展配置
│   ├── nodeExtensions.ts    # 节点场景扩展配置
│   └── pageExtensions.ts    # 页面场景扩展配置
├── 自定义钩子
│   ├── useRichTextEditor.ts # 富文本编辑器钩子
│   ├── useAutoSave.ts       # 自动保存钩子
│   └── useToolbar.ts        # 工具栏状态管理钩子
├── 样式配置
│   ├── editorStyles.ts      # 编辑器样式配置
│   └── themeConfig.ts       # 主题配置
└── 工具函数
    ├── contentUtils.ts      # 内容处理工具函数
    └── formatUtils.ts       # 格式化工具函数
```

## 主要组件

### RichTextEditor

基础的富文本编辑器组件，提供了核心的编辑功能，可以根据不同场景进行配置。

```tsx
<RichTextEditor
  content="初始内容"
  onChange={(content) => console.log(content)}
  variant="page" // 'node' | 'page'
  showToolbar={true}
  placeholder="开始编写..."
/>
```

### MarkdownNode

专为流程图节点设计的轻量级编辑器组件，提供简洁的编辑体验，适合在节点内嵌使用。

```tsx
<MarkdownNode
  content="节点内容"
  onChange={(content) => console.log(content)}
  placeholder="输入内容..."
  minHeight={40}
  maxHeight={300}
  onEmpty={() => console.log('内容为空')}
  onNotEmpty={() => console.log('内容不为空')}
/>
```

### MarkdownEditor

完整的页面级编辑器组件，提供了工具栏、状态栏、自动保存等功能，适合作为独立的编辑页面使用。

```tsx
<MarkdownEditor
  content="页面内容"
  onChange={(content) => console.log(content)}
  onSave={async (content) => await saveToServer(content)}
  showToolbar={true}
  showStatusBar={true}
  autoSave={true}
  autoSaveDelay={2000}
  localStorageKey="my-document"
  fullHeight={true}
/>
```

## 工具栏组件

工具栏组件提供了丰富的文本格式化功能，包括文本样式、标题、列表、引用、代码块等。

```tsx
<ToolbarContainer
  editor={editor}
  config={{
    compact: false,
    showTable: true,
    showMedia: true,
    showHistory: true,
  }}
/>
```

## 自定义钩子

### useRichTextEditor

封装了 TipTap 编辑器的创建和状态管理，提供了编辑器实例和状态信息。

```tsx
const { editor, isEmpty, isFocused, wordCount, characterCount } = useRichTextEditor({
  content: "初始内容",
  extensions: getPageExtensions(),
  editable: true,
  autofocus: false,
  onUpdate: handleUpdate,
  onFocus: handleFocus,
  onBlur: handleBlur,
});
```

### useAutoSave

提供内容自动保存功能，可以配置保存延迟和保存回调。

```tsx
const { isSaving, lastSaved, save } = useAutoSave({
  content: "要保存的内容",
  onSave: async (content) => await saveToServer(content),
  delay: 2000,
  enabled: true,
});
```

### useLocalAutoSave

将内容自动保存到 localStorage，方便恢复编辑状态。

```tsx
useLocalAutoSave("document-key", content, 1000);

// 恢复内容
const savedContent = useLocalRestore("document-key");

// 清除内容
clearLocalContent("document-key");
```

### useToolbar

管理工具栏按钮的激活状态，根据编辑器当前状态更新工具栏。

```tsx
const { state, updateState } = useToolbar(editor);
// state.bold, state.italic, state.heading1 等表示当前格式状态
```

## 工具函数

### 内容处理工具函数

提供了内容检查、转换和处理的功能。

```tsx
// 检查内容是否为空
isContentEmpty(content);

// 获取纯文本内容
getPlainText(htmlContent);

// 获取内容摘要
getContentSummary(content, 100);

// 计算字数
getWordCount(content);

// 清理HTML内容
sanitizeContent(content);

// Markdown 和 HTML 互转
markdownToHtml(markdown);
htmlToMarkdown(html);
```

### 格式化工具函数

提供了文本格式化的功能。

```tsx
// 切换粗体
toggleBold(editor);

// 切换斜体
toggleItalic(editor);

// 设置标题
setHeading(editor, 2); // h2

// 切换列表
toggleBulletList(editor);
toggleOrderedList(editor);

// 获取当前格式状态
const formatState = getFormatState(editor);
```

## 样式和主题

组件库提供了灵活的样式配置和主题支持，可以适应不同的设计需求。

```tsx
// 获取编辑器样式
const editorClassName = getEditorClassName('page');

// 获取工具栏样式
const toolbarClassName = getToolbarClassName(false);

// 获取主题样式
const editorTheme = getEditorTheme(isDarkMode);
const themeClass = getThemeClassName(editorTheme, 'background');
```

## 扩展配置

组件库提供了不同场景的扩展配置，可以根据需要选择合适的扩展。

```tsx
// 基础扩展
const baseExtensions = getBaseExtensions(placeholder);

// 节点场景扩展
const nodeExtensions = getNodeExtensions(placeholder);

// 页面场景扩展
const pageExtensions = getPageExtensions();

// 只读模式扩展
const readOnlyExtensions = getReadOnlyExtensions();
```

## 使用场景

1. **流程图节点内容编辑**：使用 `MarkdownNode` 组件，提供轻量级的编辑体验。
2. **文档页面编辑**：使用 `MarkdownEditor` 组件，提供完整的编辑功能。
3. **自定义编辑器**：使用 `RichTextEditor` 组件，根据需要进行配置。

## 注意事项

1. 组件库依赖于 TipTap 编辑器，需要安装相关依赖。
2. 样式基于 Tailwind CSS，需要确保项目中已配置。
3. 主题支持亮色和暗色模式，可以根据系统主题自动切换。
4. 自动保存功能需要配置保存回调函数。
5. 本地存储功能使用 localStorage，需要注意浏览器兼容性和存储限制。