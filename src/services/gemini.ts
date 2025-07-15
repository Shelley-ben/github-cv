import { GoogleGenerativeAI } from '@google/generative-ai';
import { ContributionData } from './github';

export interface AIInsight {
  type: 'skill' | 'trend' | 'opportunity' | 'achievement';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
}

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generateAIInsights = async (data: ContributionData): Promise<AIInsight[]> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
    Analyze this GitHub developer profile data and provide 4-6 actionable insights:

    Profile: ${data.user.name || data.user.login}
    Total Commits: ${data.stats.totalCommits}
    Total Stars: ${data.stats.totalStars}
    Total Repositories: ${data.stats.totalRepositories}
    Top Languages: ${data.stats.topLanguages.slice(0, 5).map(l => l.name).join(', ')}
    Contribution Streak: ${data.stats.contributionStreak} days
    Most Active Day: ${data.stats.mostActiveDay}
    Recent Activity: ${data.timeline.slice(0, 10).map(t => `${t.type}: ${t.count}`).join(', ')}

    Provide insights in this exact JSON format:
    [
      {
        "type": "skill|trend|opportunity|achievement",
        "title": "Brief insight title",
        "description": "Detailed explanation with specific recommendations",
        "confidence": 0.85,
        "actionable": true
      }
    ]

    Focus on:
    1. Skill development opportunities based on language usage
    2. Contribution patterns and trends
    3. Areas for improvement or growth
    4. Notable achievements or strengths
    5. Collaboration opportunities
    6. Technical recommendations

    Make insights specific, actionable, and encouraging.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const insights: AIInsight[] = JSON.parse(jsonMatch[0]);
    
    // Validate and filter insights
    return insights.filter(insight => 
      insight.type && 
      insight.title && 
      insight.description &&
      typeof insight.confidence === 'number' &&
      typeof insight.actionable === 'boolean'
    ).slice(0, 6);

  } catch (error) {
    console.error('Error generating AI insights:', error);
    
    // Return fallback insights based on the data
    return generateFallbackInsights(data);
  }
};

const generateFallbackInsights = (data: ContributionData): AIInsight[] => {
  const insights: AIInsight[] = [];

  // Language diversity insight
  if (data.stats.topLanguages.length > 3) {
    insights.push({
      type: 'skill',
      title: 'Strong Language Diversity',
      description: `You're proficient in ${data.stats.topLanguages.length} programming languages. Consider deepening your expertise in ${data.stats.topLanguages[0].name} or exploring emerging technologies.`,
      confidence: 0.9,
      actionable: true
    });
  }

  // Contribution consistency
  if (data.stats.contributionStreak > 30) {
    insights.push({
      type: 'achievement',
      title: 'Excellent Contribution Consistency',
      description: `Your ${data.stats.contributionStreak}-day streak shows remarkable dedication. This consistency is valuable for long-term project success.`,
      confidence: 0.95,
      actionable: false
    });
  }

  // Repository impact
  if (data.stats.totalStars > 50) {
    insights.push({
      type: 'achievement',
      title: 'Strong Community Impact',
      description: `Your repositories have earned ${data.stats.totalStars} stars, indicating valuable contributions to the community. Consider creating more open-source projects.`,
      confidence: 0.85,
      actionable: true
    });
  }

  // Collaboration opportunity
  if (data.stats.totalPRs < data.stats.totalCommits * 0.1) {
    insights.push({
      type: 'opportunity',
      title: 'Increase Collaboration',
      description: 'Consider contributing more to other projects through pull requests. This can expand your network and improve your coding skills.',
      confidence: 0.8,
      actionable: true
    });
  }

  // Activity pattern insight
  insights.push({
    type: 'trend',
    title: `Peak Activity on ${data.stats.mostActiveDay}`,
    description: `You're most productive on ${data.stats.mostActiveDay}s. Consider scheduling important coding tasks during your peak productivity times.`,
    confidence: 0.75,
    actionable: true
  });

  return insights.slice(0, 5);
};