import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

function LandingPage() {
  const { isAuthenticated } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Stagger animations for child elements
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-5xl md:text-7xl font-extrabold text-blue-600 dark:text-blue-400 mb-6 drop-shadow-lg"
        variants={itemVariants}
      >
        Welcome to TodoApp!
      </motion.h1>

      <motion.p
        className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-10 max-w-2xl"
        variants={itemVariants}
      >
        Organize your life, one task at a time. Your ultimate companion for productivity.
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row gap-4 mb-12"
        variants={containerVariants}
      >
        {!isAuthenticated ? (
          <>
            <motion.div variants={itemVariants}>
              <Link
                to="/register"
                className="block sm:inline-block px-8 py-4 bg-green-500 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-300"
              >
                Get Started - It's Free!
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link
                to="/login"
                className="block sm:inline-block px-8 py-4 bg-blue-500 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-300"
              >
                Already have an account? Login
              </Link>
            </motion.div>
          </>
        ) : (
          <motion.div variants={itemVariants}>
            <Link
              to="/todos"
              className="block sm:inline-block px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300"
            >
              Go to Your Todos
            </Link>
          </motion.div>
        )}
      </motion.div>

      {/* Feature highlights with animations */}
      <motion.div
        className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
        variants={containerVariants}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl"
          variants={itemVariants}
          whileHover={{ scale: 1.03, rotate: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Easy Task Management</h3>
          <p className="text-gray-600 dark:text-gray-400">Add, edit, and track your tasks effortlessly with a clean interface.</p>
        </motion.div>
        <motion.div
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl"
          variants={itemVariants}
          whileHover={{ scale: 1.03, rotate: -1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Stay Organized</h3>
          <p className="text-gray-600 dark:text-gray-400">Use filters and search to quickly find what you need, when you need it.</p>
        </motion.div>
        <motion.div
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl"
          variants={itemVariants}
          whileHover={{ scale: 1.03, rotate: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Beautiful & Responsive</h3>
          <p className="text-gray-600 dark:text-gray-400">Enjoy a modern design that adapts to any screen size, with dark mode support.</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default LandingPage;