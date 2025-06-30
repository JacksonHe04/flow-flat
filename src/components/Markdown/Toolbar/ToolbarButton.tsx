import React from 'react';
import { toolbarStyles } from '../styles';

/**
 * 工具栏按钮Props接口
 */
export interface ToolbarButtonProps {
  icon: React.ReactNode;
  title: string;
  isActive?: boolean;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
}

/**
 * 工具栏按钮组件
 * 提供统一的工具栏按钮样式和交互
 */
const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon,
  title,
  isActive = false,
  disabled = false,
  onClick,
  className = '',
}) => {
  /**
   * 处理按钮点击
   */
  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  /**
   * 获取按钮样式类名
   */
  const getButtonClassName = () => {
    const baseClass = toolbarStyles.button;
    const activeClass = isActive ? toolbarStyles.buttonActive : '';
    
    return `${baseClass} ${activeClass} ${className}`.trim();
  };

  return (
    <button
      type="button"
      title={title}
      className={getButtonClassName()}
      onClick={handleClick}
      disabled={disabled}
      aria-pressed={isActive}
      aria-label={title}
    >
      {icon}
    </button>
  );
};

export default ToolbarButton;