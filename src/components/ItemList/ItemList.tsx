import React from 'react';
import { Link } from 'react-router-dom';

/**
 * 列表项接口
 */
export interface ListItem {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 列表组件属性接口
 */
interface ItemListProps {
  /** 页面标题 */
  title: string;
  /** 列表项数据 */
  items: ListItem[];
  /** 新建按钮文本 */
  createButtonText: string;
  /** 新建按钮链接 */
  createButtonLink: string;
  /** 项目链接生成函数 */
  getItemLink: (id: string) => string;
  /** 预览图占位文本 */
  previewPlaceholder?: string;
}

/**
 * 通用列表组件
 * 用于显示白板、markdown文档、Code项目等列表
 */
const ItemList: React.FC<ItemListProps> = ({
  title,
  items,
  createButtonText,
  createButtonLink,
  getItemLink,
  previewPlaceholder = '预览图'
}) => {
  return (
    <div className="p-8">
      <div className="
        max-w-7xl mx-auto
        space-y-8
      ">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            {title}
          </h1>
          <Link
            to={createButtonLink}
            className="
              px-4 py-2 rounded-lg
              bg-primary text-white
              hover:bg-primary/90
              transition-colors duration-200
            "
          >
            {createButtonText}
          </Link>
        </div>

        <div className="
          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
          gap-6
        ">
          {items.map(item => (
            <Link
              key={item.id}
              to={getItemLink(item.id)}
              className="
                group
                bg-white dark:bg-slate-800
                rounded-lg shadow-md
                overflow-hidden
                transition-all duration-200
                hover:shadow-lg
                hover:scale-[1.02]
                border border-slate-200 dark:border-slate-700
              "
            >
              <div className="
                aspect-video
                bg-slate-100 dark:bg-slate-700
                flex items-center justify-center
                text-slate-400 dark:text-slate-500
              ">
                {previewPlaceholder}
              </div>
              <div className="p-4">
                <h3 className="
                  text-lg font-medium
                  text-slate-900 dark:text-white
                  group-hover:text-primary
                  transition-colors duration-200
                ">
                  {item.title}
                </h3>
                <p className="
                  mt-1 text-sm
                  text-slate-500 dark:text-slate-400
                ">
                  最后编辑：{new Date(item.updatedAt).toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemList;