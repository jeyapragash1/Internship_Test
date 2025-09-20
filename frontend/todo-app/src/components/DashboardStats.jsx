import React from 'react';
import { motion } from 'framer-motion';

const statCardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  hover: { scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.15)" }
};


function DashboardStats({ totalTodos, completedTodos, pendingTodos }) {
  const stats = [
    { label: "Total Tasks", value: totalTodos, icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ) },
    { label: "Completed", value: completedTodos, icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ) },
    { label: "Pending", value: pendingTodos, icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-yellow-500 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ) },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex items-center space-x-4 border border-gray-100 dark:border-gray-700"
          variants={statCardVariants}
          whileHover="hover"
          initial="hidden"
          animate="visible"
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex-shrink-0 p-3 rounded-full bg-gray-100 dark:bg-gray-700">
            {stat.icon}
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default DashboardStats;