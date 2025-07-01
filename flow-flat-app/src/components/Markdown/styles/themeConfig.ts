/**
 * 编辑器主题配置
 */
export interface EditorTheme {
  name: string;
  colors: {
    background: string;
    text: string;
    border: string;
    toolbar: string;
    button: string;
    buttonHover: string;
    buttonActive: string;
    placeholder: string;
  };
}

/**
 * 亮色主题
 */
export const lightTheme: EditorTheme = {
  name: 'light',
  colors: {
    background: 'bg-white',
    text: 'text-gray-900',
    border: 'border-gray-200',
    toolbar: 'bg-gray-50',
    button: 'text-gray-700',
    buttonHover: 'hover:bg-gray-200',
    buttonActive: 'bg-blue-100 text-blue-700',
    placeholder: 'text-gray-400',
  },
};

/**
 * 暗色主题
 */
export const darkTheme: EditorTheme = {
  name: 'dark',
  colors: {
    background: 'bg-gray-900',
    text: 'text-gray-100',
    border: 'border-gray-700',
    toolbar: 'bg-gray-800',
    button: 'text-gray-300',
    buttonHover: 'hover:bg-gray-600',
    buttonActive: 'bg-blue-900 text-blue-300',
    placeholder: 'text-gray-500',
  },
};

/**
 * 获取主题样式类名
 */
export const getThemeClassName = (theme: EditorTheme, element: keyof EditorTheme['colors']) => {
  return theme.colors[element];
};

/**
 * 根据系统主题获取编辑器主题
 */
export const getEditorTheme = (isDark: boolean = false): EditorTheme => {
  return isDark ? darkTheme : lightTheme;
};