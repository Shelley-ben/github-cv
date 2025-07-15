import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, FileText, Github, Clock, Wifi, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { GitHubUser } from '../../services/github';

interface HeaderProps {
  onGenerateReadme: () => void;
  lastUpdated?: Date | null;
  user: GitHubUser;
}

const Header: React.FC<HeaderProps> = ({ onGenerateReadme, lastUpdated, user }) => {
  const { logout } = useAuth();

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="h-20 bg-gray-800 border-b border-gray-700 px-6 flex items-center justify-between">
      {/* Left side - Logo & User info */}
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-md flex items-center justify-center">
          <Github className="w-5 h-5 text-white" />
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={user.avatar_url}
              alt="Profile"
              className="w-8 h-8 rounded-full border border-gray-600"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-gray-800"></div>
          </div>
          
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-semibold text-white">
                {user.name || user.login}
              </h1>
              <span className="text-sm text-gray-400">@{user.login}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center - Status */}
      <div className="flex items-center space-x-6 text-sm text-gray-400">
        <div className="flex items-center space-x-2">
          <Wifi className="w-4 h-4 text-green-500" />
          <span>Live</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>Updated {formatLastUpdated(lastUpdated)}</span>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onGenerateReadme}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-all duration-200 font-medium"
        >
          <FileText className="w-4 h-4" />
          <span>Generate README</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-md flex items-center space-x-2 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </motion.button>
      </div>
    </div>
  );
};

export default Header;