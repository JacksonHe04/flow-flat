import React, { useState, useCallback } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { useNodeStore } from '@/stores/nodeStore';

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
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data?.title || '待办清单');
  const [todos, setTodos] = useState<TodoItem[]>(data?.todos || [
    { id: '1', text: '示例待办事项1', completed: false },
    { id: '2', text: '示例待办事项2', completed: true }
  ]);
  const [newTodoText, setNewTodoText] = useState('');

  /**
   * 处理双击编辑
   */
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  /**
   * 处理失去焦点，保存内容
   */
  const handleBlur = useCallback(() => {
    setIsEditing(false);
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

  /**
   * 处理删除节点
   */
  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    data?.onDelete?.();
  }, [data]);

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
    <div className={`card card-hover ${selected ? 'border-primary' : ''} relative group`}>
      {/* 连接点 */}
      <Handle 
        type="target" 
        position={Position.Left} 
        id="input" 
        className="w-3 h-3 bg-blue-500 border-2 border-white" 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="output" 
        className="w-3 h-3 bg-green-500 border-2 border-white" 
      />
      
      {/* 删除按钮 */}
      <button
        className="
          absolute -top-2 -right-2 w-6 h-6
          bg-error text-white rounded-full
          opacity-0 group-hover:opacity-100
          hover:bg-red-600 transition-all duration-200
          flex items-center justify-center
        "
        onClick={handleDelete}
      >
        ×
      </button>

      {/* 节点内容 */}
      <div className="w-full h-full p-2">
        {/* 标题和进度 */}
        <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-1">✅</span>
            {isEditing ? (
              <input
                className="bg-transparent border-none outline-none flex-1"
                value={title}
                onChange={e => setTitle(e.target.value)}
                onBlur={handleBlur}
              />
            ) : (
              <span onDoubleClick={handleDoubleClick}>{title}</span>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {completedCount}/{totalCount}
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
      </div>
    </div>
  );
};

export default TodoNode;