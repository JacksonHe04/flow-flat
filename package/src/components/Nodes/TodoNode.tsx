import React, { useState, useCallback } from 'react';
import { type NodeProps, type Node } from '@xyflow/react';
import { type BaseNodeData } from '../../types';
import NodeContainer from '../NodeLayout/NodeContainer';
import NodeHeader from '../NodeLayout/NodeHeader';

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface TodoNodeData extends BaseNodeData {
  title?: string;
  todos?: TodoItem[];
}

/**
 * 待办节点组件
 */
const TodoNode: React.FC<NodeProps<Node<TodoNodeData>>> = ({ id, data, selected }) => {
  const [title, setTitle] = useState(data?.title || '待办清单');
  const [todos, setTodos] = useState<TodoItem[]>(data?.todos || [
    { id: '1', text: '示例待办事项1', completed: false },
    { id: '2', text: '示例待办事项2', completed: true }
  ]);
  const [newTodoText, setNewTodoText] = useState('');

  /**
   * 处理失去焦点，保存内容
   */
  const handleBlur = useCallback(() => {
    if (data?.onDataChange) {
      data.onDataChange(id, { title, todos });
    }
  }, [id, title, todos, data]);

  /**
   * 处理键盘事件
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (newTodoText.trim()) {
        const newTodo: TodoItem = {
          id: Date.now().toString(),
          text: newTodoText.trim(),
          completed: false
        };
        const newTodos = [...todos, newTodo];
        setTodos(newTodos);
        setNewTodoText('');
        if (data?.onDataChange) {
          data.onDataChange(id, { title, todos: newTodos });
        }
      }
    }
    e.stopPropagation();
  }, [newTodoText, todos, id, title, data]);

  const handleTitleChange = useCallback((newTitle: string) => {
    setTitle(newTitle);
    if (data?.onDataChange) {
      data.onDataChange(id, { title: newTitle, todos });
    }
  }, [id, todos, data]);

  /**
   * 切换待办事项完成状态
   */
  const toggleTodo = useCallback((todoId: string) => {
    const newTodos = todos.map(todo => 
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(newTodos);
    if (data?.onDataChange) {
      data.onDataChange(id, { title, todos: newTodos });
    }
  }, [id, title, todos, data]);

  /**
   * 删除待办事项
   */
  const deleteTodo = useCallback((todoId: string) => {
    const newTodos = todos.filter(todo => todo.id !== todoId);
    setTodos(newTodos);
    if (data?.onDataChange) {
      data.onDataChange(id, { title, todos: newTodos });
    }
  }, [id, title, todos, data]);

  /**
   * 编辑待办事项文本
   */
  const updateTodoText = useCallback((todoId: string, newText: string) => {
    const newTodos = todos.map(todo => 
      todo.id === todoId ? { ...todo, text: newText } : todo
    );
    setTodos(newTodos);
    if (data?.onDataChange) {
      data.onDataChange(id, { title, todos: newTodos });
    }
  }, [id, title, todos, data]);

  /**
   * 添加新待办事项
   */
  const addTodo = useCallback(() => {
    if (newTodoText.trim()) {
      const newTodo: TodoItem = {
        id: Date.now().toString(),
        text: newTodoText.trim(),
        completed: false
      };
      const newTodos = [...todos, newTodo];
      setTodos(newTodos);
      setNewTodoText('');
      if (data?.onDataChange) {
        data.onDataChange(id, { title, todos: newTodos });
      }
    }
  }, [newTodoText, todos, id, title, data]);

  /**
   * 计算完成进度
   */
  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <NodeContainer 
      selected={selected} 
      onDelete={data?.onDelete}
      className="min-w-[300px]"
    >
      <NodeHeader
        nodeType="todo"
        title={title}
        onTitleChange={handleTitleChange}
      />
      
      {/* 进度条 */}
      <div className="px-3 pt-2">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>进度</span>
          <span>{completedCount}/{totalCount}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      {/* 待办事项列表 */}
      <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
        {todos.map((todo) => (
          <div key={todo.id} className="flex items-center gap-2 group">
            {/* 复选框 */}
            <button
              onClick={() => toggleTodo(todo.id)}
              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                todo.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
              }`}
            >
              {todo.completed && (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            
            {/* 待办事项文本 */}
            <input
              type="text"
              value={todo.text}
              onChange={(e) => updateTodoText(todo.id, e.target.value)}
              onBlur={handleBlur}
              className={`flex-1 bg-transparent border-none outline-none text-sm ${
                todo.completed
                  ? 'line-through text-gray-500 dark:text-gray-400'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
              placeholder="输入待办事项"
            />
            
            {/* 删除按钮 */}
            <button
              onClick={() => deleteTodo(todo.id)}
              className="w-4 h-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            >
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
        
        {/* 添加新待办事项 */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="w-4 h-4 rounded border-2 border-dashed border-gray-300 dark:border-gray-600" />
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder="添加新的待办事项"
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500"
          />
          {newTodoText.trim() && (
            <button
              onClick={addTodo}
              className="w-4 h-4 text-green-500 hover:text-green-600 transition-colors"
            >
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </NodeContainer>
  );
};

export default TodoNode;