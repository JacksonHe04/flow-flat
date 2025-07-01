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



  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        语言:
      </label>
      <select
        value={value}
        onChange={handleLanguageChange}
        className="
          px-3 py-1.5 text-sm border border-slate-300 rounded-md
          bg-white dark:bg-slate-800
          text-slate-900 dark:text-slate-100
          border-slate-300 dark:border-slate-600
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          dark:focus:ring-blue-400 dark:focus:border-blue-400
          transition-colors duration-200
        "
      >
        {SUPPORTED_LANGUAGES.map((language) => (
          <option key={language.value} value={language.value}>
            {language.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;