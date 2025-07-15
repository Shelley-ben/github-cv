import React from 'react';
import { motion } from 'framer-motion';
import { Star, GitFork, ExternalLink, Eye, Calendar, Archive } from 'lucide-react';
import { Repository } from '../../services/github';

interface RepoShowcaseProps {
  repositories: Repository[];
}

const RepoShowcase: React.FC<RepoShowcaseProps> = ({ repositories }) => {
  const topRepos = repositories
    .filter(repo => !repo.archived && !repo.disabled)
    .sort((a, b) => (b.stargazers_count + b.forks_count) - (a.stargazers_count + a.forks_count))
    .slice(0, 9);

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      JavaScript: 'bg-yellow-500',
      TypeScript: 'bg-blue-500',
      Python: 'bg-green-500',
      Java: 'bg-red-500',
      'C++': 'bg-purple-500',
      Go: 'bg-cyan-500',
      Rust: 'bg-orange-500',
      PHP: 'bg-indigo-500',
      Ruby: 'bg-pink-500',
      Swift: 'bg-orange-600',
      Kotlin: 'bg-purple-600',
      Dart: 'bg-blue-600',
    };
    return colors[language] || 'bg-gray-500';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const getRepoScore = (repo: Repository) => {
    return repo.stargazers_count * 2 + repo.forks_count * 3 + repo.watchers_count;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-gray-800 border border-gray-700 rounded-md p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md flex items-center justify-center">
            <Star className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white font-mono">Repository Showcase</h3>
            <p className="text-sm text-gray-400">Your most impactful projects</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-white font-mono">{repositories.length}</div>
          <div className="text-xs text-gray-400">Total Repos</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topRepos.map((repo, index) => (
          <motion.div
            key={repo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-gray-900 border border-gray-700 rounded-md p-5 hover:border-gray-600 transition-all duration-200 group hover:bg-gray-900/70"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-semibold text-white truncate group-hover:text-blue-400 transition-colors font-mono">
                    {repo.name}
                  </h4>
                  {repo.private && (
                    <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded-md border border-yellow-500/30">
                      Private
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500 font-mono">
                  <Calendar className="w-3 h-3" />
                  <span>Updated {formatDate(repo.updated_at)}</span>
                </div>
              </div>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            
            {/* Description */}
            <p className="text-sm text-gray-300 mb-4 line-clamp-2 min-h-[2.5rem]">
              {repo.description || 'No description available'}
            </p>
            
            {/* Topics */}
            {repo.topics && repo.topics.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {repo.topics.slice(0, 3).map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-md border border-blue-500/30 font-mono"
                  >
                    {topic}
                  </span>
                ))}
                {repo.topics.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-gray-500/20 text-gray-400 rounded-md border border-gray-500/30 font-mono">
                    +{repo.topics.length - 3}
                  </span>
                )}
              </div>
            )}
            
            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-gray-400 mb-4 font-mono">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3" />
                  <span>{repo.stargazers_count}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <GitFork className="w-3 h-3" />
                  <span>{repo.forks_count}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>{repo.watchers_count}</span>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-700">
              {repo.language ? (
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-md ${getLanguageColor(repo.language)}`}></div>
                  <span className="text-xs text-gray-400 font-mono">{repo.language}</span>
                </div>
              ) : (
                <div></div>
              )}
              
              <div className="flex items-center space-x-1 text-xs font-mono">
                <span className="text-gray-500">Score:</span>
                <span className="text-white font-medium">{getRepoScore(repo)}</span>
              </div>
            </div>
            
            {/* License */}
            {repo.license && (
              <div className="mt-2 pt-2 border-t border-gray-700">
                <div className="flex items-center space-x-1 text-xs text-gray-500 font-mono">
                  <Archive className="w-3 h-3" />
                  <span>{repo.license.name}</span>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Show more button if there are more repos */}
      {repositories.length > 9 && (
        <div className="mt-6 text-center">
          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md transition-colors text-sm font-mono border border-gray-600">
            View all {repositories.length} repositories
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default RepoShowcase;