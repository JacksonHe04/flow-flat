import React, { useState, useCallback } from 'react';
import { type NodeProps, type Node } from '@xyflow/react';
import { useNodeStore } from '@/stores/nodeStore';
import NodeContainer from './NodeContainer';
import NodeHeader from './NodeHeader';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoNodeData extends Record<string, unknown> {
  title?: string;
  todos?: TodoItem[];
  onDelete?: () => void;
}

/**
 * 待办节点组件
 */
const TodoNode: React.FC<NodeProps<Node<TodoNodeData>>> = ({ id, data, selected }) => {
  const { updateNodeData } = useNodeStore();
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
    if (title !== data?.title || JSON.stringify(todos) !== JSON.stringify(data?.todos)) {
      updateNodeData(id, { title, todos });
    }
  }, [id, title, todos, data?.title, data?.todos, updateNodeData]);

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
        setTodos(prev => [...prev, newTodo]);
        setNewTodoText('');
      }
    }
    e.stopPropagation();
  }, [newTodoText]);

  const handleTitleChange = useCallback((newTitle: string) => {
    setTitle(newTitle);
    if (newTitle !== data?.title) {
      updateNodeData(id, { title: newTitle, todos });
    }
  }, [id, todos, data?.title, updateNodeData]);

  /**
   * 切换待办事项完成状态
   */
  const toggleTodo = useCallback((todoId: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []);

  /**
   * 删除待办事项
   */
  const deleteTodo = useCallback((todoId: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== todoId));
  }, []);

  /**
   * 编辑待办事项文本
   */
  const updateTodoText = useCallback((todoId: string, newText: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === todoId ? { ...todo, text: newText } : todo
    ));
  }, []);

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
      setTodos(prev => [...prev, newTodo]);
      setNewTodoText('');
    }
  }, [newTodoText]);

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <NodeContainer 
      selected={selected} 
      onDelete={data?.onDelete}
    >
      <NodeHeader
        nodeType="todo"
        title={title}
        onTitleChange={handleTitleChange}
      />
      
      {/* 进度显示 */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {completedCount}/{totalCount} 已完成
        </span>
      </div>
      
      {/* 进度条 */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-3">
        <div 
          className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
        />
      </div>
      
      {/* 待办事项列表 */}
      <div className="space-y-1 max-h-32 overflow-y-auto">
        {todos.map(todo => (
          <div key={todo.id} className="flex items-center group/item">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="mr-2 w-3 h-3"
            />
            <span 
              className={`
                flex-1 text-xs cursor-pointer
                ${todo.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}
              `}
              onDoubleClick={(e) => {
                e.stopPropagation();
                const newText = prompt('编辑待办事项:', todo.text);
                if (newText !== null && newText.trim()) {
                  updateTodoText(todo.id, newText.trim());
                }
              }}
            >
              {todo.text}
            </span>
            <button
              className="
                ml-1 w-4 h-4 text-red-500 hover:text-red-700
                opacity-0 group-hover/item:opacity-100
                transition-opacity duration-200
              "
              onClick={() => deleteTodo(todo.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      
      {/* 添加新待办事项 */}
      <div className="mt-2 flex items-center">
        <input
          className="
            flex-1 bg-transparent border-b border-gray-300 dark:border-gray-600
            text-xs py-1 focus:outline-none focus:border-blue-500
            dark:text-white
          "
          placeholder="添加新待办事项..."
          value={newTodoText}
          onChange={e => setNewTodoText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
        <button
          className="
            ml-2 w-6 h-6 bg-blue-500 text-white rounded
            hover:bg-blue-600 transition-colors duration-200
            flex items-center justify-center text-xs
          "
          onClick={addTodo}
        >
          +
        </button>
      </div>
    </NodeContainer>
  );
};

export default TodoNode;