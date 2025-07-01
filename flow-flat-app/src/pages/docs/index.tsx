import React from "react";

/**
 * 文档页面组件
 * 嵌入 Notion 文档页面
 */
const Docs: React.FC = () => {
  const notionUrl = "https://jacksonhe.notion.site/flow-flat";

  return (
    <div className="docs-container h-full w-full">
      <div className="docs-header p-4 border-b border-slate-200 text-center">
        <h1 className="text-2xl font-bold">Flow Flat 文档</h1>
        <p className="text-gray-600 mt-2 mb-0">
          查看完整文档请访问：
          <a
            href={notionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1"
          >
            Notion 文档页面
          </a>
        </p>
      </div>

      <div className="docs-content h-full">
        <iframe
          src="https://jacksonhe.notion.site/ebd/212a90d90b9780c4a085d9190acf81cf"
          width="100%"
          height="600"
        />
      </div>
    </div>
  );
};

export default Docs;
