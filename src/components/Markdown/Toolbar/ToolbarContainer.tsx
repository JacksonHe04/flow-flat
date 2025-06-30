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
  StrikeIcon,
  CodeIcon,
  HeadingIcon,
  BulletListIcon,
  OrderedListIcon,
  TaskListIcon,
  BlockquoteIcon,
  CodeBlockIcon,
  LinkIcon,
  ImageIcon,
  TableIcon,
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
  toggleTaskList,
  toggleBlockquote,
  toggleCodeBlock,
  insertHorizontalRule,
  // toggleLink, // 暂时移除，功能不可用
  insertImage,
  insertTable,
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
  onLinkClick,
  onImageClick,
}) => {
  const { state } = useToolbar(editor);
  const finalConfig = { ...defaultConfig, ...config };

  if (!editor) {
    return null;
  }

  /**
   * 处理链接点击
   */
  const handleLinkClick = () => {
    if (onLinkClick) {
      onLinkClick();
    } else {
      const url = window.prompt('请输入链接地址:');
      if (url !== null) {
        // setLink功能暂时不可用
        console.warn('Link功能暂时不可用', { url });
      }
    }
  };

  /**
   * 处理图片点击
   */
  const handleImageClick = () => {
    if (onImageClick) {
      onImageClick();
    } else {
      const url = window.prompt('请输入图片地址:');
      if (url) {
        insertImage(editor, url);
      }
    }
  };

  /**
   * 获取标题下拉选项
   */
  const getHeadingOptions = () => [
    {
      label: '段落',
      value: 'paragraph',
      isActive: state.paragraph,
      onClick: () => setParagraph(editor),
    },
    {
      label: '标题 1',
      value: 'h1',
      isActive: state.heading1,
      onClick: () => setHeading(editor, 1),
    },
    {
      label: '标题 2',
      value: 'h2',
      isActive: state.heading2,
      onClick: () => setHeading(editor, 2),
    },
    {
      label: '标题 3',
      value: 'h3',
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
            trigger={<HeadingIcon />}
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
            icon={<StrikeIcon />}
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
            icon={<BulletListIcon />}
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
          {!finalConfig.compact && (
            <ToolbarButton
              icon={<TaskListIcon />}
              title="任务列表"
              isActive={state.taskList}
              onClick={() => toggleTaskList(editor)}
            />
          )}
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

      {/* 媒体组 */}
      {finalConfig.showMedia && (
        <ToolbarGroup>
          <ToolbarButton
            icon={<LinkIcon />}
            title="链接"
            isActive={state.link}
            onClick={handleLinkClick}
          />
          <ToolbarButton
            icon={<ImageIcon />}
            title="图片"
            onClick={handleImageClick}
          />
        </ToolbarGroup>
      )}

      {/* 表格组 */}
      {finalConfig.showTable && !finalConfig.compact && (
        <ToolbarGroup>
          <ToolbarButton
            icon={<TableIcon />}
            title="插入表格"
            onClick={() => insertTable(editor)}
          />
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