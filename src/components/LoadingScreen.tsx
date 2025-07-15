import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Github, 
  Database, 
  BarChart3, 
  Users, 
  GitBranch, 
  Code, 
  Star,
  CheckCircle,
  Loader2
} from 'lucide-react';

interface LoadingStep {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  status: 'pending' | 'loading' | 'completed';
  description: string;
}

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<LoadingStep[]>([
    {
      id: 'auth',
      label: 'Authenticating with GitHub',
      icon: Github,
      status: 'loading',
      description: 'Establishing secure connection...'
    },
    {
      id: 'profile',
      label: 'Fetching Profile Data',
      icon: Database,
      status: 'pending',
      description: 'Loading user information and basic stats...'
    },
    {
      id: 'repos',
      label: 'Analyzing Repositories',
      icon: GitBranch,
      status: 'pending',
      description: 'Scanning repositories and commit history...'
    },
    {
      id: 'contributions',
      label: 'Processing Contributions',
      icon: BarChart3,
      status: 'pending',
      description: 'Calculating contribution patterns and metrics...'
    },
    {
      id: 'languages',
      label: 'Analyzing Code Languages',
      icon: Code,
      status: 'pending',
      description: 'Processing language distribution and usage...'
    },
    {
      id: 'collaborators',
      label: 'Finding Collaborators',
      icon: Users,
      status: 'pending',
      description: 'Identifying collaboration networks...'
    },
    {
      id: 'insights',
      label: 'Generating AI Insights',
      icon: Star,
      status: 'pending',
      description: 'Creating personalized recommendations...'
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSteps(prevSteps => {
        const newSteps = [...prevSteps];
        const currentStepIndex = newSteps.findIndex(step => step.status === 'loading');
        
        if (currentStepIndex !== -1) {
          newSteps[currentStepIndex].status = 'completed';
          
          if (currentStepIndex + 1 < newSteps.length) {
            newSteps[currentStepIndex + 1].status = 'loading';
            setCurrentStep(currentStepIndex + 1);
          } else {
            // All steps completed
            setTimeout(() => onComplete(), 1000);
          }
        }
        
        return newSteps;
      });
    }, 2000); // Each step takes 2 seconds

    return () => clearInterval(timer);
  }, [onComplete]);

  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const progress = (completedSteps / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-md flex items-center justify-center mx-auto mb-6">
            <Github className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Analyzing Your GitHub Profile</h1>
          <p className="text-gray-400">Please wait while we process your data and generate insights</p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center space-x-4 p-4 rounded-md border transition-all duration-300 ${
                  step.status === 'completed'
                    ? 'bg-green-500/10 border-green-500/30'
                    : step.status === 'loading'
                    ? 'bg-blue-500/10 border-blue-500/30'
                    : 'bg-gray-800 border-gray-700'
                }`}
              >
                <div className={`w-12 h-12 rounded-md flex items-center justify-center ${
                  step.status === 'completed'
                    ? 'bg-green-500'
                    : step.status === 'loading'
                    ? 'bg-blue-500'
                    : 'bg-gray-700'
                }`}>
                  <AnimatePresence mode="wait">
                    {step.status === 'completed' ? (
                      <motion.div
                        key="completed"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <CheckCircle className="w-6 h-6 text-white" />
                      </motion.div>
                    ) : step.status === 'loading' ? (
                      <motion.div
                        key="loading"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="pending"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Icon className="w-6 h-6 text-gray-400" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex-1">
                  <h3 className={`font-medium ${
                    step.status === 'completed'
                      ? 'text-green-400'
                      : step.status === 'loading'
                      ? 'text-blue-400'
                      : 'text-gray-400'
                  }`}>
                    {step.label}
                  </h3>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </div>

                {step.status === 'loading' && (
                  <div className="flex space-x-1">
                    <motion.div
                      className="w-2 h-2 bg-blue-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-blue-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-blue-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8 text-gray-500 text-sm"
        >
          <p>This may take a few moments depending on your GitHub activity</p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen;