import React, { useState, useCallback, useRef } from 'react';
import { type NodeProps, type Node } from '@xyflow/react';
import { type BaseNodeData } from '../../types';
import NodeContainer from '../NodeLayout/NodeContainer';
import NodeHeader from '../NodeLayout/NodeHeader';

export interface ImageNodeData extends BaseNodeData {
  title?: string;
  imageUrl?: string;
  alt?: string;
  description?: string;
}

/**
 * 图片节点组件
 */
const ImageNode: React.FC<NodeProps<Node<ImageNodeData>>> = ({ id, data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState(data?.imageUrl || '');
  const [title, setTitle] = useState(data?.title || '图片节点');
  const [alt, setAlt] = useState(data?.alt || '');
  const [description, setDescription] = useState(data?.description || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  /**
   * 处理失去焦点，保存内容
   */
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // 检查是否点击了组件内的其他元素，如果是则不关闭编辑模式
    const currentTarget = e.currentTarget;
    const relatedTarget = e.relatedTarget as Element;
    
    // 如果焦点转移到了组件内的其他输入框，不关闭编辑模式
    if (relatedTarget && currentTarget.closest('.image-node-edit-container')?.contains(relatedTarget)) {
      return;
    }
    
    setIsEditing(false);
    if (data?.onDataChange) {
      data.onDataChange(id, { imageUrl, title, alt, description });
    }
  }, [id, imageUrl, title, alt, description, data]);

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
        if (data?.onDataChange) {
          data.onDataChange(id, { imageUrl: result, alt: file.name, title, description });
        }
      };
      reader.readAsDataURL(file);
    }
  }, [id, title, description, data]);

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

  const handleTitleChange = useCallback((newTitle: string) => {
    setTitle(newTitle);
    if (data?.onDataChange) {
      data.onDataChange(id, { title: newTitle, imageUrl, alt, description });
    }
  }, [id, imageUrl, alt, description, data]);

  return (
    <NodeContainer 
      selected={selected} 
      onDelete={data?.onDelete}
      className="min-w-[280px]"
    >
      <NodeHeader
        nodeType="image"
        title={title}
        onTitleChange={handleTitleChange}
      />
      
      {/* 图片内容区域 */}
      <div className="p-3 space-y-3">
        {/* 图片显示区域 */}
        {imageUrl ? (
          <div className="relative group">
            <img
              src={imageUrl}
              alt={alt || '图片'}
              className="w-full h-auto max-h-64 object-contain rounded-lg border border-gray-200 dark:border-gray-700"
              onError={handleImageError}
              onDoubleClick={handleDoubleClick}
            />
            
            {/* 编辑模式下的操作按钮 */}
            {isEditing && (
              <div className="absolute top-2 right-2 flex gap-1">
                <button
                  onClick={handleUploadClick}
                  className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  更换
                </button>
              </div>
            )}
          </div>
        ) : (
          <div 
            className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
            onClick={handleUploadClick}
            onDoubleClick={handleDoubleClick}
          >
            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-gray-500 dark:text-gray-400">点击上传图片</span>
          </div>
        )}
        
        {/* 编辑模式下的表单 */}
        {isEditing && (
          <div className="image-node-edit-container space-y-2">
            {/* Alt文本 */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Alt文本
              </label>
              <input
                type="text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder="图片描述"
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            {/* 描述 */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                描述
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder="图片描述信息"
                rows={2}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
              />
            </div>
          </div>
        )}
        
        {/* 非编辑模式下显示描述 */}
        {!isEditing && description && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </div>
        )}
      </div>
      
      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      {/* 非编辑模式下添加双击事件处理 */}
      {!isEditing && (
        <div
          className="absolute inset-0 cursor-pointer"
          onDoubleClick={handleDoubleClick}
        />
      )}
    </NodeContainer>
  );
};

export default ImageNode;