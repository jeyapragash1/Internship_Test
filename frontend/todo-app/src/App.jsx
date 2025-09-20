import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import TodoPage from './pages/TodoPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import { useTheme } from './contexts/ThemeContext.jsx';
import { useAuth } from './contexts/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 font-sans`}>
      <nav className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center fixed w-full z-10">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-500 transition-colors duration-200">
            TodoApp
          </Link>
          {isAuthenticated && ( // Show Todos link only if authenticated
            <Link to="/todos" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
              My Todos
            </Link>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="text-gray-700 dark:text-gray-300">Hello, {user?.name || 'User'}!</span>
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition duration-300"
              >
                Logout
              </motion.button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition duration-300">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition duration-300">
                Register
              </Link>
            </>
          )}
          <AnimatePresence mode="wait">
            <motion.button
              onClick={toggleTheme}
              key={theme} // Key prop to trigger re-animation on theme change
              initial={{ rotate: -90, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              exit={{ rotate: 90, scale: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
              title="Toggle Theme"
            >
              {theme === 'light' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </motion.button>
          </AnimatePresence>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 pt-20"> {/* pt-20 to push content below fixed navbar */}
        <Routes>
          <Route path="/" element={<LandingPage />} /> {/* New Landing Page as default */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Protected route for Todos */}
          {isAuthenticated ? (
            <Route path="/todos" element={<TodoPage />} />
          ) : (
            <Route path="/todos" element={<LoginPage />} /> // Redirect to login if not authenticated
          )}
        </Routes>
      </main>
    </div>
  );
}

export default App;