import React from 'react';
import { motion } from 'framer-motion';
import { Code, TrendingUp } from 'lucide-react';

interface LanguageChartProps {
  languages: Record<string, number>;
}

const LanguageChart: React.FC<LanguageChartProps> = ({ languages }) => {
  const sortedLanguages = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);

  const languageColors: Record<string, string> = {
    JavaScript: 'from-yellow-400 to-yellow-600',
    TypeScript: 'from-blue-400 to-blue-600',
    Python: 'from-green-400 to-green-600',
    Java: 'from-red-400 to-red-600',
    'C++': 'from-purple-400 to-purple-600',
    Go: 'from-cyan-400 to-cyan-600',
    Rust: 'from-orange-400 to-orange-600',
    PHP: 'from-indigo-400 to-indigo-600',
    Ruby: 'from-pink-400 to-pink-600',
    Swift: 'from-orange-500 to-red-500',
    Kotlin: 'from-purple-500 to-pink-500',
    Dart: 'from-blue-500 to-cyan-500',
  };

  const getLanguageColor = (language: string) => {
    return languageColors[language] || 'from-gray-400 to-gray-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
      className="bg-gray-800 border border-gray-700 rounded-md p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md flex items-center justify-center">
            <Code className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white font-mono">Language Distribution</h3>
            <p className="text-sm text-gray-400">Code composition across repositories</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <TrendingUp className="w-4 h-4 text-purple-400" />
          <span className="text-purple-400 font-medium font-mono">{sortedLanguages.length} languages</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {sortedLanguages.map(([language, bytes], index) => {
          const percentage = Math.round((bytes / totalBytes) * 100);
          const colorClass = getLanguageColor(language);
          
          return (
            <motion.div
              key={language}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-md bg-gradient-to-r ${colorClass}`}></div>
                  <span className="text-sm font-medium text-white group-hover:text-purple-400 transition-colors font-mono">
                    {language}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400 font-mono">
                    {(bytes / 1024).toFixed(1)}KB
                  </span>
                  <span className="text-sm font-medium text-white font-mono">
                    {percentage}%
                  </span>
                </div>
              </div>
              
              <div className="w-full h-2 bg-gray-700 rounded-md overflow-hidden border border-gray-600">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ 
                    delay: 0.5 + index * 0.1, 
                    duration: 0.8,
                    ease: 'easeOut'
                  }}
                  className={`h-full bg-gradient-to-r ${colorClass} rounded-md`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary stats */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-white font-mono">
              {(totalBytes / 1024 / 1024).toFixed(1)}MB
            </div>
            <div className="text-xs text-gray-400">Total Code</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white font-mono">
              {sortedLanguages[0]?.[0] || 'N/A'}
            </div>
            <div className="text-xs text-gray-400">Primary Language</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LanguageChart;