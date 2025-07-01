import React, { useState, useCallback, useRef } from 'react';
import {
  NodeContainer,
  NodeHeader,
  registerNodeType,
  type CustomNodeProps,
  type BaseNodeData
} from 'custom-react-flow-node';

interface CustomImageNodeData extends BaseNodeData {
  imageUrl?: string;
  alt?: string;
  description?: string;
  onDataChange?: (data: Partial<CustomImageNodeData>) => void;
}

/**
 * 自定义图片节点组件
 * 使用本地包的 NodeContainer 和 NodeHeader 组件
 */
const CustomImageNode: React.FC<CustomNodeProps<CustomImageNodeData>> = ({ data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState(data?.imageUrl || '');
  const [title, setTitle] = useState(data?.title || '自定义图片节点');
  const [alt, setAlt] = useState(data?.alt || '');
  const [description, setDescription] = useState(data?.description || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * 处理双击编辑事件
   */
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  /**
   * 处理失去焦点，保存内容
   */
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // 检查是否点击了组件内的其他元素
    const currentTarget = e.currentTarget;
    const relatedTarget = e.relatedTarget as Element;
    
    if (relatedTarget && currentTarget.closest('.image-edit-container')?.contains(relatedTarget)) {
      return;
    }
    
    setIsEditing(false);
    if (imageUrl !== data?.imageUrl || title !== data?.title || alt !== data?.alt || description !== data?.description) {
      data?.onDataChange?.({ imageUrl, title, alt, description });
    }
  }, [imageUrl, title, alt, description, data]);

  /**
   * 处理键盘事件
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      (e.currentTarget as HTMLElement).blur();
    }
    e.stopPropagation();
  }, []);

  /**
   * 处理标题变更
   */
  const handleTitleChange = useCallback((newTitle: string) => {
    setTitle(newTitle);
    if (newTitle !== data?.title) {
      data?.onDataChange?.({ title: newTitle, imageUrl, alt, description });
    }
  }, [imageUrl, alt, description, data]);

  /**
   * 处理文件上传
   */
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImageUrl(result);
        setAlt(file.name);
        data?.onDataChange?.({ imageUrl: result, alt: file.name, title, description });
      };
      reader.readAsDataURL(file);
    }
  }, [title, description, data]);

  /**
   * 触发文件选择
   */
  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /**
   * 处理图片加载错误
   */
  const handleImageError = useCallback(() => {
    console.log('图片加载失败');
  }, []);

  return (
    <NodeContainer 
      selected={selected} 
      onDelete={data?.onDelete}
      className="min-w-64"
    >
      <NodeHeader
        nodeType="custom-image"
        title={title}
        onTitleChange={handleTitleChange}
      />
      
      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      {/* 图片内容 */}
      {isEditing ? (
        <div className="space-y-2 image-edit-container">
          <div className="flex gap-2">
            <input
              className="
                flex-1 bg-transparent border border-gray-300 rounded px-2 py-1
                focus:outline-none focus:ring-1 focus:ring-blue-500
                dark:text-white dark:border-gray-600
              "
              placeholder="图片URL"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
            <button
              className="
                px-3 py-1 bg-blue-500 text-white rounded text-xs
                hover:bg-blue-600 transition-colors
              "
              onClick={handleUploadClick}
            >
              上传
            </button>
          </div>
          <input
            className="
              w-full bg-transparent border border-gray-300 rounded px-2 py-1
              focus:outline-none focus:ring-1 focus:ring-blue-500
              dark:text-white dark:border-gray-600
            "
            placeholder="图片Alt文本"
            value={alt}
            onChange={e => setAlt(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
          <textarea
            className="
              w-full bg-transparent border border-gray-300 rounded px-2 py-1
              focus:outline-none focus:ring-1 focus:ring-blue-500
              dark:text-white dark:border-gray-600 resize-none
            "
            placeholder="图片描述"
            value={description}
            onChange={e => setDescription(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            rows={2}
          />
        </div>
      ) : (
        <div className="w-full cursor-pointer">
          {imageUrl ? (
            <div onDoubleClick={handleDoubleClick}>
              <img
                src={imageUrl}
                alt={alt}
                className="w-full h-auto max-h-32 object-contain rounded mb-2"
                onError={handleImageError}
              />
              {description && (
                <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
                  {description}
                </div>
              )}
            </div>
          ) : (
            <div 
              className="
                w-full h-24 bg-gray-100 dark:bg-gray-700 
                border-2 border-dashed border-gray-300 dark:border-gray-600
                rounded flex items-center justify-center
                text-gray-500 dark:text-gray-400
                cursor-pointer
              "
              onDoubleClick={handleDoubleClick}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">🖼️</div>
                <div className="text-xs">双击添加图片或上传文件</div>
              </div>
            </div>
          )}
        </div>
      )}
    </NodeContainer>
  );
};

// 注册自定义节点类型
registerNodeType('custom-image', CustomImageNode);

export default CustomImageNode;