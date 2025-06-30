import React from 'react';
import { SUPPORTED_LANGUAGES } from './constants';

interface LanguageSelectorProps {
  value: string;
  onChange: (language: string) => void;
  className?: string;
}

/**
 * 语言选择器组件
 * 提供编程语言选择功能
 */
const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  onChange,
  className = '',
}) => {
  /**
   * 处理语言选择变化
   */
  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  /**
   * 获取当前选中语言的信息
   */
  const getCurrentLanguage = () => {
    return SUPPORTED_LANGUAGES.find(lang => lang.value === value) || SUPPORTED_LANGUAGES[0];
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        语言:
      </label>
      <select
        value={value}
        onChange={handleLanguageChange}
        className="
          px-3 py-1.5 text-sm border border-gray-300 rounded-md
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-gray-100
          border-gray-300 dark:border-gray-600
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          dark:focus:ring-blue-400 dark:focus:border-blue-400
          transition-colors duration-200
        "
      >
        {SUPPORTED_LANGUAGES.map((language) => (
          <option key={language.value} value={language.value}>
            {language.label} ({language.extension})
          </option>
        ))}
      </select>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {getCurrentLanguage().extension}
      </span>
    </div>
  );
};

export default LanguageSelector;