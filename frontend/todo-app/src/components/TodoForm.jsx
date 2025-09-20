import React, { useState } from 'react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast'; // <--- Import toast

function TodoForm({ fetchTodos }) {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [submitError, setSubmitError] = useState('');

  const handleAddTodo = async (e) => {
    e.preventDefault();
    setTitleError('');
    setSubmitError('');

    if (!newTodoTitle.trim()) {
      setTitleError('Task title cannot be empty.');
      return;
    }
    if (newTodoTitle.trim().length < 3) {
        setTitleError('Task title must be at least 3 characters.');
        return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/todos', {
        title: newTodoTitle.trim(),
        description: newTodoDescription.trim(),
        completed: false,
      });
      setNewTodoTitle('');
      setNewTodoDescription('');
      fetchTodos();
      toast.success('Task added successfully!'); // <--- Toast
    } catch (error) {
      console.error('Error adding todo:', error);
      const errorMessage = error.response?.data?.errors ? Object.values(error.response.data.errors).flat().join(' ') : (error.response?.data?.message || 'Failed to add task. Please try again.');
      setSubmitError(errorMessage); // Display specific backend validation errors
      toast.error(errorMessage); // <--- Toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleAddTodo}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.3 }}
      className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-5 border-b pb-3 border-gray-200 dark:border-gray-700">Quick Add Task</h2>
      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Task Title (e.g., 'Buy groceries')"
            value={newTodoTitle}
            onChange={(e) => {
              setNewTodoTitle(e.target.value);
              setTitleError('');
            }}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${titleError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200 text-base`}
            required
            disabled={isSubmitting}
          />
          <AnimatePresence>
            {titleError && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-500 text-sm mt-1"
              >
                {titleError}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <textarea
          placeholder="Description (e.g., 'Milk, eggs, bread')"
          value={newTodoDescription}
          onChange={(e) => setNewTodoDescription(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200 text-base"
          rows="3"
          disabled={isSubmitting}
        ></textarea>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold text-lg flex items-center justify-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting && (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
            ></motion.span>
          )}
          {isSubmitting ? 'Adding...' : 'Add Task'}
        </motion.button>
        <AnimatePresence>
          {submitError && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-red-500 text-sm mt-2 text-center"
            >
              {submitError}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.form>
  );
}

export default TodoForm;