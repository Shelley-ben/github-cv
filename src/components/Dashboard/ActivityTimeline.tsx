import React from 'react';
import { motion } from 'framer-motion';
import { GitCommit, GitPullRequest, AlertCircle, FolderPlus, Calendar } from 'lucide-react';

interface TimelineItem {
  date: string;
  type: 'commit' | 'pr' | 'issue' | 'repo';
  count: number;
  details: any;
}

interface ActivityTimelineProps {
  timeline: TimelineItem[];
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ timeline }) => {
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
        return Calendar;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'commit':
        return 'from-green-500 to-emerald-500';
      case 'pr':
        return 'from-blue-500 to-cyan-500';
      case 'issue':
        return 'from-yellow-500 to-orange-500';
      case 'repo':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-gray-500 to-gray-600';
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="bg-gray-800 border border-gray-700 rounded-md p-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-md flex items-center justify-center">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white font-mono">Activity Timeline</h3>
          <p className="text-sm text-gray-400">Recent development activity</p>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {timeline.slice(0, 20).map((item, index) => {
          const Icon = getIcon(item.type);
          const colorClass = getColor(item.type);
          
          return (
            <motion.div
              key={`${item.date}-${item.type}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-start space-x-4 p-3 rounded-md hover:bg-gray-900/30 transition-colors border border-gray-700/30"
            >
              <div className={`w-8 h-8 bg-gradient-to-r ${colorClass} rounded-md flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-white font-mono">
                    {item.count} {getTypeLabel(item.type)}
                  </h4>
                  <span className="text-xs text-gray-500 font-mono">
                    {formatDate(item.date)}
                  </span>
                </div>
                
                <div className="text-xs text-gray-400">
                  {item.type === 'commit' && item.details.commits && (
                    <div className="space-y-1">
                      {item.details.commits.slice(0, 2).map((commit: any, i: number) => (
                        <div key={i} className="truncate font-mono">
                          <span className="text-green-400">
                            {commit.sha.substring(0, 7)}
                          </span>
                          {' '}
                          <span>{commit.commit.message.split('\n')[0]}</span>
                        </div>
                      ))}
                      {item.details.commits.length > 2 && (
                        <div className="text-gray-500 font-mono">
                          +{item.details.commits.length - 2} more commits
                        </div>
                      )}
                    </div>
                  )}
                  
                  {item.type === 'pr' && item.details.prs && (
                    <div className="space-y-1">
                      {item.details.prs.slice(0, 2).map((pr: any, i: number) => (
                        <div key={i} className="truncate font-mono">
                          <span className="text-blue-400">#{pr.number}</span>
                          {' '}
                          <span>{pr.title}</span>
                        </div>
                      ))}
                      {item.details.prs.length > 2 && (
                        <div className="text-gray-500 font-mono">
                          +{item.details.prs.length - 2} more PRs
                        </div>
                      )}
                    </div>
                  )}
                  
                  {item.type === 'repo' && item.details.repos && (
                    <div className="space-y-1">
                      {item.details.repos.slice(0, 2).map((repo: any, i: number) => (
                        <div key={i} className="truncate font-mono">
                          <span className="text-purple-400">{repo.name}</span>
                          {repo.description && (
                            <span className="text-gray-500"> - {repo.description}</span>
                          )}
                        </div>
                      ))}
                      {item.details.repos.length > 2 && (
                        <div className="text-gray-500 font-mono">
                          +{item.details.repos.length - 2} more repositories
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ActivityTimeline;