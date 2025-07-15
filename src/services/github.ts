import { Octokit } from '@octokit/rest';
import { graphql } from '@octokit/graphql';

export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  company?: string;
  location?: string;
  email?: string;
  blog?: string;
  twitter_username?: string;
  hireable?: boolean;
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  size: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  html_url: string;
  clone_url: string;
  topics: string[];
  license?: {
    name: string;
    spdx_id: string;
  };
  archived: boolean;
  disabled: boolean;
  private: boolean;
}

export interface PullRequest {
  id: number;
  number: number;
  title: string;
  state: string;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  merged_at?: string;
  repository: {
    name: string;
    full_name: string;
    owner: string;
  };
  additions: number;
  deletions: number;
  changed_files: number;
  commits: number;
  user: {
    login: string;
    avatar_url: string;
  };
  labels: Array<{
    name: string;
    color: string;
  }>;
}

export interface Issue {
  id: number;
  number: number;
  title: string;
  state: string;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  repository: {
    name: string;
    full_name: string;
    owner: string;
  };
  labels: Array<{
    name: string;
    color: string;
  }>;
  comments: number;
}

export interface Commit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
  };
  repository: {
    name: string;
    full_name: string;
  };
  stats?: {
    additions: number;
    deletions: number;
    total: number;
  };
}

export interface ContributionStats {
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  totalStars: number;
  totalForks: number;
  totalWatchers: number;
  totalRepositories: number;
  linesOfCode: number;
  topLanguages: Array<{ name: string; count: number; percentage: number }>;
  contributionStreak: number;
  mostActiveDay: string;
  mostActiveHour: number;
  contributionScore: number;
  impactScore: number;
  collaborationScore: number;
}

export interface ContributionData {
  user: GitHubUser;
  repositories: Repository[];
  pullRequests: PullRequest[];
  issues: Issue[];
  recentCommits: Commit[];
  contributionCalendar: any;
  languages: Record<string, number>;
  stats: ContributionStats;
  timeline: Array<{
    date: string;
    type: 'commit' | 'pr' | 'issue' | 'repo';
    count: number;
    details: any;
  }>;
  collaborators: Array<{
    login: string;
    avatar_url: string;
    contributions: number;
  }>;
}

export class GitHubService {
  private octokit: Octokit;
  private graphqlClient: any;

  constructor(token: string) {
    this.octokit = new Octokit({ auth: token });
    this.graphqlClient = graphql.defaults({
      headers: {
        authorization: `token ${token}`,
      },
    });
  }

  async getUserData(): Promise<GitHubUser> {
    const { data } = await this.octokit.users.getAuthenticated();
    return data as GitHubUser;
  }

  async getUserRepositories(): Promise<Repository[]> {
    const allRepos: Repository[] = [];
    let page = 1;
    const perPage = 100;

    while (true) {
      const { data } = await this.octokit.repos.listForAuthenticatedUser({
        sort: 'updated',
        per_page: perPage,
        page,
        type: 'all',
      });

      if (data.length === 0) break;
      
      allRepos.push(...(data as Repository[]));
      
      if (data.length < perPage) break;
      page++;
    }

    return allRepos;
  }

  async getUserPullRequests(): Promise<PullRequest[]> {
    const user = await this.getUserData();
    const query = `is:pr author:${user.login} is:public`;
    
    const { data } = await this.octokit.search.issuesAndPullRequests({
      q: query,
      sort: 'created',
      order: 'desc',
      per_page: 100,
    });

    const pullRequests: PullRequest[] = [];
    
    for (const item of data.items.slice(0, 50)) { // Limit to avoid rate limits
      try {
        const [owner, repo] = item.repository_url.split('/').slice(-2);
        const prDetails = await this.octokit.pulls.get({
          owner,
          repo,
          pull_number: item.number,
        });
        
        pullRequests.push({
          id: item.id,
          number: item.number,
          title: item.title,
          state: item.state,
          created_at: item.created_at,
          updated_at: item.updated_at,
          closed_at: item.closed_at,
          merged_at: prDetails.data.merged_at,
          repository: {
            name: repo,
            full_name: `${owner}/${repo}`,
            owner,
          },
          additions: prDetails.data.additions || 0,
          deletions: prDetails.data.deletions || 0,
          changed_files: prDetails.data.changed_files || 0,
          commits: prDetails.data.commits || 0,
          user: {
            login: item.user?.login || '',
            avatar_url: item.user?.avatar_url || '',
          },
          labels: item.labels?.map((label: any) => ({
            name: label.name,
            color: label.color,
          })) || [],
        });
      } catch (error) {
        console.warn(`Failed to fetch PR details for ${item.number}:`, error);
      }
    }

    return pullRequests;
  }

  async getUserIssues(): Promise<Issue[]> {
    const user = await this.getUserData();
    const query = `is:issue author:${user.login} is:public`;
    
    const { data } = await this.octokit.search.issuesAndPullRequests({
      q: query,
      sort: 'created',
      order: 'desc',
      per_page: 100,
    });

    return data.items.map((item: any) => {
      const [owner, repo] = item.repository_url.split('/').slice(-2);
      return {
        id: item.id,
        number: item.number,
        title: item.title,
        state: item.state,
        created_at: item.created_at,
        updated_at: item.updated_at,
        closed_at: item.closed_at,
        repository: {
          name: repo,
          full_name: `${owner}/${repo}`,
          owner,
        },
        labels: item.labels?.map((label: any) => ({
          name: label.name,
          color: label.color,
        })) || [],
        comments: item.comments || 0,
      };
    });
  }

  async getRecentCommits(): Promise<Commit[]> {
    const user = await this.getUserData();
    const repos = await this.getUserRepositories();
    const commits: Commit[] = [];

    // Get commits from top 10 most recently updated repos
    const topRepos = repos
      .filter(repo => !repo.archived && !repo.disabled)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 10);

    for (const repo of topRepos) {
      try {
        const { data } = await this.octokit.repos.listCommits({
          owner: repo.full_name.split('/')[0],
          repo: repo.name,
          author: user.login,
          per_page: 10,
        });

        commits.push(...data.map((commit: any) => ({
          sha: commit.sha,
          commit: {
            message: commit.commit.message,
            author: {
              name: commit.commit.author.name,
              email: commit.commit.author.email,
              date: commit.commit.author.date,
            },
          },
          repository: {
            name: repo.name,
            full_name: repo.full_name,
          },
        })));
      } catch (error) {
        console.warn(`Failed to fetch commits for ${repo.name}:`, error);
      }
    }

    return commits
      .sort((a, b) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime())
      .slice(0, 50);
  }

  async getContributionCalendar(): Promise<any> {
    const user = await this.getUserData();
    const query = `
      query($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                  weekday
                }
              }
            }
            commitContributionsByRepository {
              repository {
                name
                owner {
                  login
                }
              }
              contributions {
                totalCount
              }
            }
          }
        }
      }
    `;

    const result = await this.graphqlClient(query, { login: user.login });
    return result.user.contributionsCollection;
  }

  async getLanguageStats(): Promise<Record<string, number>> {
    const repos = await this.getUserRepositories();
    const languageStats: Record<string, number> = {};

    for (const repo of repos.filter(r => !r.archived && !r.disabled)) {
      try {
        const { data } = await this.octokit.repos.listLanguages({
          owner: repo.full_name.split('/')[0],
          repo: repo.name,
        });

        Object.entries(data).forEach(([language, bytes]) => {
          languageStats[language] = (languageStats[language] || 0) + (bytes as number);
        });
      } catch (error) {
        console.warn(`Failed to fetch languages for ${repo.name}:`, error);
      }
    }

    return languageStats;
  }

  async getCollaborators(): Promise<Array<{ login: string; avatar_url: string; contributions: number }>> {
    const repos = await this.getUserRepositories();
    const collaboratorMap = new Map<string, { login: string; avatar_url: string; contributions: number }>();

    for (const repo of repos.slice(0, 20)) { // Limit to avoid rate limits
      try {
        const { data } = await this.octokit.repos.listContributors({
          owner: repo.full_name.split('/')[0],
          repo: repo.name,
          per_page: 10,
        });

        data.forEach((contributor: any) => {
          if (contributor.login !== repo.full_name.split('/')[0]) { // Exclude repo owner
            const existing = collaboratorMap.get(contributor.login);
            collaboratorMap.set(contributor.login, {
              login: contributor.login,
              avatar_url: contributor.avatar_url,
              contributions: (existing?.contributions || 0) + contributor.contributions,
            });
          }
        });
      } catch (error) {
        console.warn(`Failed to fetch contributors for ${repo.name}:`, error);
      }
    }

    return Array.from(collaboratorMap.values())
      .sort((a, b) => b.contributions - a.contributions)
      .slice(0, 10);
  }

  private calculateAdvancedStats(
    repos: Repository[],
    prs: PullRequest[],
    issues: Issue[],
    calendar: any,
    languages: Record<string, number>
  ): ContributionStats {
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
    const totalWatchers = repos.reduce((sum, repo) => sum + repo.watchers_count, 0);
    const linesOfCode = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);

    // Calculate top languages with percentages
    const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
    const topLanguages = Object.entries(languages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, bytes]) => ({
        name,
        count: bytes,
        percentage: Math.round((bytes / totalBytes) * 100),
      }));

    // Calculate contribution streak
    const contributionStreak = this.calculateContributionStreak(calendar);

    // Calculate most active day and hour
    const { mostActiveDay, mostActiveHour } = this.calculateActivityPatterns(calendar);

    // Calculate scores
    const contributionScore = this.calculateContributionScore(repos, prs, issues, calendar);
    const impactScore = this.calculateImpactScore(totalStars, totalForks, prs);
    const collaborationScore = this.calculateCollaborationScore(prs, issues);

    return {
      totalCommits: calendar.contributionCalendar.totalContributions,
      totalPRs: prs.length,
      totalIssues: issues.length,
      totalStars,
      totalForks,
      totalWatchers,
      totalRepositories: repos.length,
      linesOfCode,
      topLanguages,
      contributionStreak,
      mostActiveDay,
      mostActiveHour,
      contributionScore,
      impactScore,
      collaborationScore,
    };
  }

  private calculateContributionStreak(calendar: any): number {
    const days = calendar.contributionCalendar.weeks
      .flatMap((week: any) => week.contributionDays)
      .reverse();

    let streak = 0;
    for (const day of days) {
      if (day.contributionCount > 0) {
        streak++;
      } else if (streak > 0) {
        break;
      }
    }

    return streak;
  }

  private calculateActivityPatterns(calendar: any): { mostActiveDay: string; mostActiveHour: number } {
    const dayContributions: Record<string, number> = {};
    
    calendar.contributionCalendar.weeks.forEach((week: any) => {
      week.contributionDays.forEach((day: any) => {
        const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day.weekday];
        dayContributions[dayName] = (dayContributions[dayName] || 0) + day.contributionCount;
      });
    });

    const mostActiveDay = Object.entries(dayContributions)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'Monday';

    // Mock most active hour (GitHub API doesn't provide this)
    const mostActiveHour = Math.floor(Math.random() * 12) + 9; // 9 AM to 9 PM

    return { mostActiveDay, mostActiveHour };
  }

  private calculateContributionScore(repos: Repository[], prs: PullRequest[], issues: Issue[], calendar: any): number {
    const repoScore = repos.length * 5;
    const commitScore = calendar.contributionCalendar.totalContributions * 0.5;
    const prScore = prs.length * 10;
    const issueScore = issues.length * 3;
    
    return Math.round(repoScore + commitScore + prScore + issueScore);
  }

  private calculateImpactScore(stars: number, forks: number, prs: PullRequest[]): number {
    const starScore = stars * 2;
    const forkScore = forks * 3;
    const mergedPRScore = prs.filter(pr => pr.merged_at).length * 5;
    
    return Math.round(starScore + forkScore + mergedPRScore);
  }

  private calculateCollaborationScore(prs: PullRequest[], issues: Issue[]): number {
    const prCollaboration = prs.length * 2;
    const issueCollaboration = issues.length * 1;
    const discussionScore = prs.reduce((sum, pr) => sum + (pr.comments || 0), 0) * 0.5;
    
    return Math.round(prCollaboration + issueCollaboration + discussionScore);
  }

  async getComprehensiveData(): Promise<ContributionData> {
    const [user, repositories, pullRequests, issues, recentCommits, contributionData, languages] = await Promise.all([
      this.getUserData(),
      this.getUserRepositories(),
      this.getUserPullRequests(),
      this.getUserIssues(),
      this.getRecentCommits(),
      this.getContributionCalendar(),
      this.getLanguageStats(),
    ]);

    const collaborators = await this.getCollaborators();

    const stats = this.calculateAdvancedStats(repositories, pullRequests, issues, contributionData, languages);

    // Create timeline
    const timeline = this.createTimeline(repositories, pullRequests, issues, recentCommits);

    return {
      user,
      repositories,
      pullRequests,
      issues,
      recentCommits,
      contributionCalendar: contributionData.contributionCalendar,
      languages,
      stats,
      timeline,
      collaborators,
    };
  }

  private createTimeline(repos: Repository[], prs: PullRequest[], issues: Issue[], commits: Commit[]): Array<{
    date: string;
    type: 'commit' | 'pr' | 'issue' | 'repo';
    count: number;
    details: any;
  }> {
    const timelineMap = new Map<string, any>();

    // Add repositories
    repos.forEach(repo => {
      const date = repo.created_at.split('T')[0];
      const key = `${date}-repo`;
      timelineMap.set(key, {
        date,
        type: 'repo' as const,
        count: (timelineMap.get(key)?.count || 0) + 1,
        details: { repos: [...(timelineMap.get(key)?.details?.repos || []), repo] },
      });
    });

    // Add pull requests
    prs.forEach(pr => {
      const date = pr.created_at.split('T')[0];
      const key = `${date}-pr`;
      timelineMap.set(key, {
        date,
        type: 'pr' as const,
        count: (timelineMap.get(key)?.count || 0) + 1,
        details: { prs: [...(timelineMap.get(key)?.details?.prs || []), pr] },
      });
    });

    // Add issues
    issues.forEach(issue => {
      const date = issue.created_at.split('T')[0];
      const key = `${date}-issue`;
      timelineMap.set(key, {
        date,
        type: 'issue' as const,
        count: (timelineMap.get(key)?.count || 0) + 1,
        details: { issues: [...(timelineMap.get(key)?.details?.issues || []), issue] },
      });
    });

    // Add commits
    commits.forEach(commit => {
      const date = commit.commit.author.date.split('T')[0];
      const key = `${date}-commit`;
      timelineMap.set(key, {
        date,
        type: 'commit' as const,
        count: (timelineMap.get(key)?.count || 0) + 1,
        details: { commits: [...(timelineMap.get(key)?.details?.commits || []), commit] },
      });
    });

    return Array.from(timelineMap.values())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 100);
  }
}