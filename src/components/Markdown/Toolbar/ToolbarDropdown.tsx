import React, { useState, useRef, useEffect } from 'react';
import { toolbarStyles } from '../styles';

/**
 * 下拉菜单选项接口
 */
export interface DropdownOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
}

/**
 * 工具栏下拉菜单Props接口
 */
export interface ToolbarDropdownProps {
  trigger: React.ReactNode;
  options: DropdownOption[];
  title: string;
  disabled?: boolean;
  className?: string;
}

/**
 * 工具栏下拉菜单组件
 * 提供下拉选择功能的工具栏按钮
 */
const ToolbarDropdown: React.FC<ToolbarDropdownProps> = ({
  trigger,
  options,
  title,
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * 切换下拉菜单显示状态
   */
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  /**
   * 关闭下拉菜单
   */
  const closeDropdown = () => {
    setIsOpen(false);
  };

  /**
   * 处理选项点击
   */
  const handleOptionClick = (option: DropdownOption) => {
    option.onClick();
    closeDropdown();
  };

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  /**
   * 获取触发按钮样式类名
   */
  const getTriggerClassName = () => {
    const baseClass = toolbarStyles.button;
    const activeClass = isOpen ? toolbarStyles.buttonActive : '';
    
    return `${baseClass} ${activeClass} ${className}`.trim();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 触发按钮 */}
      <button
        type="button"
        title={title}
        className={getTriggerClassName()}
        onClick={toggleDropdown}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={title}
      >
        {trigger}
        {/* 下拉箭头 */}
        <svg
          className="w-3 h-3 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="
          absolute top-full left-0 mt-1 z-50
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          rounded-md shadow-lg
          min-w-[120px]
        ">
          {options.map((option, index) => (
            <button
              key={option.value}
              type="button"
              className={`
                w-full px-3 py-2 text-left text-sm
                hover:bg-gray-100 dark:hover:bg-gray-700
                flex items-center gap-2
                ${option.isActive ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : ''}
                ${index === 0 ? 'rounded-t-md' : ''}
                ${index === options.length - 1 ? 'rounded-b-md' : ''}
              `}
              onClick={() => handleOptionClick(option)}
            >
              {option.icon && (
                <span className="flex-shrink-0">
                  {option.icon}
                </span>
              )}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ToolbarDropdown;