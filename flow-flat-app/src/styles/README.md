# Flow Flat 样式系统 - 开发者指南

> 🚀 **快速开始**：本项目已预定义了完整的样式系统，开发者可以直接使用以下CSS类，无需重复编写样式代码。

## 🎯 快速参考 - 可直接使用的CSS类

### 🔘 按钮类 (直接使用)
```html
<!-- 基础按钮 -->
<button class="btn">基础按钮</button>
<button class="btn btn-primary">主要按钮</button>
<button class="btn btn-secondary">次要按钮</button>

<!-- 状态按钮 -->
<button class="btn btn-success">成功</button>
<button class="btn btn-warning">警告</button>
<button class="btn btn-error">错误</button>
<button class="btn btn-info">信息</button>

<!-- 轮廓按钮 -->
<button class="btn btn-outline">轮廓按钮</button>
<button class="btn btn-outline-primary">主要轮廓</button>

<!-- 按钮尺寸 -->
<button class="btn btn-sm">小按钮</button>
<button class="btn btn-lg">大按钮</button>
```

### 📝 表单类 (直接使用)
```html
<!-- 输入框 -->
<input class="input" placeholder="基础输入框">
<input class="input input-error" placeholder="错误状态">
<input class="input input-success" placeholder="成功状态">

<!-- 标签 -->
<label class="label">表单标签</label>
```

### 🏷️ 徽章类 (直接使用)
```html
<span class="badge-primary">主要</span>
<span class="badge-success">成功</span>
<span class="badge-warning">警告</span>
<span class="badge-error">错误</span>
<span class="badge-info">信息</span>
```

### ⚠️ 警告框类 (直接使用)
```html
<div class="alert-success">成功提示信息</div>
<div class="alert-warning">警告提示信息</div>
<div class="alert-error">错误提示信息</div>
<div class="alert-info">普通提示信息</div>
```

### 📦 布局组件类 (直接使用)
```html
<!-- 卡片 -->
<div class="card">普通卡片</div>
<div class="card card-hover">悬停效果卡片</div>

<!-- 工具栏 -->
<div class="toolbar">工具栏内容</div>

<!-- 浮动面板 -->
<div class="floating-panel">浮动面板内容</div>

<!-- 导航链接 -->
<a class="nav-link">导航链接</a>
<a class="nav-link nav-link-active">激活状态</a>
```

### ⏳ 加载状态类 (直接使用)
```html
<div class="loading">加载中...</div>
<div class="spinner"></div>
```

### 🎨 工具类 (直接使用)
```html
<!-- 文本颜色 -->
<p class="text-primary">主要文本</p>
<p class="text-secondary">次要文本</p>
<p class="text-success">成功文本</p>
<p class="text-warning">警告文本</p>
<p class="text-error">错误文本</p>
<p class="text-info">信息文本</p>

<!-- 背景颜色 -->
<div class="bg-primary-light">主要浅色背景</div>
<div class="bg-success-light">成功浅色背景</div>
<div class="bg-warning-light">警告浅色背景</div>
<div class="bg-error-light">错误浅色背景</div>
<div class="bg-info-light">信息浅色背景</div>

<!-- 边框颜色 -->
<div class="border-primary">主要边框</div>
<div class="border-success">成功边框</div>
<div class="border-warning">警告边框</div>
<div class="border-error">错误边框</div>
<div class="border-info">信息边框</div>

<!-- 阴影效果 -->
<div class="shadow-primary">主要阴影</div>
<div class="shadow-success">成功阴影</div>
<div class="shadow-warning">警告阴影</div>
<div class="shadow-error">错误阴影</div>
<div class="shadow-info">信息阴影</div>

<!-- 交互效果 -->
<div class="hover-lift">悬停上升</div>
<div class="hover-scale">悬停缩放</div>
<div class="focus-ring">焦点环效果</div>

<!-- 过渡动画 -->
<div class="transition-natural">自然过渡</div>
<div class="transition-fast">快速过渡</div>
<div class="transition-slow">慢速过渡</div>

<!-- 布局工具 -->
<div class="container-responsive">响应式容器</div>
<div class="center-absolute">绝对居中</div>
<div class="center-flex">弹性居中</div>
<div class="grid-auto-fit">自适应网格</div>
<div class="grid-auto-fill">自填充网格</div>

<!-- 文本处理 -->
<p class="text-truncate">单行文本截断</p>
<p class="text-truncate-2">两行文本截断</p>
<p class="text-truncate-3">三行文本截断</p>

<!-- 响应式显示 -->
<div class="show-mobile">仅移动端显示</div>
<div class="show-desktop">仅桌面端显示</div>

<!-- 其他工具 -->
<div class="disabled">禁用状态</div>
<div class="scrollbar-thin">细滚动条</div>
<hr class="divider">
```

## 📁 文件结构

```
src/styles/
├── index.css          # 主入口文件
├── base.css           # 向后兼容入口（已重构）
├── theme.css          # 主题配置和颜色变量
├── base-styles.css    # 基础 HTML 元素样式
├── components.css     # 可复用组件样式
├── utilities.css      # 原子化工具类
└── README.md          # 本文档
```

## 🎨 模块说明

### 1. theme.css - 主题配置
- Tailwind CSS v4 主题变量定义
- 主色调、状态色、中性色配置
- 必须首先导入，为其他模块提供颜色基础

### 2. base-styles.css - 基础样式
- HTML 元素的默认样式重置
- 排版系统（标题、段落、链接等）
- 表单元素基础样式
- 全局滚动条和选择样式

### 3. components.css - 组件样式
- 可复用的 UI 组件类
- 按钮、卡片、徽章、警告框等
- 导航、工具栏、加载状态组件

### 4. utilities.css - 工具类
- 原子化的工具类
- 颜色、间距、布局辅助类
- 响应式显示、动画效果类

## 🎯 开发最佳实践

1. **优先使用预定义类**：项目已提供完整的组件和工具类，避免重复编写CSS
2. **组件类优先**：使用 `.btn`、`.card` 等组件类构建界面主体
3. **工具类微调**：使用工具类进行颜色、间距等细节调整
4. **保持一致性**：使用统一的颜色系统（primary、success、warning、error、info）
5. **响应式设计**：利用 `.show-mobile`、`.show-desktop` 等类处理不同屏幕

---

> 💡 **提示**：所有上述CSS类都已经定义完成，开发者可以直接在HTML中使用，无需额外编写CSS代码。如有疑问，请参考各模块的源文件或联系项目维护者。