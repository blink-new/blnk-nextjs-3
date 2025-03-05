import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideCheck, LucideTrash, LucidePlus, LucideX, LucideCheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn, generateId, formatDate } from './lib/utils';
import { Todo, TodoFilter } from './types';

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        // Parse the JSON and convert string dates back to Date objects
        return JSON.parse(savedTodos, (key, value) => 
          key === 'createdAt' ? new Date(value) : value
        );
      } catch (e) {
        console.error('Failed to parse todos from localStorage', e);
        return [];
      }
    }
    return [];
  });
  
  const [newTodoText, setNewTodoText] = useState('');
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!newTodoText.trim()) {
      toast.error('Task cannot be empty');
      return;
    }
    
    const newTodo: Todo = {
      id: generateId(),
      text: newTodoText.trim(),
      completed: false,
      createdAt: new Date(),
    };
    
    setTodos([newTodo, ...todos]);
    setNewTodoText('');
    toast.success('Task added');
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast.success('Task deleted');
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <header className="bg-primary-600 text-white p-6">
          <h1 className="text-2xl font-bold">Todo App</h1>
          <p className="text-primary-100 mt-1">Keep track of your tasks</p>
        </header>

        <div className="p-6">
          <div className="flex mb-4">
            <motion.div 
              className={cn(
                "relative flex-1 flex items-center",
                isInputFocused && "ring-2 ring-primary-500 rounded-md"
              )}
              animate={{ scale: isInputFocused ? 1.02 : 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <input
                type="text"
                placeholder="Add a new task..."
                className="w-full p-3 pr-10 border border-secondary-200 rounded-md focus:outline-none"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-2 p-1 text-primary-600 hover:text-primary-800"
                onClick={addTodo}
                aria-label="Add task"
              >
                <LucidePlus size={20} />
              </motion.button>
            </motion.div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-1 text-sm">
              <button
                className={cn(
                  "px-3 py-1 rounded-md transition-colors",
                  filter === 'all' 
                    ? "bg-primary-600 text-white" 
                    : "text-secondary-600 hover:bg-secondary-100"
                )}
                onClick={() => setFilter('all')}
              >
                All ({todos.length})
              </button>
              <button
                className={cn(
                  "px-3 py-1 rounded-md transition-colors",
                  filter === 'active' 
                    ? "bg-primary-600 text-white" 
                    : "text-secondary-600 hover:bg-secondary-100"
                )}
                onClick={() => setFilter('active')}
              >
                Active ({activeTodosCount})
              </button>
              <button
                className={cn(
                  "px-3 py-1 rounded-md transition-colors",
                  filter === 'completed' 
                    ? "bg-primary-600 text-white" 
                    : "text-secondary-600 hover:bg-secondary-100"
                )}
                onClick={() => setFilter('completed')}
              >
                Completed ({completedTodosCount})
              </button>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <AnimatePresence>
              {filteredTodos.length > 0 ? (
                filteredTodos.map((todo) => (
                  <motion.div
                    key={todo.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={cn(
                      "group flex items-center justify-between p-3 border rounded-md transition-colors",
                      todo.completed 
                        ? "bg-secondary-50 border-secondary-200" 
                        : "bg-white border-secondary-200 hover:border-primary-300"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center border transition-colors",
                          todo.completed 
                            ? "bg-primary-500 border-primary-500 text-white" 
                            : "border-secondary-300 hover:border-primary-500"
                        )}
                        aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
                      >
                        {todo.completed && <LucideCheck size={12} />}
                      </button>
                      <div>
                        <p className={cn(
                          "text-secondary-800 transition-all",
                          todo.completed && "line-through text-secondary-500"
                        )}>
                          {todo.text}
                        </p>
                        <p className="text-xs text-secondary-400 mt-1">
                          {formatDate(todo.createdAt)}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => deleteTodo(todo.id)}
                      className="text-secondary-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      aria-label="Delete task"
                    >
                      <LucideTrash size={16} />
                    </motion.button>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
                    <LucideCheckCircle2 size={32} className="text-secondary-400" />
                  </div>
                  <h3 className="text-lg font-medium text-secondary-700">
                    {filter === 'all' 
                      ? "No tasks yet" 
                      : filter === 'active' 
                        ? "No active tasks" 
                        : "No completed tasks"}
                  </h3>
                  <p className="text-secondary-500 mt-1">
                    {filter === 'all' 
                      ? "Add a new task to get started" 
                      : filter === 'active' 
                        ? "All tasks are completed" 
                        : "Complete a task to see it here"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
      
      <footer className="mt-8 text-secondary-500 text-sm">
        <p>Made with ❤️ by Blink</p>
      </footer>
    </div>
  );
}

export default App;