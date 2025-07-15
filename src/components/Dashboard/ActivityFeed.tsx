import React from 'react';
import { motion } from 'framer-motion';
import { Activity, GitCommit, GitPullRequest, AlertCircle, FolderPlus } from 'lucide-react';

interface TimelineItem {
  date: string;
  type: 'commit' | 'pr' | 'issue' | 'repo';
  count: number;
  details: any;
}

interface ActivityFeedProps {
  timeline: TimelineItem[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ timeline }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'commit':
        return GitCommit;
      case 'pr':
        return GitPullRequest;
      case 'issue':
        return AlertCircle;
      case 'repo':
        return FolderPlus;
      default:
        return Activity;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'commit':
        return 'text-green-400 bg-green-500/20';
      case 'pr':
        return 'text-blue-400 bg-blue-500/20';
      case 'issue':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'repo':
        return 'text-purple-400 bg-purple-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'commit':
        return 'Commits';
      case 'pr':
        return 'Pull Requests';
      case 'issue':
        return 'Issues';
      case 'repo':
        return 'Repositories';
      default:
        return 'Activity';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="h-full bg-gray-900 p-4">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-md flex items-center justify-center">
          <Activity className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Activity Feed</h3>
          <p className="text-xs text-gray-400">Recent development activity</p>
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-2 max-h-[calc(100%-60px)] overflow-y-auto">
        {timeline.slice(0, 10).map((item, index) => {
          const Icon = getIcon(item.type);
          const colorClass = getColor(item.type);
          
          return (
            <motion.div
              key={`${item.date}-${item.type}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-800/50 transition-colors"
            >
              <div className={`w-6 h-6 rounded-md flex items-center justify-center ${colorClass}`}>
                <Icon className="w-3 h-3" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white">
                    {item.count} {getTypeLabel(item.type)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(item.date)}
                  </span>
                </div>
                
                {item.type === 'commit' && item.details.commits && (
                  <div className="text-xs text-gray-400 truncate">
                    {item.details.commits[0]?.commit.message.split('\n')[0]}
                  </div>
                )}
                
                {item.type === 'pr' && item.details.prs && (
                  <div className="text-xs text-gray-400 truncate">
                    {item.details.prs[0]?.title}
                  </div>
                )}
                
                {item.type === 'repo' && item.details.repos && (
                  <div className="text-xs text-gray-400 truncate">
                    {item.details.repos[0]?.name}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityFeed;