import React, { useState } from 'react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmationModal from './ConfirmationModal.jsx';
import toast from 'react-hot-toast';

function TodoItem({ todo, fetchTodos }) {
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editTodoTitle, setEditTodoTitle] = useState(todo.title);
  const [editTodoDescription, setEditTodoDescription] = useState(todo.description || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteTodo = async (id) => {
    setIsDeleting(true);
    try {
      await api.delete(`/todos/${id}`);
      fetchTodos();
      toast.success(`Task "${todo.title}" deleted.`); 
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast.error('Failed to delete task.'); 
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleToggleComplete = async (todoItem) => {
    setIsUpdating(true);
    try {
      await api.put(`/todos/${todoItem.id}`, {
        ...todoItem,
        completed: !todoItem.completed,
      });
      fetchTodos();
      toast.success(`Task "${todoItem.title}" marked as ${!todoItem.completed ? 'completed' : 'active'}.`); 
    } catch (error) {
      console.error('Error toggling todo status:', error);
      toast.error('Failed to update task status.'); 
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditClick = (todoItem) => {
    setEditingTodoId(todoItem.id);
    setEditTodoTitle(todoItem.title);
    setEditTodoDescription(todoItem.description || '');
  };

  const handleSaveEdit = async (id) => {
    setIsUpdating(true);
    try {
      await api.put(`/todos/${id}`, {
        title: editTodoTitle,
        description: editTodoDescription,
      });
      setEditingTodoId(null);
      fetchTodos();
      toast.success(`Task "${editTodoTitle}" updated successfully.`); 
    } catch (error) {
      console.error('Error saving todo:', error);
      toast.error('Failed to save task.'); 
    } finally {
      setIsUpdating(false);
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
  };

  return (
    <>
      <motion.li
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        layout
        className={`relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg shadow-sm
          ${todo.completed ? 'bg-green-50 dark:bg-green-900 border-green-100 dark:border-green-800' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'}
          transition-all duration-300 ease-in-out group`}
      >
        {isUpdating && (
          <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-75 rounded-lg z-10">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"
            ></motion.span>
          </div>
        )}

        {editingTodoId === todo.id ? (
          <div className="flex-grow flex flex-col gap-2 w-full">
            <input
              type="text"
              value={editTodoTitle}
              onChange={(e) => setEditTodoTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              disabled={isUpdating}
            />
            <textarea
              value={editTodoDescription}
              onChange={(e) => setEditTodoDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              rows="2"
              disabled={isUpdating}
            ></textarea>
            <div className="flex gap-2 mt-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSaveEdit(todo.id)}
                className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-300 text-sm font-semibold"
                disabled={isUpdating}
              >
                Save
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditingTodoId(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition duration-300 text-sm font-semibold"
                disabled={isUpdating}
              >
                Cancel
              </motion.button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start flex-grow w-full">
              <motion.input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo)}
                className="mr-3 mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-500 dark:border-gray-400 transition-colors duration-200 cursor-pointer flex-shrink-0"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={isUpdating}
              />
              <div className="flex flex-col flex-grow">
                <span className={`text-lg font-semibold ${todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-white'} transition-colors duration-200`}>
                  {todo.title}
                </span>
                {todo.description && (
                  <p className={`text-sm text-gray-600 ${todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'dark:text-gray-300'} transition-colors duration-200 mt-1`}>
                    {todo.description}
                  </p>
                )}
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0 flex gap-2 mt-3 sm:mt-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEditClick(todo)}
                className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300 text-sm font-semibold"
                disabled={isUpdating || isDeleting}
              >
                Edit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 text-sm font-semibold"
                disabled={isDeleting || isUpdating}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </motion.button>
            </motion.div>
          </>
        )}
      </motion.li>

      <ConfirmationModal
        show={showDeleteConfirm}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the task "${todo.title}"? This action cannot be undone.`}
        onConfirm={() => handleDeleteTodo(todo.id)}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}

export default TodoItem;