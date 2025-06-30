import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navItems } from '@/config/navItems';

interface NavbarProps {
  className?: string;
}

/**
 * 导航栏组件
 * @param className - 额外的CSS类名
 * @returns 导航栏JSX元素
 */
const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const location = useLocation();

  /**
   * 判断当前路径是否为活跃状态
   * @param path - 导航项路径
   * @returns 是否为活跃状态
   */
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className={`
      fixed top-0 left-0 right-0 z-50
      bg-white/80 backdrop-blur-md
      border-b border-slate-200
      px-6 h-16
      flex items-center
      ${className}
    `}>
      {/* Logo 区域 */}
      <div className="flex items-center space-x-2">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="Flow Flat" className="w-8 h-8" />
          <span className="text-lg font-semibold text-slate-800">Flow Flat</span>
        </Link>
      </div>

      {/* 导航链接 - 居中显示 */}
      <div className="flex-1 flex justify-center">
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`transition-colors ${
                isActive(item.path) 
                  ? 'text-emerald-500' 
                  : 'text-slate-600 hover:text-emerald-500'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* 右侧占位区域，保持布局平衡 */}
      <div className="w-[120px]"></div>
    </nav>
  );
};

export default Navbar;