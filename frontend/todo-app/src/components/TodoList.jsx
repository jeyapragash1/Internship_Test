import React from 'react';
import TodoItem from './TodoItem.jsx';
import { motion, AnimatePresence } from 'framer-motion';

function TodoList({ todos, fetchTodos, loading }) {
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const skeletonVariants = {
    animation: {
      backgroundColor: ["#f3f4f6", "#e5e7eb", "#f3f4f6"],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-5 border-b pb-3 border-gray-200 dark:border-gray-700">Your Tasks</h2>
      <ul className="space-y-4">
        <AnimatePresence mode="wait">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <motion.li
                key={`skeleton-${index}`}
                className="p-4 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 h-20 flex flex-col justify-center space-y-2"
                variants={skeletonVariants}
                animate="animation"
              >
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
              </motion.li>
            ))
          ) : todos.length === 0 ? (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center text-gray-600 dark:text-gray-400 p-4"
            >
              No tasks found. Get started by adding a new one!
            </motion.p>
          ) : (
            <motion.div variants={listVariants} initial="hidden" animate="visible">
              {todos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} fetchTodos={fetchTodos} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </ul>
    </motion.div>
  );
}

export default TodoList;