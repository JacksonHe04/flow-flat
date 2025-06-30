import React from 'react';
import { Link } from 'react-router-dom';
import { navItems } from '@/config/navItems';

const Home: React.FC = () => {
  // 过滤出需要在主页显示的导航项
  const homeNavItems = navItems.filter(item => item.showInHome);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col items-center justify-center py-16 px-4">
      <div className="max-w-4xl w-full text-center mb-12">
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4 drop-shadow-lg">
          Flow Flat
        </h1>
        <h2 className="text-5xl font-bold text-slate-800 dark:text-white mb-4 drop-shadow-sm">
        集成白板、Markdown、IDE、组件库等多种工具
          <br />
          助力你的创意与协作
        </h2>
        <p className="text-lg text-slate-700 dark:text-slate-300 mb-8">
        简洁 · 现代 · 高效的多功能协作平台
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="#"
            className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
          >
            What is Flow Flat?
          </a>
          <a
            href="/docs"
            className="bg-secondary hover:bg-secondary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
          >
            Quickstart
          </a>
          <a
            href="https://github.com/JacksonHe04/flow-flat"
            className="border border-primary text-primary hover:bg-primary hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
          >
            GitHub
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mt-16">
        {/* 动态生成卡片 */}
        {homeNavItems.map((item) => (
          <Link to={item.url} key={item.url} className="block">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-8 flex flex-col items-center text-center h-full">
              {/* 这里可以根据item.url或者其他属性来决定显示不同的图标 */}
              <img src="/logo.png" alt={item.label} className="w-16 h-16 mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">{item.label}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {item.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <footer className="mt-16 text-xs text-slate-400 dark:text-slate-600">
      © {new Date().getFullYear()} Flow Flat. Inspired by Coze, Notion, Lark, Apple, Claude.
      </footer>
    </div>
  );
};

export default Home;
