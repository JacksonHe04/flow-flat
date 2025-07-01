import React, { useRef } from 'react';
import Editor, { type Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  theme?: 'vs-dark' | 'light';
  height?: string | number;
  width?: string | number;
  readOnly?: boolean;
  minimap?: boolean;
  fontSize?: number;
  wordWrap?: 'on' | 'off' | 'wordWrapColumn' | 'bounded';
  lineNumbers?: 'on' | 'off' | 'relative' | 'interval';
  compact?: boolean;
  onMount?: (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => void;
}

/**
 * Monaco Editor 基础组件
 * 提供代码编辑功能，支持语法高亮、代码补全、错误检测等功能
 */
const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  onChange,
  language,
  theme = 'light',
  height = '400px',
  width = '100%',
  readOnly = false,
  minimap = true,
  fontSize = 14,
  wordWrap = 'on',
  lineNumbers = 'on',
  onMount,
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  /**
   * 编辑器挂载时的处理函数
   */
  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    
    // 配置编辑器选项
    editor.updateOptions({
      fontSize,
      wordWrap,
      lineNumbers,
      minimap: { enabled: minimap },
      readOnly,
      automaticLayout: true,
      scrollBeyondLastLine: false,
      renderWhitespace: 'selection',
      tabSize: 2,
      insertSpaces: true,
    });

    // 配置语言特性
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });

    // 配置编译选项
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types'],
    });

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types'],
      strict: true,
    });

    // 调用外部挂载回调
    onMount?.(editor, monaco);
  };

  /**
   * 处理编辑器内容变化
   */
  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  return (
    <div className="w-full h-full border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden">
      <Editor
        height={height}
        width={width}
        language={language}
        value={value}
        theme={theme}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          fontSize,
          wordWrap,
          lineNumbers,
          minimap: { enabled: minimap },
          readOnly,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          renderWhitespace: 'selection',
          tabSize: 2,
          insertSpaces: true,
          padding: { top: 8, bottom: 8 },
        }}
      />
    </div>
  );
};

export default MonacoEditor;