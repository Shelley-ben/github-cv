import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import LoginScreen from './components/Auth/LoginScreen';
import LoadingScreen from './components/LoadingScreen';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  const { user, loading } = useAuth();
  const [showLoading, setShowLoading] = useState(false);

  React.useEffect(() => {
    if (user && !showLoading) {
      setShowLoading(true);
    }
  }, [user]);

  const handleLoadingComplete = () => {
    setShowLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-md flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  if (showLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return <Dashboard />;
}

export default App;