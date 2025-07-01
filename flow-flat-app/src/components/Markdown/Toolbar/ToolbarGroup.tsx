import React from 'react';
import { toolbarStyles } from '../styles';

/**
 * 工具栏分组Props接口
 */
export interface ToolbarGroupProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * 工具栏分组组件
 * 用于将相关的工具栏按钮分组显示
 */
const ToolbarGroup: React.FC<ToolbarGroupProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`${toolbarStyles.group} ${className}`.trim()}>
      {children}
    </div>
  );
};

export default ToolbarGroup;