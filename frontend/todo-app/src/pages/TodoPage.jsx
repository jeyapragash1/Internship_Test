import React, { useState, useEffect } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext.jsx';
import toast from 'react-hot-toast'; 
import TodoForm from '../components/TodoForm.jsx';
import FilterSearch from '../components/FilterSearch.jsx';
import TodoList from '../components/TodoList.jsx';
import DashboardStats from '../components/DashboardStats.jsx';

function TodoPage() {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/todos');
      setTodos(response.data);
      toast.success('Todos loaded successfully!'); 
    } catch (error) {
      console.error('Error fetching todos:', error);
      toast.error('Failed to load todos. Please try again.'); 
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSearchedTodos = todos.filter(todo => {
    if (filter === 'completed' && !todo.completed) return false;
    if (filter === 'active' && todo.completed) return false;

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const titleMatches = todo.title.toLowerCase().includes(lowerCaseSearchTerm);
    const descriptionMatches = todo.description && todo.description.toLowerCase().includes(lowerCaseSearchTerm);

    if (searchTerm && !titleMatches && !descriptionMatches) {
      return false;
    }
    return true;
  });

  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const pendingTodos = totalTodos - completedTodos;

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };


  return (
    <motion.div
      className="space-y-8"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      
      <motion.div
        variants={sectionVariants}
        className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-700 dark:to-indigo-800 text-white p-8 rounded-xl shadow-lg relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-pattern opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")'}}></div>
        <h2 className="text-4xl font-extrabold mb-2 relative z-10">Welcome, {user?.name || 'Intern'}!</h2>
        <p className="text-xl relative z-10">Here's your personal productivity dashboard.</p>
      </motion.div>

     
      <DashboardStats
        totalTodos={totalTodos}
        completedTodos={completedTodos}
        pendingTodos={pendingTodos}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <motion.div variants={sectionVariants} className="lg:col-span-1">
          <TodoForm fetchTodos={fetchTodos} />
        </motion.div>

        
        <motion.div variants={sectionVariants} className="lg:col-span-2">
          <FilterSearch
            filter={filter}
            setFilter={setFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <TodoList todos={filteredAndSearchedTodos} fetchTodos={fetchTodos} loading={loading} />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default TodoPage;