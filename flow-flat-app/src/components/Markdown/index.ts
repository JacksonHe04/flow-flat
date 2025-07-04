// 主要组件导出
export { default as RichTextEditor, type RichTextEditorProps } from './RichText';
export { default as MarkdownNode, type MarkdownNodeProps } from './MarkdownNodeEditor';
export { default as MarkdownEditor, type MarkdownEditorProps } from '../../pages/markdown/components/MarkdownEditor';

// 工具栏组件导出
export {
  ToolbarContainer,
  ToolbarButton,
  ToolbarGroup,
  ToolbarDropdown,
  type ToolbarContainerProps,
  type ToolbarButtonProps,
  type ToolbarGroupProps,
  type ToolbarDropdownProps,
  type ToolbarConfig,
  type DropdownOption,
} from './Toolbar';

// Hooks导出
export {
  useRichTextEditor,
  useDebouncedUpdate,
  useToolbar,
  useAutoSave,
  useLocalAutoSave,
  useLocalRestore,
  clearLocalContent,
  type UseRichTextEditorOptions,
  type UseRichTextEditorReturn,
  type ToolbarState,
  type UseToolbarReturn,
  type UseAutoSaveOptions,
  type UseAutoSaveReturn,
} from './hooks';

// 扩展配置导出
export {
  getBaseExtensions,
  getReadOnlyExtensions,
  getNodeExtensions,
  getNodePreviewExtensions,
  getPageExtensions,
  getPagePreviewExtensions,
} from './extensions';

// 样式配置导出
export {
  editorStyles,
  toolbarStyles,
  getEditorClassName,
  getToolbarClassName,
  type EditorTheme,
  lightTheme,
  darkTheme,
  getThemeClassName,
  getEditorTheme,
} from './styles';

// 工具函数导出
export {
  isContentEmpty,
  getPlainText,
  getContentSummary,
  sanitizeContent,
  markdownToHtml,
  htmlToMarkdown,
  toggleBold,
  toggleItalic,
  toggleStrike,
  toggleCode,
  setHeading,
  setParagraph,
  toggleBulletList,
  toggleOrderedList,
  toggleBlockquote,
  toggleCodeBlock,
  insertHorizontalRule,
  insertHardBreak,
  undo,
  redo,
  clearFormat,
  getFormatState,
} from './utils';