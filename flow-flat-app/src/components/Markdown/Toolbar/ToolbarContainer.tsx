import React from 'react';
import { Editor } from '@tiptap/react';
import { useToolbar } from '../hooks';
import { getToolbarClassName } from '../styles';
import ToolbarButton from './ToolbarButton';
import ToolbarGroup from './ToolbarGroup';
import ToolbarDropdown from './ToolbarDropdown';
import {
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  CodeIcon,
  ParagraphIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  UnorderedListIcon,
  OrderedListIcon,
  BlockquoteIcon,
  CodeBlockIcon,
  HorizontalRuleIcon,
  UndoIcon,
  RedoIcon,
  ClearFormatIcon,
} from './ToolbarIcons';
import {
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
  undo,
  redo,
  clearFormat,
} from '../utils';

/**
 * 工具栏配置接口
 */
export interface ToolbarConfig {
  showFormatting?: boolean;
  showHeadings?: boolean;
  showLists?: boolean;
  showBlocks?: boolean;
  showMedia?: boolean;
  showTable?: boolean;
  showHistory?: boolean;
  compact?: boolean;
}

/**
 * 工具栏容器Props接口
 */
export interface ToolbarContainerProps {
  editor: Editor | null;
  config?: ToolbarConfig;
  className?: string;
  onLinkClick?: () => void;
  onImageClick?: () => void;
}

/**
 * 默认工具栏配置
 */
const defaultConfig: ToolbarConfig = {
  showFormatting: true,
  showHeadings: true,
  showLists: true,
  showBlocks: true,
  showMedia: true,
  showTable: true,
  showHistory: true,
  compact: false,
};

/**
 * 工具栏容器组件
 * 提供完整的编辑器工具栏功能
 */
const ToolbarContainer: React.FC<ToolbarContainerProps> = ({
  editor,
  config = defaultConfig,
  className = '',
}) => {
  const { state } = useToolbar(editor);
  const finalConfig = { ...defaultConfig, ...config };

  if (!editor) {
    return null;
  }

  /**
   * 获取标题下拉选项
   */
  const getHeadingOptions = () => [
    {
      label: '段落',
      value: 'paragraph',
      icon: <ParagraphIcon />,
      isActive: state.paragraph,
      onClick: () => setParagraph(editor),
    },
    {
      label: '标题 1',
      value: 'h1',
      icon: <Heading1Icon />,
      isActive: state.heading1,
      onClick: () => setHeading(editor, 1),
    },
    {
      label: '标题 2',
      value: 'h2',
      icon: <Heading2Icon />,
      isActive: state.heading2,
      onClick: () => setHeading(editor, 2),
    },
    {
      label: '标题 3',
      value: 'h3',
      icon: <Heading3Icon />,
      isActive: state.heading3,
      onClick: () => setHeading(editor, 3),
    },
  ];

  return (
    <div className={getToolbarClassName(finalConfig.compact, className)}>
      {/* 历史操作组 */}
      {finalConfig.showHistory && (
        <ToolbarGroup>
          <ToolbarButton
            icon={<UndoIcon />}
            title="撤销"
            disabled={!state.canUndo}
            onClick={() => undo(editor)}
          />
          <ToolbarButton
            icon={<RedoIcon />}
            title="重做"
            disabled={!state.canRedo}
            onClick={() => redo(editor)}
          />
        </ToolbarGroup>
      )}

      {/* 标题组 */}
      {finalConfig.showHeadings && (
        <ToolbarGroup>
          <ToolbarDropdown
            trigger={state.paragraph ? <ParagraphIcon /> : state.heading1 ? <Heading1Icon /> : state.heading2 ? <Heading2Icon /> : state.heading3 ? <Heading3Icon /> : <ParagraphIcon />}
            title="标题"
            options={getHeadingOptions()}
          />
        </ToolbarGroup>
      )}

      {/* 格式化组 */}
      {finalConfig.showFormatting && (
        <ToolbarGroup>
          <ToolbarButton
            icon={<BoldIcon />}
            title="粗体"
            isActive={state.bold}
            onClick={() => toggleBold(editor)}
          />
          <ToolbarButton
            icon={<ItalicIcon />}
            title="斜体"
            isActive={state.italic}
            onClick={() => toggleItalic(editor)}
          />
          <ToolbarButton
            icon={<StrikethroughIcon />}
            title="删除线"
            isActive={state.strike}
            onClick={() => toggleStrike(editor)}
          />
          <ToolbarButton
            icon={<CodeIcon />}
            title="行内代码"
            isActive={state.code}
            onClick={() => toggleCode(editor)}
          />
        </ToolbarGroup>
      )}

      {/* 列表组 */}
      {finalConfig.showLists && (
        <ToolbarGroup>
          <ToolbarButton
            icon={<UnorderedListIcon />}
            title="无序列表"
            isActive={state.bulletList}
            onClick={() => toggleBulletList(editor)}
          />
          <ToolbarButton
            icon={<OrderedListIcon />}
            title="有序列表"
            isActive={state.orderedList}
            onClick={() => toggleOrderedList(editor)}
          />
        </ToolbarGroup>
      )}

      {/* 块级元素组 */}
      {finalConfig.showBlocks && (
        <ToolbarGroup>
          <ToolbarButton
            icon={<BlockquoteIcon />}
            title="引用块"
            isActive={state.blockquote}
            onClick={() => toggleBlockquote(editor)}
          />
          <ToolbarButton
            icon={<CodeBlockIcon />}
            title="代码块"
            isActive={state.codeBlock}
            onClick={() => toggleCodeBlock(editor)}
          />
          {!finalConfig.compact && (
            <ToolbarButton
              icon={<HorizontalRuleIcon />}
              title="分割线"
              onClick={() => insertHorizontalRule(editor)}
            />
          )}
        </ToolbarGroup>
      )}

      {/* 清除格式 */}
      {finalConfig.showFormatting && !finalConfig.compact && (
        <ToolbarGroup>
          <ToolbarButton
            icon={<ClearFormatIcon />}
            title="清除格式"
            onClick={() => clearFormat(editor)}
          />
        </ToolbarGroup>
      )}
    </div>
  );
};

export default ToolbarContainer;