/**
 * 编辑器样式配置
 */
export const editorStyles = {
  // 基础编辑器样式
  base: `
    prose prose-sm dark:prose-invert max-w-none
    focus:outline-none
    [&_.ProseMirror]:outline-none
    [&_.ProseMirror]:min-h-[100px]
  `,
  
  // 节点场景样式
  node: `
    prose prose-xs dark:prose-invert max-w-none
    focus:outline-none
    [&_.ProseMirror]:outline-none
    [&_.ProseMirror]:min-h-[60px]
    [&_.ProseMirror]:max-h-[200px]
    [&_.ProseMirror]:overflow-y-auto
    [&_.ProseMirror]:text-sm
  `,
  
  // 页面场景样式
  page: `
    prose prose-base dark:prose-invert max-w-none
    focus:outline-none
    [&_.ProseMirror]:outline-none
    [&_.ProseMirror]:min-h-[300px]
    [&_.ProseMirror]:p-4
  `,
  
  // 只读模式样式
  readonly: `
    prose prose-sm dark:prose-invert max-w-none
    [&_.ProseMirror]:outline-none
    [&_.ProseMirror]:cursor-default
  `,
};

/**
 * 工具栏样式配置
 */
export const toolbarStyles = {
  // 工具栏容器
  container: `
    flex items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700
    bg-gray-50 dark:bg-gray-800
    rounded-t-lg
  `,
  
  // 紧凑型工具栏（节点场景）
  compact: `
    flex items-center gap-0.5 p-1 border-b border-gray-200 dark:border-gray-700
    bg-gray-50 dark:bg-gray-800
    rounded-t-lg
  `,
  
  // 工具栏按钮
  button: `
    inline-flex items-center justify-center
    w-8 h-8 rounded hover:bg-gray-200 dark:hover:bg-gray-600
    text-gray-700 dark:text-gray-300
    transition-colors duration-150
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  
  // 激活状态的按钮
  buttonActive: `
    bg-blue-100 dark:bg-blue-900
    text-blue-700 dark:text-blue-300
    hover:bg-blue-200 dark:hover:bg-blue-800
  `,
  
  // 工具栏分组
  group: `
    flex items-center gap-0.5
    border-r border-gray-300 dark:border-gray-600
    pr-2 mr-2 last:border-r-0 last:pr-0 last:mr-0
  `,
};

/**
 * 获取编辑器完整样式类名
 */
export const getEditorClassName = (variant: 'node' | 'page' | 'readonly' = 'page', customClass?: string) => {
  const baseStyle = variant === 'readonly' ? editorStyles.readonly : 
                   variant === 'node' ? editorStyles.node : 
                   editorStyles.page;
  
  return `${baseStyle} ${customClass || ''}`.trim();
};

/**
 * 获取工具栏完整样式类名
 */
export const getToolbarClassName = (compact: boolean = false, customClass?: string) => {
  const baseStyle = compact ? toolbarStyles.compact : toolbarStyles.container;
  return `${baseStyle} ${customClass || ''}`.trim();
};