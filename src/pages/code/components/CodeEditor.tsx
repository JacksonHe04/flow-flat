import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCodeStore } from '@/stores/codeStore';
import MonacoEditor from '@/components/CodeEditor/MonacoEditor';
import LanguageSelector from '@/components/CodeEditor/LanguageSelector';
import { Save, ArrowLeft, Download, Copy, RotateCcw } from 'lucide-react';

/**
 * 代码编辑器页面组件
 * 提供完整的代码编辑功能，包括保存、下载、复制等操作
 */
const CodeEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items, updateProject, addProject } = useCodeStore();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isModified, setIsModified] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // 查找当前项目
  const currentProject = id ? items.find(item => item.id === id) : null;
  const isNewProject = id === 'new';

  /**
   * 初始化编辑器内容
   */
  useEffect(() => {
    if (isNewProject) {
      setTitle('新建代码文件');
      setContent('// 开始编写你的代码\nconsole.log("Hello, World!");');
      setLanguage('javascript');
      setIsModified(false);
    } else if (currentProject) {
      setTitle(currentProject.title);
      setContent(currentProject.content);
      setLanguage(currentProject.language);
      setIsModified(false);
      setLastSaved(new Date(currentProject.updatedAt));
    } else if (id && id !== 'new') {
      // 项目不存在，跳转回列表
      navigate('/code');
    }
  }, [id, currentProject, isNewProject, navigate]);

  /**
   * 处理内容变化
   */
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    setIsModified(true);
  }, []);

  /**
   * 处理标题变化
   */
  const handleTitleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setIsModified(true);
  }, []);

  /**
   * 处理语言变化
   */
  const handleLanguageChange = useCallback((newLanguage: string) => {
    setLanguage(newLanguage);
    setIsModified(true);
  }, []);

  /**
   * 保存项目
   */
  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      alert('请输入文件标题');
      return;
    }

    setIsSaving(true);
    
    try {
      const now = new Date().toISOString();
      
      if (isNewProject) {
        // 创建新项目
        const newId = Date.now().toString();
        const newProject = {
          id: newId,
          title: title.trim(),
          content,
          language,
          createdAt: now,
          updatedAt: now,
        };
        
        addProject(newProject);
        navigate(`/code/${newId}`);
      } else if (currentProject) {
        // 更新现有项目
        const updatedProject = {
          ...currentProject,
          title: title.trim(),
          content,
          language,
          updatedAt: now,
        };
        
        updateProject(updatedProject);
      }
      
      setIsModified(false);
      setLastSaved(new Date());
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  }, [title, content, language, isNewProject, currentProject, addProject, updateProject, navigate]);

  /**
   * 复制代码到剪贴板
   */
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content);
      alert('代码已复制到剪贴板');
    } catch (error) {
      console.error('复制失败:', error);
      alert('复制失败，请手动选择复制');
    }
  }, [content]);

  /**
   * 下载代码文件
   */
  const handleDownload = useCallback(() => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'code'}.${getFileExtension(language)}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [content, title, language]);

  /**
   * 重置到上次保存的状态
   */
  const handleReset = useCallback(() => {
    if (isModified && confirm('确定要放弃当前修改吗？')) {
      if (currentProject) {
        setTitle(currentProject.title);
        setContent(currentProject.content);
        setLanguage(currentProject.language);
      } else {
        setTitle('新建代码文件');
        setContent('// 开始编写你的代码\nconsole.log("Hello, World!");');
        setLanguage('javascript');
      }
      setIsModified(false);
    }
  }, [isModified, currentProject]);

  /**
   * 返回列表页
   */
  const handleBack = useCallback(() => {
    if (isModified && !confirm('有未保存的修改，确定要离开吗？')) {
      return;
    }
    navigate('/code');
  }, [isModified, navigate]);

  /**
   * 获取文件扩展名
   */
  const getFileExtension = (lang: string): string => {
    const extensions: Record<string, string> = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      csharp: 'cs',
      go: 'go',
      rust: 'rs',
      php: 'php',
      ruby: 'rb',
      swift: 'swift',
      kotlin: 'kt',
      scala: 'scala',
      html: 'html',
      css: 'css',
      scss: 'scss',
      less: 'less',
      json: 'json',
      xml: 'xml',
      yaml: 'yaml',
      markdown: 'md',
      sql: 'sql',
      shell: 'sh',
      dockerfile: 'dockerfile',
      plaintext: 'txt',
    };
    return extensions[lang] || 'txt';
  };

  /**
   * 键盘快捷键处理
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  return (
    <div className="flex flex-col bg-white dark:bg-gray-900" style={{ height: 'calc(100vh - 4rem)' }}>
      {/* 头部工具栏 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="
              flex items-center gap-2 px-3 py-1.5 text-sm
              text-gray-600 dark:text-gray-400
              hover:text-gray-900 dark:hover:text-gray-100
              transition-colors duration-200
            "
          >
            <ArrowLeft size={16} />
            返回
          </button>
          
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="输入文件标题"
            className="
              text-lg font-medium bg-transparent border-none outline-none
              text-gray-900 dark:text-gray-100
              placeholder-gray-500 dark:placeholder-gray-400
              min-w-0 flex-1
            "
          />
          
          {isModified && (
            <span className="text-xs text-orange-500 dark:text-orange-400">
              • 未保存
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <LanguageSelector
            value={language}
            onChange={handleLanguageChange}
          />
          
          <div className="flex items-center gap-1 ml-4">
            <button
              onClick={handleReset}
              disabled={!isModified}
              className="
                p-2 rounded-md text-gray-600 dark:text-gray-400
                hover:bg-gray-100 dark:hover:bg-gray-800
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200
              "
              title="重置到上次保存状态"
            >
              <RotateCcw size={16} />
            </button>
            
            <button
              onClick={handleCopy}
              className="
                p-2 rounded-md text-gray-600 dark:text-gray-400
                hover:bg-gray-100 dark:hover:bg-gray-800
                transition-colors duration-200
              "
              title="复制代码"
            >
              <Copy size={16} />
            </button>
            
            <button
              onClick={handleDownload}
              className="
                p-2 rounded-md text-gray-600 dark:text-gray-400
                hover:bg-gray-100 dark:hover:bg-gray-800
                transition-colors duration-200
              "
              title="下载文件"
            >
              <Download size={16} />
            </button>
            
            <button
              onClick={handleSave}
              disabled={isSaving || !isModified}
              className="
                flex items-center gap-2 px-4 py-2 text-sm font-medium
                bg-blue-600 hover:bg-blue-700 text-white
                disabled:bg-gray-400 disabled:cursor-not-allowed
                rounded-md transition-colors duration-200
              "
            >
              <Save size={16} />
              {isSaving ? '保存中...' : '保存'}
            </button>
          </div>
        </div>
      </div>

      {/* 状态栏 */}
      {lastSaved && (
        <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
          上次保存: {lastSaved.toLocaleString()}
        </div>
      )}

      {/* 编辑器区域 */}
      <div className="flex-1 overflow-hidden">
        <MonacoEditor
          value={content}
          onChange={handleContentChange}
          language={language}
          theme="vs-dark"
          height="100%"
        />
      </div>
    </div>
  );
};

export default CodeEditor;