import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideCheck, LucideTrash, LucidePlus, LucideCheckCircle2, LucideCalendar, LucideSun, LucideMoon, LucideList } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn, generateId, formatDate } from './lib/utils';
import { Todo, TodoFilter } from './types';

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true';
  });

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode.toString());
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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
      todos.map(todo => {
        if (todo.id === id) {
          const newStatus = !todo.completed;
          // Show toast based on new status
          if (newStatus) {
            toast.success('Task completed! 🎉');
          }
          return { ...todo, completed: newStatus };
        }
        return todo;
      })
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

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  // Item animation variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      }
    },
    exit: { 
      opacity: 0, 
      x: -20, 
      transition: { duration: 0.2 } 
    }
  };

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      isDarkMode 
        ? "bg-gradient-to-br from-gray-900 to-gray-800" 
        : "bg-gradient-to-br from-blue-50 to-indigo-100"
    )}>
      <div className="container mx-auto max-w-md px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "rounded-xl overflow-hidden shadow-2xl",
            isDarkMode ? "bg-gray-800" : "bg-white"
          )}
        >
          <header className={cn(
            "p-6 relative overflow-hidden",
            isDarkMode ? "bg-indigo-600" : "bg-gradient-to-r from-blue-500 to-indigo-600"
          )}>
            <div className="absolute top-0 right-0 p-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="text-white opacity-80 hover:opacity-100 transition-opacity"
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? <LucideSun size={20} /> : <LucideMoon size={20} />}
              </motion.button>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-2xl font-bold text-white mb-1">My Tasks</h1>
              <p className="text-indigo-100 opacity-90">
                {activeTodosCount === 0 
                  ? "All caught up! 🎉" 
                  : activeTodosCount === 1 
                    ? "1 task remaining" 
                    : `${activeTodosCount} tasks remaining`}
              </p>
            </motion.div>
            
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-400/20 rounded-full blur-xl"></div>
          </header>

          <div className={cn(
            "p-6 transition-colors duration-300",
            isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"
          )}>
            <motion.div 
              className={cn(
                "relative flex items-center mb-6",
                isInputFocused && "ring-2 ring-indigo-500 rounded-lg"
              )}
              animate={{ scale: isInputFocused ? 1.02 : 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <input
                type="text"
                placeholder="Add a new task..."
                className={cn(
                  "w-full p-3 pr-12 rounded-lg focus:outline-none transition-colors duration-300",
                  isDarkMode 
                    ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400" 
                    : "bg-gray-50 text-gray-800 border-gray-200 placeholder-gray-400"
                )}
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
              />
              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "absolute right-2 p-2 rounded-md",
                  isDarkMode 
                    ? "bg-indigo-600 text-white hover:bg-indigo-500" 
                    : "bg-indigo-500 text-white hover:bg-indigo-600"
                )}
                onClick={addTodo}
                aria-label="Add task"
              >
                <LucidePlus size={18} />
              </motion.button>
            </motion.div>

            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-1 text-sm bg-opacity-10 rounded-lg p-1">
                {(['all', 'active', 'completed'] as const).map((filterType) => (
                  <motion.button
                    key={filterType}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                    className={cn(
                      "px-3 py-1.5 rounded-md transition-all duration-200 capitalize",
                      filter === filterType 
                        ? isDarkMode 
                          ? "bg-indigo-600 text-white" 
                          : "bg-indigo-500 text-white"
                        : isDarkMode 
                          ? "text-gray-300 hover:bg-gray-700" 
                          : "text-gray-600 hover:bg-gray-100"
                    )}
                    onClick={() => setFilter(filterType)}
                  >
                    {filterType}
                    <span className="ml-1 text-xs opacity-80">
                      ({filterType === 'all' 
                        ? todos.length 
                        : filterType === 'active' 
                          ? activeTodosCount 
                          : completedTodosCount})
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.div 
              className="space-y-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence mode="popLayout">
                {filteredTodos.length > 0 ? (
                  filteredTodos.map((todo) => (
                    <motion.div
                      key={todo.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      className={cn(
                        "group flex items-center justify-between p-3 rounded-lg transition-all duration-300",
                        todo.completed 
                          ? isDarkMode 
                            ? "bg-gray-700/50 border-l-4 border-green-500" 
                            : "bg-gray-50 border-l-4 border-green-500"
                          : isDarkMode 
                            ? "bg-gray-700 hover:bg-gray-600 border-l-4 border-indigo-500" 
                            : "bg-white hover:bg-gray-50 shadow-sm border-l-4 border-indigo-500"
                      )}
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleTodo(todo.id)}
                          className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center border transition-colors",
                            todo.completed 
                              ? isDarkMode 
                                ? "bg-green-500 border-green-500 text-white" 
                                : "bg-green-500 border-green-500 text-white"
                              : isDarkMode 
                                ? "border-gray-500 hover:border-indigo-400" 
                                : "border-gray-300 hover:border-indigo-500"
                          )}
                          aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
                        >
                          {todo.completed && <LucideCheck size={12} />}
                        </motion.button>
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "text-sm sm:text-base transition-all duration-300 truncate",
                            todo.completed && "line-through opacity-70"
                          )}>
                            {todo.text}
                          </p>
                          <div className="flex items-center mt-1 text-xs">
                            <LucideCalendar size={12} className={cn(
                              "mr-1",
                              isDarkMode ? "text-gray-400" : "text-gray-400"
                            )} />
                            <span className={isDarkMode ? "text-gray-400" : "text-gray-400"}>
                              {formatDate(todo.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteTodo(todo.id)}
                        className={cn(
                          "p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100",
                          isDarkMode 
                            ? "text-gray-400 hover:text-red-400 hover:bg-gray-700" 
                            : "text-gray-400 hover:text-red-500 hover:bg-gray-100"
                        )}
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
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-center justify-center py-10 text-center"
                  >
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        delay: 0.3
                      }}
                      className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center mb-4",
                        isDarkMode ? "bg-gray-700" : "bg-indigo-100"
                      )}
                    >
                      {filter === 'all' ? (
                        <LucideList size={32} className={isDarkMode ? "text-gray-400" : "text-indigo-400"} />
                      ) : filter === 'active' ? (
                        <LucideSun size={32} className={isDarkMode ? "text-gray-400" : "text-indigo-400"} />
                      ) : (
                        <LucideCheckCircle2 size={32} className={isDarkMode ? "text-gray-400" : "text-indigo-400"} />
                      )}
                    </motion.div>
                    <h3 className={cn(
                      "text-lg font-medium mb-1",
                      isDarkMode ? "text-gray-200" : "text-gray-700"
                    )}>
                      {filter === 'all' 
                        ? "No tasks yet" 
                        : filter === 'active' 
                          ? "No active tasks" 
                          : "No completed tasks"}
                    </h3>
                    <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                      {filter === 'all' 
                        ? "Add a new task to get started" 
                        : filter === 'active' 
                          ? "All tasks are completed" 
                          : "Complete a task to see it here"}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className={cn(
            "text-sm",
            isDarkMode ? "text-gray-400" : "text-gray-500"
          )}>
            Made with ❤️ by Blink
          </p>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;