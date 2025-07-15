import React from 'react';
import { motion } from 'framer-motion';
import { Users, GitBranch, Star } from 'lucide-react';

interface Collaborator {
  login: string;
  avatar_url: string;
  contributions: number;
}

interface CollaboratorNetworkProps {
  collaborators: Collaborator[];
  userLogin: string;
}

const CollaboratorNetwork: React.FC<CollaboratorNetworkProps> = ({ 
  collaborators, 
  userLogin 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="bg-gray-800 border border-gray-700 rounded-md p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-md flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white font-mono">Collaboration Network</h3>
            <p className="text-sm text-gray-400">Top contributors you've worked with</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-white font-mono">{collaborators.length}</div>
          <div className="text-xs text-gray-400">Collaborators</div>
        </div>
      </div>

      {collaborators.length === 0 ? (
        <div className="text-center py-8">
          <GitBranch className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No collaboration data available</p>
          <p className="text-sm text-gray-500">Start contributing to projects to build your network!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collaborators.map((collaborator, index) => (
            <motion.div
              key={collaborator.login}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="bg-gray-900 border border-gray-700 rounded-md p-4 hover:border-gray-600 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="relative">
                  <img
                    src={collaborator.avatar_url}
                    alt={collaborator.login}
                    className="w-10 h-10 rounded-md border-2 border-gray-600 group-hover:border-cyan-500 transition-colors"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-md border-2 border-gray-900 flex items-center justify-center">
                    <Star className="w-2 h-2 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white truncate group-hover:text-cyan-400 transition-colors font-mono">
                    {collaborator.login}
                  </h4>
                  <p className="text-xs text-gray-500">Collaborator</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  <span className="font-medium text-white font-mono">
                    {collaborator.contributions.toLocaleString()}
                  </span>
                  <span className="ml-1">contributions</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-cyan-500 rounded-md"></div>
                  <span className="text-xs text-cyan-400 font-mono">Active</span>
                </div>
              </div>
              
              {/* Connection strength indicator */}
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Connection Strength</span>
                  <span className="text-cyan-400 font-mono">
                    {collaborator.contributions > 100 ? 'Strong' : 
                     collaborator.contributions > 50 ? 'Medium' : 'Light'}
                  </span>
                </div>
                <div className="mt-1 w-full h-1 bg-gray-700 rounded-md overflow-hidden border border-gray-600">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${Math.min((collaborator.contributions / 200) * 100, 100)}%` 
                    }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default CollaboratorNetwork;