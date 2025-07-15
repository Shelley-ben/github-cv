import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp } from 'lucide-react';

interface ContributionDay {
  date: string;
  contributionCount: number;
  weekday: number;
}

interface ContributionHeatmapProps {
  weeks: Array<{
    contributionDays: ContributionDay[];
  }>;
  totalContributions: number;
}

const ContributionHeatmap: React.FC<ContributionHeatmapProps> = ({ 
  weeks, 
  totalContributions 
}) => {
  const getColorIntensity = (count: number): string => {
    if (count === 0) return 'bg-gray-800 border-gray-700';
    if (count <= 2) return 'bg-green-900 border-green-800';
    if (count <= 5) return 'bg-green-700 border-green-600';
    if (count <= 10) return 'bg-green-500 border-green-400';
    return 'bg-green-300 border-green-200';
  };

  const getContributionLevel = (count: number): string => {
    if (count === 0) return 'No contributions';
    if (count <= 2) return 'Low activity';
    if (count <= 5) return 'Moderate activity';
    if (count <= 10) return 'High activity';
    return 'Very high activity';
  };

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate current month for highlighting
  const currentMonth = new Date().getMonth();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      className="bg-gray-800 border border-gray-700 rounded-md p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-md flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white font-mono">Contribution Activity</h3>
            <p className="text-sm text-gray-400">
              <span className="text-green-400 font-mono">{totalContributions.toLocaleString()}</span> contributions in the last year
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-green-400 font-medium font-mono">+12% this month</span>
        </div>
      </div>
      
      {/* Month labels */}
      <div className="flex justify-between mb-2 px-4">
        {monthLabels.map((month, index) => (
          <span 
            key={month} 
            className={`text-xs font-mono ${index === currentMonth ? 'text-green-400 font-medium' : 'text-gray-500'}`}
          >
            {month}
          </span>
        ))}
      </div>
      
      <div className="flex">
        {/* Day labels */}
        <div className="flex flex-col justify-between mr-3 py-1">
          {dayLabels.map((day, index) => (
            <span key={day} className={`text-xs text-gray-500 font-mono ${index % 2 === 0 ? '' : 'opacity-0'}`}>
              {day}
            </span>
          ))}
        </div>
        
        {/* Heatmap grid */}
        <div className="overflow-x-auto flex-1">
          <div className="flex gap-1 min-w-max">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.contributionDays.map((day, dayIndex) => (
                  <motion.div
                    key={`${weekIndex}-${dayIndex}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: (weekIndex * 7 + dayIndex) * 0.002,
                      type: 'spring',
                      stiffness: 300,
                      damping: 20
                    }}
                    whileHover={{ scale: 1.2, zIndex: 10 }}
                    className={`w-3 h-3 rounded-sm border ${getColorIntensity(day.contributionCount)} cursor-pointer transition-all duration-200`}
                    title={`${day.contributionCount} contributions on ${new Date(day.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })} - ${getContributionLevel(day.contributionCount)}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center text-xs text-gray-400 font-mono">
          <span className="mr-2">Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-gray-800 border border-gray-700 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-900 border border-green-800 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-700 border border-green-600 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-500 border border-green-400 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-300 border border-green-200 rounded-sm"></div>
          </div>
          <span className="ml-2">More</span>
        </div>
        
        <div className="text-xs text-gray-500 font-mono">
          Learn how we count contributions
        </div>
      </div>
    </motion.div>
  );
};

export default ContributionHeatmap;