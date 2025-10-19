
import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../ui/Icon';

const TypingIndicator: React.FC = () => {
  const dotVariants = {
    initial: {
      y: 0,
    },
    animate: {
      y: [0, -4, 0],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-4 p-4 md:p-6"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-600">
        <Icon name="bot" className="w-5 h-5 text-white" />
      </div>
      <div className="flex items-center gap-1.5 pt-3">
        <motion.div variants={dotVariants} initial="initial" animate="animate" className="w-2 h-2 bg-gray-400 rounded-full" style={{ animationDelay: '0s' }} />
        <motion.div variants={dotVariants} initial="initial" animate="animate" className="w-2 h-2 bg-gray-400 rounded-full" style={{ animationDelay: '0.2s' }} />
        <motion.div variants={dotVariants} initial="initial" animate="animate" className="w-2 h-2 bg-gray-400 rounded-full" style={{ animationDelay: '0.4s' }} />
      </div>
    </motion.div>
  );
};

export default TypingIndicator;
