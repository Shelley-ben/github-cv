import { useState, useEffect } from 'react';
import { User, signInWithPopup, signOut, onAuthStateChanged, GithubAuthProvider } from 'firebase/auth';
import { auth, githubProvider } from '../config/firebase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [githubToken, setGithubToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGitHub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      
      // Get the GitHub access token from the credential
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      
      if (token) {
        // Store the token in localStorage for later use
        localStorage.setItem('github_token', token);
        setGithubToken(token);
      }
      
      return result.user;
    } catch (error) {
      console.error('GitHub sign-in error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // Clear the stored GitHub token
      localStorage.removeItem('github_token');
      setGithubToken(null);
    } catch (error) {
      console.error('Sign-out error:', error);
      throw error;
    }
  };

  const getGitHubToken = () => {
    return githubToken || localStorage.getItem('github_token');
  };

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('github_token');
    if (storedToken) {
      setGithubToken(storedToken);
    }
  }, []);
  return {
    user,
    loading,
    signInWithGitHub,
    logout,
    getGitHubToken,
    githubToken,
  };
};