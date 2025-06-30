/**
 * 内容处理工具函数
 */

/**
 * 检查内容是否为空
 */
export const isContentEmpty = (content: string): boolean => {
  if (!content || content.trim() === '') return true;
  
  // 移除HTML标签后检查是否为空
  const textContent = content.replace(/<[^>]*>/g, '').trim();
  return textContent === '';
};

/**
 * 获取内容的纯文本版本
 */
export const getPlainText = (htmlContent: string): string => {
  // 创建临时DOM元素来提取纯文本
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  return tempDiv.textContent || tempDiv.innerText || '';
};

/**
 * 截取内容摘要
 */
export const getContentSummary = (content: string, maxLength: number = 100): string => {
  const plainText = getPlainText(content);
  if (plainText.length <= maxLength) return plainText;
  
  return plainText.substring(0, maxLength).trim() + '...';
};

/**
 * 清理HTML内容
 */
export const sanitizeContent = (content: string): string => {
  // 移除危险的HTML标签和属性
  const dangerousTags = /<(script|style|iframe|object|embed)[^>]*>.*?<\/\1>/gi;
  const dangerousAttrs = /(on\w+|javascript:)[^\s>]*/gi;
  
  return content
    .replace(dangerousTags, '')
    .replace(dangerousAttrs, '');
};

/**
 * 转换Markdown到HTML
 */
export const markdownToHtml = (markdown: string): string => {
  // 简单的Markdown转换，实际项目中可能需要使用专门的库
  return markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\n/gim, '<br>');
};

/**
 * 转换HTML到Markdown
 */
export const htmlToMarkdown = (html: string): string => {
  // 简单的HTML转换，实际项目中可能需要使用专门的库
  return html
    .replace(/<h1>(.*?)<\/h1>/gim, '# $1\n')
    .replace(/<h2>(.*?)<\/h2>/gim, '## $1\n')
    .replace(/<h3>(.*?)<\/h3>/gim, '### $1\n')
    .replace(/<strong>(.*?)<\/strong>/gim, '**$1**')
    .replace(/<em>(.*?)<\/em>/gim, '*$1*')
    .replace(/<br\s*\/?>/gim, '\n')
    .replace(/<[^>]*>/g, ''); // 移除其他HTML标签
};