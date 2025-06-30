import React from 'react';
import { Link } from 'react-router-dom';
import { navItems } from '@/config/navItems';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  return (
    <nav className={`
      fixed top-0 left-0 right-0 z-50
      bg-white/80 backdrop-blur-md
      border-b border-slate-200
      px-6 h-16
      flex items-center justify-between
      ${className}
    `}>
      {/* Logo 区域 */}
      <div className="flex items-center space-x-2">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="Flow Flat" className="w-8 h-8" />
          <span className="text-lg font-semibold text-slate-800">Flow Flat</span>
        </Link>
      </div>

      {/* 导航链接 */}
      <div className="hidden md:flex items-center space-x-6">
        {navItems.map(item => (
          <Link key={item.path} to={item.path} className="text-slate-600 hover:text-emerald-500 transition-colors">
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar; 