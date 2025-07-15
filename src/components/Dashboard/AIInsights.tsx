import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Target, Award, Lightbulb } from 'lucide-react';
import { AIInsight } from '../../services/gemini';

interface AIInsightsProps {
  insights: AIInsight[];
  isLoading?: boolean;
}

const AIInsights: React.FC<AIInsightsProps> = ({ insights, isLoading }) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'skill':
        return Lightbulb;
      case 'trend':
        return TrendingUp;
      case 'opportunity':
        return Target;
      case 'achievement':
        return Award;
      default:
        return Brain;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'skill':
        return 'from-blue-500 to-purple-500';
      case 'trend':
        return 'from-green-500 to-teal-500';
      case 'opportunity':
        return 'from-yellow-500 to-orange-500';
      case 'achievement':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-md p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-6 h-6 text-purple-400 animate-pulse" />
          <h3 className="text-lg font-semibold text-white font-mono">AI Insights</h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-900 border border-gray-700 rounded-md p-4 animate-pulse">
              <div className="h-4 bg-gray-600 rounded-md w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded-md w-full mb-1"></div>
              <div className="h-3 bg-gray-700 rounded-md w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-gray-800 border border-gray-700 rounded-md p-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-white font-mono">AI-Powered Insights</h3>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = getInsightIcon(insight.type);
          const colorClass = getInsightColor(insight.type);
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-gray-900 border border-gray-700 rounded-md p-4 hover:bg-gray-900/70 transition-all duration-200"
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 bg-gradient-to-r ${colorClass} rounded-md flex-shrink-0`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-1 font-mono">{insight.title}</h4>
                  <p className="text-sm text-gray-300 mb-2">{insight.description}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md border border-blue-500/30 capitalize font-mono">
                      {insight.type}
                    </span>
                    <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-md border border-green-500/30 font-mono">
                      {Math.round(insight.confidence * 100)}% confidence
                    </span>
                    {insight.actionable && (
                      <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded-md border border-orange-500/30 font-mono">
                        Actionable
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default AIInsights;