import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Users, Award, Calendar, Clock } from 'lucide-react';
import { ContributionStats } from '../../services/github';

interface AdvancedMetricsProps {
  stats: ContributionStats;
}

const AdvancedMetrics: React.FC<AdvancedMetricsProps> = ({ stats }) => {
  const metrics = [
    {
      title: 'Contribution Score',
      value: stats.contributionScore,
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
      description: 'Overall contribution activity',
    },
    {
      title: 'Impact Score',
      value: stats.impactScore,
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      description: 'Community impact and reach',
    },
    {
      title: 'Collaboration Score',
      value: stats.collaborationScore,
      icon: Users,
      color: 'from-green-500 to-teal-500',
      description: 'Team collaboration activity',
    },
    {
      title: 'Current Streak',
      value: `${stats.contributionStreak} days`,
      icon: Award,
      color: 'from-orange-500 to-red-500',
      description: 'Consecutive contribution days',
    },
    {
      title: 'Most Active Day',
      value: stats.mostActiveDay,
      icon: Calendar,
      color: 'from-indigo-500 to-purple-500',
      description: 'Peak activity day of week',
    },
    {
      title: 'Peak Hour',
      value: `${stats.mostActiveHour}:00`,
      icon: Clock,
      color: 'from-yellow-500 to-orange-500',
      description: 'Most productive time',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-gray-800 border border-gray-700 rounded-md p-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white font-mono">Advanced Analytics</h3>
          <p className="text-sm text-gray-400">Deep insights into your development patterns</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="bg-gray-900 border border-gray-700 rounded-md p-4 hover:border-gray-600 transition-all duration-200"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-8 h-8 bg-gradient-to-r ${metric.color} rounded-md flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white text-sm font-mono">{metric.title}</h4>
                  <p className="text-xs text-gray-500">{metric.description}</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1 font-mono">
                {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Language Breakdown */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <h4 className="text-sm font-medium text-white mb-4 font-mono">Top Languages by Usage</h4>
        <div className="space-y-3">
          {stats.topLanguages.slice(0, 5).map((lang, index) => (
            <div key={lang.name} className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-md bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <div className="flex-1 flex items-center justify-between">
                <span className="text-sm text-gray-300 font-mono">{lang.name}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-gray-700 rounded-md overflow-hidden border border-gray-600">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${lang.percentage}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8 text-right font-mono">{lang.percentage}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AdvancedMetrics;