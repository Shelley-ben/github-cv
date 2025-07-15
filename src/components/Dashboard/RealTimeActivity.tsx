import React from 'react';
import { motion } from 'framer-motion';
import { Activity, GitCommit, Clock, Zap } from 'lucide-react';
import { Commit } from '../../services/github';

interface RealTimeActivityProps {
  isLive: boolean;
  lastCommit?: Commit;
  totalContributions: number;
}

const RealTimeActivity: React.FC<RealTimeActivityProps> = ({ 
  isLive, 
  lastCommit, 
  totalContributions 
}) => {
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const commitDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - commitDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than an hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 border border-gray-700 rounded-md p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-md flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            {isLive && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-md"
              />
            )}
          </div>
          
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-white font-mono">Real-time Activity Monitor</h3>
              <div className="flex items-center space-x-1 px-2 py-1 bg-green-500/20 rounded-md border border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-md animate-pulse"></div>
                <span className="text-xs text-green-400 font-medium font-mono">LIVE</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Monitoring your GitHub activity in real-time
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-white font-mono">
            {totalContributions.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Total Contributions</div>
        </div>
      </div>

      {lastCommit && (
        <div className="mt-6 p-4 bg-gray-900 border border-gray-700 rounded-md">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-md flex items-center justify-center flex-shrink-0 border border-blue-500/30">
              <GitCommit className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-white font-mono">Latest Commit</span>
                <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md border border-blue-500/30 font-mono">
                  {lastCommit.repository.name}
                </span>
              </div>
              <p className="text-sm text-gray-300 truncate mb-2 font-mono">
                {lastCommit.commit.message}
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-500 font-mono">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{getTimeAgo(lastCommit.commit.author.date)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-3 h-3" />
                  <span>SHA: {lastCommit.sha.substring(0, 7)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RealTimeActivity;