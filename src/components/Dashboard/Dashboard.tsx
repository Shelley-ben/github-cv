import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { GitHubService, ContributionData } from '../../services/github';
import { generateAIInsights, AIInsight } from '../../services/gemini';
import Header from './Header';
import StatsCard from './StatsCard';
import ContributionHeatmap from './ContributionHeatmap';
import LanguageChart from './LanguageChart';
import RepoShowcase from './RepoShowcase';
import RealTimeActivity from './RealTimeActivity';
import AdvancedMetrics from './AdvancedMetrics';
import ActivityTimeline from './ActivityTimeline';
import CollaboratorNetwork from './CollaboratorNetwork';
import AIInsights from './AIInsights';
import { 
  GitCommit, 
  Star, 
  GitFork, 
  Users, 
  Code, 
  TrendingUp,
  Award,
  Calendar
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, getGitHubToken } = useAuth();
  const [contributionData, setContributionData] = useState<ContributionData | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [hasGeneratedInsights, setHasGeneratedInsights] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (user) {
      fetchGitHubData();
      // Set up periodic refresh every 5 minutes
      const interval = setInterval(fetchGitHubData, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchGitHubData = async () => {
    try {
      setError(null);
      const githubToken = getGitHubToken();

      if (!githubToken) {
        throw new Error('GitHub token not found');
      }

      const githubService = new GitHubService(githubToken);
      const data = await githubService.getComprehensiveData();
      
      setContributionData(data);
      setLastUpdated(new Date());
      
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
      setError('Failed to load GitHub data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInsights = async () => {
    if (!contributionData) return;

    setLoadingInsights(true);
    try {
      const insights = await generateAIInsights(contributionData);
      setAiInsights(insights);
      setHasGeneratedInsights(true);
    } catch (error) {
      console.error('Failed to generate AI insights:', error);
      setError('Failed to generate AI insights. Please try again.');
    } finally {
      setLoadingInsights(false);
    }
  };

  const handleGenerateReadme = async () => {
    if (!contributionData) return;

    const readmeContent = generateReadmeContent(contributionData);
    
    // Create and download the README file
    const blob = new Blob([readmeContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateReadmeContent = (data: ContributionData): string => {
    const { user, stats, repositories, languages } = data;
    
    const topLanguages = Object.entries(languages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([lang]) => lang);

    const topRepos = repositories
      .filter(repo => !repo.archived && !repo.disabled)
      .sort((a, b) => (b.stargazers_count + b.forks_count) - (a.stargazers_count + a.forks_count))
      .slice(0, 5);

    return `# Hi there, I'm ${user.name || user.login} 👋

${user.bio ? `*${user.bio}*\n` : ''}

## 🚀 About Me

- 🔭 I'm currently working on **${topRepos[0]?.name || 'exciting projects'}**
- 🌱 I'm passionate about **${topLanguages.slice(0, 3).join(', ')}**
- 👯 I'm looking to collaborate on **open source projects**
- 💬 Ask me about **${topLanguages[0]} development**
- 📫 How to reach me: **${user.email || `@${user.login}`}**
${user.location ? `- 🌍 Based in **${user.location}**` : ''}

## 📊 GitHub Stats

\`\`\`
🏆 Total Contributions: ${stats.totalCommits.toLocaleString()}
⭐ Stars Earned: ${stats.totalStars.toLocaleString()}
🔱 Repositories: ${stats.totalRepositories}
🤝 Pull Requests: ${stats.totalPRs}
🐛 Issues: ${stats.totalIssues}
🔥 Contribution Streak: ${stats.contributionStreak} days
\`\`\`

## 🛠️ Tech Stack

${topLanguages.map(lang => `![${lang}](https://img.shields.io/badge/-${lang}-05122A?style=flat&logo=${lang.toLowerCase()})`).join(' ')}

## 📈 Contribution Graph

![GitHub Activity Graph](https://github-readme-activity-graph.vercel.app/graph?username=${user.login}&theme=react-dark)

## 🏆 Featured Projects

${topRepos.map(repo => `
### [${repo.name}](${repo.html_url})
${repo.description || 'No description available'}

- ⭐ **${repo.stargazers_count}** stars
- 🍴 **${repo.forks_count}** forks
- 📝 **${repo.language || 'Multiple languages'}**
`).join('')}

## 📫 Connect with me

${user.blog ? `- 🌐 Website: [${user.blog}](${user.blog})` : ''}
- 💼 LinkedIn: [linkedin.com/in/${user.login}](https://linkedin.com/in/${user.login})
- 🐦 Twitter: [@${user.twitter_username || user.login}](https://twitter.com/${user.twitter_username || user.login})
- 📧 Email: ${user.email || `${user.login}@example.com`}

---

⭐️ From [${user.login}](https://github.com/${user.login})

*This README was generated using [GitHub CV Generator](https://github.com/your-repo)*`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-md flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400">Loading dashboard...</p>
          <p className="text-gray-400">This may take a few moments depending on your GitHub activity</p>
        </div>
      </div>
    );
  }

  if (error || !contributionData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center bg-red-500/10 border border-red-500/20 rounded-md p-8 max-w-md">
          <h2 className="text-xl font-semibold text-red-400 mb-2">Connection Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={fetchGitHubData}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md transition-colors font-medium"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <Header 
        onGenerateReadme={handleGenerateReadme} 
        lastUpdated={lastUpdated}
        user={contributionData.user}
      />

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Real-time Activity Monitor */}
        <RealTimeActivity
          isLive={true}
          lastCommit={contributionData.recentCommits[0]}
          totalContributions={contributionData.stats.totalCommits}
        />

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Commits"
            value={contributionData.stats.totalCommits}
            icon={GitCommit}
            color="bg-gradient-to-r from-green-500 to-emerald-500"
            trend="+12%"
            delay={0.1}
          />
          <StatsCard
            title="Stars Earned"
            value={contributionData.stats.totalStars}
            icon={Star}
            color="bg-gradient-to-r from-yellow-500 to-orange-500"
            trend="+8%"
            delay={0.2}
          />
          <StatsCard
            title="Total Forks"
            value={contributionData.stats.totalForks}
            icon={GitFork}
            color="bg-gradient-to-r from-blue-500 to-cyan-500"
            trend="+15%"
            delay={0.3}
          />
          <StatsCard
            title="Repositories"
            value={contributionData.stats.totalRepositories}
            icon={Code}
            color="bg-gradient-to-r from-purple-500 to-pink-500"
            trend="+5%"
            delay={0.4}
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <ContributionHeatmap
              weeks={contributionData.contributionCalendar.weeks}
              totalContributions={contributionData.contributionCalendar.totalContributions}
            />
            <LanguageChart languages={contributionData.languages} />
            <AdvancedMetrics stats={contributionData.stats} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <RepoShowcase repositories={contributionData.repositories} />
            <ActivityTimeline timeline={contributionData.timeline} />
            <CollaboratorNetwork 
              collaborators={contributionData.collaborators}
              userLogin={contributionData.user.login}
            />
          </div>
        </div>
    
        {/* AI Insights */}
        <AIInsights 
          insights={aiInsights} 
          isLoading={loadingInsights}
          onGenerateInsights={handleGenerateInsights}
          hasInsights={hasGeneratedInsights}
        />
      </div>
    </div>
  );
};

export default Dashboard;