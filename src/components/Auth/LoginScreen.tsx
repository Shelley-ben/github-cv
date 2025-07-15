import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Code, Sparkles, TrendingUp, Award, AlertCircle, Terminal, Activity } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const LoginScreen: React.FC = () => {
  const { signInWithGitHub } = useAuth();
  const [loginError, setLoginError] = useState<string>('');

  const handleGitHubLogin = async () => {
    setLoginError('');
    try {
      await signInWithGitHub();
    } catch (error) {
      console.error('Login failed:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('auth/popup-blocked')) {
          setLoginError('Popup was blocked by your browser. Please allow popups for this site and try again.');
        } else if (error.message.includes('auth/popup-closed-by-user')) {
          setLoginError('Login was cancelled. Please try again.');
        } else if (error.message.includes('auth/unauthorized-domain')) {
          setLoginError('This domain is not authorized. Please contact support.');
        } else {
          setLoginError('Login failed. Please try again.');
        }
      } else {
        setLoginError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Left Side - Project Preview */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-800 to-gray-900 p-8 flex-col justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-green-500 rounded-md rotate-12"></div>
          <div className="absolute bottom-32 right-16 w-24 h-24 border border-blue-500 rounded-md -rotate-12"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 border border-purple-500 rounded-md rotate-45"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          {/* Logo and Project Name */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-md flex items-center justify-center">
              <Github className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">GitHub CV Generator</h1>
              <p className="text-gray-400">Transform your code into career opportunities</p>
            </div>
          </div>

          {/* Mock Terminal/Code View */}
          <div className="bg-gray-800 rounded-md border border-gray-700 overflow-hidden mb-8">
            <div className="bg-gray-700 px-4 py-2 flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-300 text-sm ml-4">github-cv-generator.md</span>
            </div>
            <div className="p-4 font-mono text-sm">
              <div className="text-green-400"># Your GitHub Profile</div>
              <div className="text-gray-300 mt-2">
                <span className="text-blue-400">const</span> <span className="text-yellow-400">profile</span> = {'{'}
              </div>
              <div className="text-gray-300 ml-4">
                <span className="text-purple-400">commits</span>: <span className="text-green-400">1,247</span>,
              </div>
              <div className="text-gray-300 ml-4">
                <span className="text-purple-400">repositories</span>: <span className="text-green-400">42</span>,
              </div>
              <div className="text-gray-300 ml-4">
                <span className="text-purple-400">stars</span>: <span className="text-green-400">156</span>,
              </div>
              <div className="text-gray-300 ml-4">
                <span className="text-purple-400">languages</span>: [<span className="text-orange-400">'JavaScript'</span>, <span className="text-orange-400">'TypeScript'</span>]
              </div>
              <div className="text-gray-300">{'}'}</div>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-3 text-gray-300"
            >
              <Terminal className="w-5 h-5 text-green-400" />
              <span>Real-time GitHub data analysis</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center space-x-3 text-gray-300"
            >
              <Activity className="w-5 h-5 text-blue-400" />
              <span>Live contribution monitoring</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center space-x-3 text-gray-300"
            >
              <Code className="w-5 h-5 text-purple-400" />
              <span>Professional README generation</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-900">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="bg-gray-800 rounded-md p-8 border border-gray-700">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-md mb-4">
                <Github className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">GitHub CV Generator</h1>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-gray-400">Connect your GitHub to get started</p>
            </div>

            <div className="space-y-4 mb-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center space-x-3 text-gray-300 p-3 bg-gray-700/50 rounded-md"
              >
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span className="text-sm">AI-powered insights</span>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center space-x-3 text-gray-300 p-3 bg-gray-700/50 rounded-md"
              >
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-sm">Real-time analytics</span>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center space-x-3 text-gray-300 p-3 bg-gray-700/50 rounded-md"
              >
                <Award className="w-5 h-5 text-purple-400" />
                <span className="text-sm">Professional README export</span>
              </motion.div>
            </div>

            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md flex items-start space-x-2"
              >
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-300">
                  {loginError}
                  {loginError.includes('popup') && (
                    <div className="mt-2 text-xs text-red-200">
                      <strong>How to allow popups:</strong>
                      <br />• Chrome: Click the popup icon in the address bar
                      <br />• Firefox: Click "Options" when the popup notification appears
                      <br />• Safari: Go to Preferences → Websites → Pop-up Windows
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGitHubLogin}
              className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-medium py-4 px-6 rounded-md flex items-center justify-center space-x-3 transition-all duration-200 border border-gray-600"
            >
              <Github className="w-5 h-5" />
              <span>Continue with GitHub</span>
            </motion.button>

            <p className="text-xs text-gray-500 text-center mt-6">
              We only request public repository access to analyze your contributions
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginScreen;