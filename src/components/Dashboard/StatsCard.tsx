import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  trend?: string;
  delay?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  trend, 
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-gray-800 border border-gray-700 rounded-md p-6 hover:bg-gray-800/80 transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-md ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-md border border-green-500/30">
            {trend}
          </span>
        )}
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-white mb-1 font-mono">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
        <p className="text-gray-400 text-sm">{title}</p>
      </div>
    </motion.div>
  );
};

export default StatsCard;