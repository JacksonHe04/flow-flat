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
  compact = false,
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

    // 调用外部的 onMount 回调
    if (onMount) {
      onMount(editor, monaco);
    }
  };

  /**
   * 处理编辑器内容变化
   */
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  return (
    <Editor
      height={height}
      width={width}
      language={language}
      value={value}
      theme={theme}
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
      options={{
        selectOnLineNumbers: true,
        roundedSelection: false,
        readOnly,
        cursorStyle: 'line',
        automaticLayout: true,
        glyphMargin: compact ? false : true,
        folding: compact ? false : true,
        lineDecorationsWidth: compact ? 8 : 20,
        lineNumbersMinChars: compact ? 2 : 3,
        renderLineHighlight: compact ? 'none' : 'all',
        contextmenu: true,
        mouseWheelZoom: true,
        smoothScrolling: true,
        cursorBlinking: 'blink',
        cursorSmoothCaretAnimation: 'on',
        renderWhitespace: 'selection',
        showFoldingControls: compact ? 'never' : 'always',
        foldingHighlight: compact ? false : true,
        hideCursorInOverviewRuler: compact ? true : false,
        overviewRulerBorder: compact ? false : true,
        scrollbar: compact ? {
          vertical: 'hidden',
          horizontal: 'hidden'
        } : undefined,
        bracketPairColorization: {
          enabled: true,
        },
        guides: {
          bracketPairs: true,
          indentation: true,
        },
        suggest: {
          showKeywords: true,
          showSnippets: true,
          showClasses: true,
          showFunctions: true,
          showVariables: true,
          showModules: true,
          showProperties: true,
          showEvents: true,
          showOperators: true,
          showUnits: true,
          showValues: true,
          showConstants: true,
          showEnums: true,
          showEnumMembers: true,
          showColors: true,
          showFiles: true,
          showReferences: true,
          showFolders: true,
          showTypeParameters: true,
          showIssues: true,
          showUsers: true,
        },
      }}
    />
  );
};

export default MonacoEditor;