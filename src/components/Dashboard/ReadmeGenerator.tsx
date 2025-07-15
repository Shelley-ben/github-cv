import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Eye, 
  Download, 
  Code, 
  Sparkles, 
  ChevronDown,
  FileText,
  Zap,
  User,
  Briefcase
} from 'lucide-react';
import { ContributionData } from '../../services/github';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ReadmeGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  contributionData: ContributionData;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
}

const ReadmeGenerator: React.FC<ReadmeGeneratorProps> = ({ 
  isOpen, 
  onClose, 
  contributionData 
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiGeneratedContent, setAiGeneratedContent] = useState('');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const developerRoles = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Mobile Developer',
    'DevOps Engineer',
    'Data Scientist',
    'Machine Learning Engineer',
    'Software Architect',
    'UI/UX Developer',
    'Game Developer',
    'Blockchain Developer',
    'Cloud Engineer'
  ];

  const templates: Template[] = [
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Clean and simple profile',
      category: 'Basic',
      preview: 'Simple introduction with key stats'
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Business-focused profile',
      category: 'Professional',
      preview: 'Formal tone with achievements'
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Artistic and colorful design',
      category: 'Creative',
      preview: 'Visual elements and emojis'
    },
    {
      id: 'developer',
      name: 'Developer Focus',
      description: 'Technical skills emphasis',
      category: 'Technical',
      preview: 'Code-focused with tech stack'
    },
    {
      id: 'stats-heavy',
      name: 'Stats Heavy',
      description: 'Data-driven profile',
      category: 'Analytics',
      preview: 'Charts and metrics focused'
    },
    {
      id: 'project-showcase',
      name: 'Project Showcase',
      description: 'Highlight your best work',
      category: 'Portfolio',
      preview: 'Featured projects and demos'
    },
    {
      id: 'open-source',
      name: 'Open Source',
      description: 'Community contributor focus',
      category: 'Community',
      preview: 'Contributions and collaboration'
    },
    {
      id: 'student',
      name: 'Student',
      description: 'Learning journey focused',
      category: 'Academic',
      preview: 'Education and growth mindset'
    },
    {
      id: 'startup',
      name: 'Startup Founder',
      description: 'Entrepreneurial profile',
      category: 'Business',
      preview: 'Innovation and leadership'
    },
    {
      id: 'freelancer',
      name: 'Freelancer',
      description: 'Service-oriented profile',
      category: 'Business',
      preview: 'Skills and availability'
    }
  ];

  const generateTemplateContent = (template: Template): string => {
    const { user, stats, repositories, languages } = contributionData;
    
    const topLanguages = Object.entries(languages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([lang]) => lang);

    const topRepos = repositories
      .filter(repo => !repo.archived && !repo.disabled)
      .sort((a, b) => (b.stargazers_count + b.forks_count) - (a.stargazers_count + a.forks_count))
      .slice(0, 5);

    switch (template.id) {
      case 'minimal':
        return `# ${user.name || user.login}

${user.bio || 'Passionate developer building amazing things.'}

## Quick Stats
- 🏆 ${stats.totalCommits.toLocaleString()} contributions
- ⭐ ${stats.totalStars} stars earned
- 📦 ${stats.totalRepositories} repositories

## Tech Stack
${topLanguages.slice(0, 3).map(lang => `- ${lang}`).join('\n')}

## Connect
- GitHub: [@${user.login}](https://github.com/${user.login})
${user.email ? `- Email: ${user.email}` : ''}`;

      case 'professional':
        return `# ${user.name || user.login}
## Software Developer

${user.bio || 'Experienced software developer with a passion for creating efficient, scalable solutions.'}

### Professional Highlights
- 🎯 **${stats.totalCommits.toLocaleString()}** total contributions across ${stats.totalRepositories} repositories
- 🌟 **${stats.totalStars}** stars earned from the developer community
- 🤝 **${stats.totalPRs}** pull requests demonstrating collaborative development
- 🔥 **${stats.contributionStreak}** day contribution streak

### Technical Expertise
${topLanguages.map(lang => `![${lang}](https://img.shields.io/badge/-${lang}-05122A?style=flat&logo=${lang.toLowerCase()})`).join(' ')}

### Featured Projects
${topRepos.slice(0, 3).map(repo => `
#### [${repo.name}](${repo.html_url})
${repo.description || 'Professional project showcasing technical skills'}
- ⭐ ${repo.stargazers_count} stars | 🍴 ${repo.forks_count} forks
`).join('')}

### Contact Information
- 📧 Professional inquiries: ${user.email || `${user.login}@example.com`}
- 💼 LinkedIn: [linkedin.com/in/${user.login}](https://linkedin.com/in/${user.login})
- 🌐 Portfolio: ${user.blog || `https://${user.login}.dev`}`;

      case 'creative':
        return `<div align="center">

# 🎨 ${user.name || user.login} 🎨

### ✨ Creative Developer & Digital Artist ✨

${user.bio || '🚀 Turning ideas into beautiful, functional experiences'}

</div>

## 🌈 What I Do

🎯 **Creating Magic With Code**
- 🎨 Frontend Wizardry
- ⚡ Performance Optimization
- 🌟 User Experience Design

## 📊 My Journey in Numbers

<div align="center">

| 🏆 Contributions | ⭐ Stars | 📦 Repos | 🔥 Streak |
|:---:|:---:|:---:|:---:|
| ${stats.totalCommits.toLocaleString()} | ${stats.totalStars} | ${stats.totalRepositories} | ${stats.contributionStreak} days |

</div>

## 🛠️ My Toolbox

<div align="center">

${topLanguages.map(lang => `![${lang}](https://img.shields.io/badge/-${lang}-FF6B6B?style=for-the-badge&logo=${lang.toLowerCase()}&logoColor=white)`).join('\n')}

</div>

## 🎭 Featured Creations

${topRepos.slice(0, 3).map(repo => `
### 🎪 [${repo.name}](${repo.html_url})
> ${repo.description || 'A creative masterpiece in code'}

🌟 **${repo.stargazers_count}** stars | 🍴 **${repo.forks_count}** forks
`).join('')}

<div align="center">

## 🤝 Let's Create Together!

[![Email](https://img.shields.io/badge/-Email-FF6B6B?style=for-the-badge&logo=gmail&logoColor=white)](mailto:${user.email || `${user.login}@example.com`})
[![GitHub](https://img.shields.io/badge/-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/${user.login})

</div>`;

      case 'developer':
        return `# ${user.name || user.login}
## Senior Software Engineer

\`\`\`javascript
const developer = {
    name: "${user.name || user.login}",
    role: "Software Engineer",
    languages: [${topLanguages.slice(0, 4).map(lang => `"${lang}"`).join(', ')}],
    architecture: ["Microservices", "Event-Driven", "Serverless"],
    currentFocus: "Building scalable applications",
    funFact: "I debug with console.log and I'm not ashamed"
};
\`\`\`

### 🔧 Technical Skills

**Languages & Frameworks**
${topLanguages.map(lang => `- ${lang}`).join('\n')}

**Development Stats**
- 💻 **${stats.totalCommits.toLocaleString()}** commits pushed
- 🔀 **${stats.totalPRs}** pull requests merged
- 🐛 **${stats.totalIssues}** issues resolved
- 📈 **${stats.contributionStreak}** day streak

### 🚀 Featured Repositories

${topRepos.slice(0, 4).map(repo => `
\`\`\`
Repository: ${repo.name}
Description: ${repo.description || 'Technical implementation showcase'}
Language: ${repo.language || 'Multiple'}
Stars: ${repo.stargazers_count} | Forks: ${repo.forks_count}
\`\`\`
`).join('')}

### 📈 GitHub Analytics

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${user.login}&show_icons=true&theme=dark)

### 🤝 Let's Connect

- 💼 LinkedIn: [linkedin.com/in/${user.login}](https://linkedin.com/in/${user.login})
- 📧 Email: ${user.email || `${user.login}@example.com`}
- 🌐 Portfolio: ${user.blog || `https://${user.login}.dev`}`;

      case 'stats-heavy':
        return `# 📊 ${user.name || user.login} - Data-Driven Developer

## 📈 Performance Metrics

<div align="center">

### 🏆 Contribution Overview
| Metric | Value | Trend |
|--------|-------|-------|
| Total Commits | ${stats.totalCommits.toLocaleString()} | 📈 +12% |
| Repositories | ${stats.totalRepositories} | 📈 +5% |
| Stars Earned | ${stats.totalStars} | 📈 +8% |
| Forks Created | ${stats.totalForks} | 📈 +15% |
| Pull Requests | ${stats.totalPRs} | 📈 +20% |
| Issues Resolved | ${stats.totalIssues} | 📈 +10% |

</div>

## 🎯 Advanced Analytics

### 📅 Activity Patterns
- 🔥 **Current Streak**: ${stats.contributionStreak} days
- 📊 **Most Active Day**: ${stats.mostActiveDay}
- ⏰ **Peak Hours**: ${stats.mostActiveHour}:00
- 🎯 **Contribution Score**: ${stats.contributionScore}

### 💻 Language Distribution

${Object.entries(languages)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 8)
  .map(([lang, bytes], index) => {
    const percentage = Math.round((bytes / Object.values(languages).reduce((sum, b) => sum + b, 0)) * 100);
    return `${index + 1}. **${lang}** - ${percentage}% (${(bytes / 1024).toFixed(1)}KB)`;
  }).join('\n')}

### 🏅 Repository Performance

${topRepos.slice(0, 5).map((repo, index) => `
**${index + 1}. [${repo.name}](${repo.html_url})**
- ⭐ Stars: ${repo.stargazers_count}
- 🍴 Forks: ${repo.forks_count}
- 👀 Watchers: ${repo.watchers_count}
- 📝 Language: ${repo.language || 'Multiple'}
- 📊 Impact Score: ${repo.stargazers_count * 2 + repo.forks_count * 3}
`).join('')}

## 📊 Visual Analytics

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${user.login}&show_icons=true&theme=radical&include_all_commits=true&count_private=true)

![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=${user.login}&layout=compact&theme=radical)

![GitHub Streak](https://github-readme-streak-stats.herokuapp.com/?user=${user.login}&theme=radical)

---
*Analytics updated automatically • Last refresh: ${new Date().toLocaleDateString()}*`;

      case 'project-showcase':
        return `# 🚀 ${user.name || user.login}
## Project Portfolio & Showcase

${user.bio || 'Passionate developer creating impactful solutions through code.'}

## 🌟 Featured Projects

${topRepos.slice(0, 6).map((repo, index) => `
### ${index + 1}. [${repo.name}](${repo.html_url})

**${repo.description || 'Innovative project showcasing technical expertise'}**

- 🛠️ **Tech Stack**: ${repo.language || 'Multiple Technologies'}
- ⭐ **Community Impact**: ${repo.stargazers_count} stars, ${repo.forks_count} forks
- 📅 **Last Updated**: ${new Date(repo.updated_at).toLocaleDateString()}
${repo.topics && repo.topics.length > 0 ? `- 🏷️ **Tags**: ${repo.topics.slice(0, 5).join(', ')}` : ''}

---
`).join('')}

## 🎯 Project Statistics

- 📦 **Total Projects**: ${stats.totalRepositories}
- ⭐ **Stars Earned**: ${stats.totalStars}
- 🍴 **Forks Generated**: ${stats.totalForks}
- 🔄 **Active Contributions**: ${stats.totalCommits.toLocaleString()}

## 🛠️ Technologies Used

${topLanguages.map(lang => `![${lang}](https://img.shields.io/badge/-${lang}-000000?style=flat&logo=${lang.toLowerCase()})`).join(' ')}

## 📊 Development Activity

![GitHub Activity Graph](https://github-readme-activity-graph.vercel.app/graph?username=${user.login}&theme=github-compact)

## 🤝 Collaboration & Contact

Interested in collaborating on exciting projects? Let's connect!

- 📧 **Email**: ${user.email || `${user.login}@example.com`}
- 💼 **LinkedIn**: [linkedin.com/in/${user.login}](https://linkedin.com/in/${user.login})
- 🌐 **Portfolio**: ${user.blog || `https://${user.login}.dev`}
- 🐦 **Twitter**: [@${user.twitter_username || user.login}](https://twitter.com/${user.twitter_username || user.login})`;

      case 'open-source':
        return `# 🌍 ${user.name || user.login}
## Open Source Contributor & Community Builder

${user.bio || 'Passionate about building open source software that makes a difference.'}

## 🤝 Community Contributions

### 📊 Contribution Overview
- 🏆 **${stats.totalCommits.toLocaleString()}** total contributions
- 🔄 **${stats.totalPRs}** pull requests submitted
- 🐛 **${stats.totalIssues}** issues created/resolved
- 🔥 **${stats.contributionStreak}** day contribution streak

### 🌟 Open Source Projects

${topRepos.filter(repo => !repo.private).slice(0, 5).map(repo => `
#### [${repo.name}](${repo.html_url})
${repo.description || 'Open source project contributing to the community'}

- 🌟 **${repo.stargazers_count}** stars from the community
- 🍴 **${repo.forks_count}** forks by other developers
- 📝 **${repo.language || 'Multiple languages'}**
- 📄 **License**: ${repo.license?.name || 'Open Source'}
`).join('')}

## 🛠️ Tech Stack

**Languages I Contribute With:**
${topLanguages.map(lang => `- ${lang}`).join('\n')}

## 📈 Contribution Graph

![GitHub Activity Graph](https://github-readme-activity-graph.vercel.app/graph?username=${user.login}&theme=react-dark)

## 🎯 Open Source Philosophy

> "The best way to learn is to contribute, and the best way to contribute is to share knowledge."

### What I Believe In:
- 🌱 **Knowledge Sharing**: Documentation and mentoring
- 🤝 **Collaboration**: Working together builds better software
- 🔄 **Continuous Learning**: Every contribution teaches something new
- 🌍 **Global Impact**: Code that helps people worldwide

## 🏅 Achievements & Recognition

- 🎖️ **${stats.totalStars}** stars earned across all repositories
- 🏆 **${stats.contributionScore}** contribution score
- 📈 **${stats.impactScore}** community impact score

## 🤝 Let's Collaborate!

Always open to:
- 🔧 Contributing to interesting projects
- 💡 Discussing new ideas and technologies
- 🎓 Mentoring newcomers to open source
- 🌟 Building something amazing together

**Reach out:**
- 📧 Email: ${user.email || `${user.login}@example.com`}
- 💬 GitHub: [@${user.login}](https://github.com/${user.login})
- 🌐 Website: ${user.blog || `https://${user.login}.dev`}

---
*"Code is poetry, and open source is the library where we all contribute verses."*`;

      case 'student':
        return `# 🎓 ${user.name || user.login}
## Computer Science Student & Aspiring Developer

${user.bio || 'Passionate student on a journey to master the art of programming.'}

## 📚 Learning Journey

### 🎯 Current Focus
- 💻 Building practical projects to apply theoretical knowledge
- 🌱 Growing my skills in **${topLanguages.slice(0, 3).join(', ')}**
- 🤝 Contributing to open source projects
- 📖 Continuous learning and skill development

### 📊 Progress Metrics
- 🏆 **${stats.totalCommits.toLocaleString()}** commits (learning by doing!)
- 📦 **${stats.totalRepositories}** projects completed
- 🔥 **${stats.contributionStreak}** day coding streak
- ⭐ **${stats.totalStars}** stars earned from peers

## 🛠️ Technologies I'm Learning

**Currently Studying:**
${topLanguages.map(lang => `- ${lang}`).join('\n')}

**Want to Learn Next:**
- Advanced algorithms and data structures
- System design principles
- Cloud computing platforms
- Mobile app development

## 🚀 Academic Projects

${topRepos.slice(0, 4).map((repo, index) => `
### ${index + 1}. [${repo.name}](${repo.html_url})
**Academic Project** | ${repo.language || 'Multiple Technologies'}

${repo.description || 'Student project demonstrating programming concepts and problem-solving skills'}

- 📅 Completed: ${new Date(repo.created_at).toLocaleDateString()}
- ⭐ Peer Recognition: ${repo.stargazers_count} stars
`).join('')}

## 📈 Learning Progress

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${user.login}&show_icons=true&theme=tokyonight)

![Learning Streak](https://github-readme-streak-stats.herokuapp.com/?user=${user.login}&theme=tokyonight)

## 🎯 Goals & Aspirations

### Short-term Goals (Next 6 months)
- [ ] Complete advanced algorithms course
- [ ] Build a full-stack web application
- [ ] Contribute to 5 open source projects
- [ ] Learn cloud deployment (AWS/Azure)

### Long-term Vision
- 🚀 Become a skilled software engineer
- 🌍 Work on projects that make a positive impact
- 🎓 Potentially pursue graduate studies
- 👥 Mentor other students in their coding journey

## 🤝 Let's Connect & Learn Together!

Always excited to:
- 💬 Discuss programming concepts and best practices
- 🤝 Collaborate on student projects
- 📚 Share learning resources and study tips
- 🎯 Work on coding challenges together

**Connect with me:**
- 📧 Email: ${user.email || `${user.login}@student.edu`}
- 💼 LinkedIn: [linkedin.com/in/${user.login}](https://linkedin.com/in/${user.login})
- 🐦 Twitter: [@${user.login}](https://twitter.com/${user.login})

---
*"Every expert was once a beginner. Every pro was once an amateur."*`;

      case 'startup':
        return `# 🚀 ${user.name || user.login}
## Startup Founder & Tech Entrepreneur

${user.bio || 'Building the future through innovative technology and entrepreneurial vision.'}

## 💡 Entrepreneurial Journey

### 🎯 Current Ventures
- 🚀 **Founder & CTO** - Leading technical innovation
- 💻 **Full-Stack Development** - Building scalable solutions
- 📈 **Product Strategy** - From concept to market
- 👥 **Team Leadership** - Growing engineering teams

### 📊 Technical Leadership Stats
- 🏗️ **${stats.totalRepositories}** projects architected
- 💻 **${stats.totalCommits.toLocaleString()}** commits to production
- ⭐ **${stats.totalStars}** community recognition
- 🔥 **${stats.contributionStreak}** days of consistent building

## 🛠️ Tech Stack & Architecture

**Core Technologies:**
${topLanguages.map(lang => `- ${lang}`).join('\n')}

**Startup Tech Focus:**
- ☁️ Cloud-native architecture (AWS/GCP/Azure)
- 🔄 CI/CD and DevOps practices
- 📊 Data analytics and insights
- 🔐 Security and scalability
- 📱 Mobile-first development

## 🏢 Featured Projects & Products

${topRepos.slice(0, 4).map((repo, index) => `
### ${index + 1}. [${repo.name}](${repo.html_url})
**${repo.private ? 'Proprietary Product' : 'Open Source Initiative'}**

${repo.description || 'Innovative solution addressing real market needs'}

- 🛠️ **Technology**: ${repo.language || 'Full-Stack Solution'}
- 📈 **Traction**: ${repo.stargazers_count} stars, ${repo.forks_count} forks
- 📅 **Launch**: ${new Date(repo.created_at).toLocaleDateString()}
- 🎯 **Status**: ${repo.archived ? 'Completed/Acquired' : 'Active Development'}
`).join('')}

## 📈 Business & Technical Metrics

### 🎯 Startup KPIs
- 💰 **Revenue Growth**: Bootstrapped to profitability
- 👥 **Team Size**: Growing engineering team
- 🚀 **Product Launches**: Multiple successful releases
- 📊 **User Growth**: Scaling user base

### 💻 Technical Contributions
- 🏗️ **Architecture Decisions**: Scalable system design
- 🔧 **Code Quality**: ${stats.totalPRs} PRs reviewed and merged
- 🐛 **Problem Solving**: ${stats.totalIssues} issues resolved
- 📚 **Knowledge Sharing**: Mentoring and documentation

## 🌟 Startup Philosophy

> "Move fast, build things that matter, and never stop learning."

### Core Values:
- 🎯 **Customer-Centric**: Building solutions that solve real problems
- 🚀 **Innovation**: Embracing new technologies and methodologies
- 🤝 **Collaboration**: Strong team culture and communication
- 📈 **Growth Mindset**: Continuous learning and adaptation

## 🏆 Achievements & Recognition

- 🥇 **Startup Accelerator Graduate**
- 🎖️ **Tech Innovation Award**
- 📰 **Featured in Tech Publications**
- 🎤 **Conference Speaker** - Sharing startup insights

## 🤝 Let's Build Something Amazing!

Always interested in:
- 💡 Innovative project collaborations
- 🚀 Startup partnerships and ventures
- 💰 Investment and funding opportunities
- 🎓 Mentoring aspiring entrepreneurs

**Connect for Business:**
- 📧 **Business Email**: ${user.email || `founder@${user.login}.com`}
- 💼 **LinkedIn**: [linkedin.com/in/${user.login}](https://linkedin.com/in/${user.login})
- 🌐 **Company Website**: ${user.blog || `https://${user.login}.com`}
- 🐦 **Twitter**: [@${user.login}](https://twitter.com/${user.login})

---
*"The best time to plant a tree was 20 years ago. The second best time is now."*`;

      case 'freelancer':
        return `# 💼 ${user.name || user.login}
## Freelance Developer & Technical Consultant

${user.bio || 'Experienced freelance developer delivering high-quality solutions for clients worldwide.'}

## 🎯 Services Offered

### 💻 Development Services
- 🌐 **Full-Stack Web Development**
- 📱 **Mobile App Development**
- ☁️ **Cloud Solutions & DevOps**
- 🔧 **API Development & Integration**
- 🎨 **UI/UX Implementation**

### 🛠️ Technical Expertise
${topLanguages.map(lang => `- **${lang}** - Production-ready applications`).join('\n')}

## 📊 Professional Stats

### 🏆 Track Record
- 💻 **${stats.totalCommits.toLocaleString()}** commits delivered
- 📦 **${stats.totalRepositories}** projects completed
- ⭐ **${stats.totalStars}** client satisfaction (GitHub stars)
- 🔄 **${stats.totalPRs}** code reviews and optimizations
- 🔥 **${stats.contributionStreak}** days of consistent delivery

### 💼 Client Success Metrics
- ✅ **100%** project completion rate
- ⏰ **On-time** delivery guarantee
- 🎯 **95%** client retention rate
- 🌟 **5-star** average rating

## 🚀 Featured Client Projects

${topRepos.slice(0, 5).map((repo, index) => `
### ${index + 1}. ${repo.name}
**${repo.private ? 'Client Project (NDA)' : 'Open Source Contribution'}**

${repo.description || 'Professional development project showcasing technical expertise'}

- 🛠️ **Technology Stack**: ${repo.language || 'Full-Stack Solution'}
- 📈 **Impact**: ${repo.stargazers_count} stars, ${repo.forks_count} forks
- 📅 **Delivered**: ${new Date(repo.updated_at).toLocaleDateString()}
- 🎯 **Scope**: ${repo.size > 1000 ? 'Large Scale' : repo.size > 100 ? 'Medium Scale' : 'Focused Solution'}
`).join('')}

## 💰 Pricing & Availability

### 📋 Service Packages

**🚀 Starter Package**
- Small to medium projects
- 2-4 week delivery
- Basic support included

**💼 Professional Package**
- Complex applications
- 1-3 month timeline
- Extended support & maintenance

**🏢 Enterprise Package**
- Large-scale solutions
- Custom timeline
- Full project management

### ⏰ Current Availability
- 📅 **Status**: ${Math.random() > 0.5 ? 'Available for new projects' : 'Booking for next month'}
- 🕐 **Response Time**: Within 24 hours
- 🌍 **Time Zone**: ${Intl.DateTimeFormat().resolvedOptions().timeZone}
- 💬 **Communication**: English, available for calls/meetings

## 🛠️ Technical Skills

**Frontend Development**
- React, Vue.js, Angular
- TypeScript, JavaScript (ES6+)
- HTML5, CSS3, Sass/SCSS
- Responsive design, PWAs

**Backend Development**
- Node.js, Python, Java
- REST APIs, GraphQL
- Database design (SQL/NoSQL)
- Microservices architecture

**DevOps & Cloud**
- AWS, Google Cloud, Azure
- Docker, Kubernetes
- CI/CD pipelines
- Monitoring & logging

## 🎯 Why Choose Me?

### ✅ Professional Advantages
- 🏆 **Proven Track Record**: ${stats.totalRepositories}+ successful projects
- ⚡ **Fast Delivery**: Agile development methodology
- 🔧 **Quality Code**: Clean, maintainable, well-documented
- 🤝 **Clear Communication**: Regular updates and transparency
- 🛡️ **Reliable Support**: Post-delivery maintenance available

### 🌟 Client Testimonials
> *"Exceptional work quality and professional communication. Delivered exactly what we needed on time."*

> *"Technical expertise combined with business understanding. Highly recommended!"*

## 📞 Let's Discuss Your Project!

Ready to bring your ideas to life? Let's talk about your requirements.

### 📬 Contact Information
- 📧 **Email**: ${user.email || `hello@${user.login}.dev`}
- 💼 **LinkedIn**: [linkedin.com/in/${user.login}](https://linkedin.com/in/${user.login})
- 🌐 **Portfolio**: ${user.blog || `https://${user.login}.dev`}
- 📱 **WhatsApp**: Available upon request
- 🎥 **Video Call**: Zoom/Google Meet available

### 💬 Quick Response Form
Interested in working together? Send me:
1. 📋 Project description
2. ⏰ Timeline requirements
3. 💰 Budget range
4. 📞 Preferred communication method

---
*"Quality code, delivered on time, every time."*

**Available for hire** • **Remote work specialist** • **Global clients welcome**`;

      default:
        return generateBasicTemplate();
    }
  };

  const generateBasicTemplate = (): string => {
    const { user, stats, repositories, languages } = contributionData;
    
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

  const generateAIReadme = async () => {
    if (!selectedRole) {
      alert('Please select a developer role first');
      return;
    }

    setIsGeneratingAI(true);
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const { user, stats, repositories, languages } = contributionData;
      
      const topLanguages = Object.entries(languages)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8)
        .map(([lang]) => lang);

      const topRepos = repositories
        .filter(repo => !repo.archived && !repo.disabled)
        .sort((a, b) => (b.stargazers_count + b.forks_count) - (a.stargazers_count + a.forks_count))
        .slice(0, 8);

      const prompt = `
Create a professional GitHub README.md for a ${selectedRole} with the following profile data:

**Profile Information:**
- Name: ${user.name || user.login}
- Username: ${user.login}
- Bio: ${user.bio || 'Passionate developer'}
- Location: ${user.location || 'Global'}
- Company: ${user.company || 'Independent'}
- Email: ${user.email || `${user.login}@example.com`}
- Website: ${user.blog || `https://${user.login}.dev`}

**GitHub Statistics:**
- Total Commits: ${stats.totalCommits.toLocaleString()}
- Total Stars: ${stats.totalStars}
- Total Repositories: ${stats.totalRepositories}
- Pull Requests: ${stats.totalPRs}
- Issues: ${stats.totalIssues}
- Contribution Streak: ${stats.contributionStreak} days
- Most Active Day: ${stats.mostActiveDay}

**Top Programming Languages:**
${topLanguages.map((lang, i) => `${i + 1}. ${lang}`).join('\n')}

**Featured Repositories:**
${topRepos.map(repo => `
- ${repo.name}: ${repo.description || 'No description'}
  - Language: ${repo.language || 'Multiple'}
  - Stars: ${repo.stargazers_count}
  - Forks: ${repo.forks_count}
`).join('')}

**Additional Context:**
${customPrompt || `Create a README that highlights skills and experience relevant to a ${selectedRole} role.`}

**Requirements:**
1. Create a professional README specifically tailored for a ${selectedRole}
2. Include relevant sections for this role (skills, experience, projects, etc.)
3. Use appropriate emojis and formatting
4. Include GitHub stats and badges
5. Make it engaging and professional
6. Include contact information
7. Add sections relevant to ${selectedRole} work
8. Use markdown formatting properly
9. Include a brief introduction that matches the ${selectedRole} role
10. Highlight the most relevant projects and skills for this role

Generate a complete, professional README.md content:
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const generatedContent = response.text();
      
      setAiGeneratedContent(generatedContent);
      
    } catch (error) {
      console.error('Error generating AI README:', error);
      alert('Failed to generate AI README. Please try again.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const downloadReadme = (content: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getCurrentContent = () => {
    if (aiGeneratedContent) return aiGeneratedContent;
    if (selectedTemplate) return generateTemplateContent(selectedTemplate);
    return '';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-7xl h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-md flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">README Generator</h2>
                <p className="text-sm text-gray-400">Create professional GitHub profiles</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar - Templates */}
            <div className="w-80 border-r border-gray-700 flex flex-col">
              <div className="p-4 border-b border-gray-700">
                <h3 className="font-medium text-white mb-2">Choose Template</h3>
                <p className="text-sm text-gray-400">Select a template to get started</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {templates.map((template) => (
                  <motion.button
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedTemplate(template);
                      setAiGeneratedContent('');
                      setShowPreview(false);
                    }}
                    className={`w-full text-left p-3 rounded-md border transition-all ${
                      selectedTemplate?.id === template.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-700 hover:border-gray-600 bg-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <Code className="w-4 h-4 text-blue-400" />
                      <span className="font-medium text-white text-sm">{template.name}</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-1">{template.description}</p>
                    <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">
                      {template.category}
                    </span>
                  </motion.button>
                ))}

                {/* AI Generate Button */}
                <div className="pt-4 border-t border-gray-700">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedTemplate(null);
                      setShowPreview(false);
                    }}
                    className={`w-full text-left p-3 rounded-md border transition-all ${
                      !selectedTemplate && !aiGeneratedContent
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-700 hover:border-gray-600 bg-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span className="font-medium text-white text-sm">AI Generate</span>
                    </div>
                    <p className="text-xs text-gray-400">Personalized README with AI</p>
                    <span className="text-xs px-2 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded border border-purple-500/30">
                      AI Powered
                    </span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 flex flex-col">
              {/* AI Generation Panel */}
              {!selectedTemplate && (
                <div className="p-6 border-b border-gray-700 bg-gray-900/50">
                  <div className="flex items-center space-x-2 mb-4">
                    <Zap className="w-5 h-5 text-purple-400" />
                    <h3 className="font-medium text-white">AI-Powered README Generation</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Role Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Developer Role *
                      </label>
                      <div className="relative">
                        <button
                          onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                          className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-left text-white flex items-center justify-between hover:border-gray-500 transition-colors"
                        >
                          <span>{selectedRole || 'Select your role...'}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${showRoleDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {showRoleDropdown && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                            {developerRoles.map((role) => (
                              <button
                                key={role}
                                onClick={() => {
                                  setSelectedRole(role);
                                  setShowRoleDropdown(false);
                                }}
                                className="w-full text-left px-3 py-2 text-white hover:bg-gray-700 transition-colors flex items-center space-x-2"
                              >
                                <Briefcase className="w-4 h-4 text-gray-400" />
                                <span>{role}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Custom Prompt */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Additional Context (Optional)
                      </label>
                      <textarea
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="Describe your specialization, current projects, or specific focus areas..."
                        className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 resize-none h-20 hover:border-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={generateAIReadme}
                      disabled={!selectedRole || isGeneratingAI}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-2 rounded-md flex items-center space-x-2 transition-all font-medium disabled:cursor-not-allowed"
                    >
                      {isGeneratingAI ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Generate AI README</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Content Display */}
              <div className="flex-1 flex">
                {/* Code View */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900/30">
                    <div className="flex items-center space-x-2">
                      <Code className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium text-white">
                        {aiGeneratedContent ? `AI Generated (${selectedRole})` : selectedTemplate?.name || 'Select a template'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowPreview(!showPreview)}
                        disabled={!getCurrentContent()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-1 transition-colors disabled:cursor-not-allowed"
                      >
                        <Eye className="w-4 h-4" />
                        <span>{showPreview ? 'Code' : 'Preview'}</span>
                      </button>
                      
                      <button
                        onClick={() => downloadReadme(getCurrentContent())}
                        disabled={!getCurrentContent()}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-1 transition-colors disabled:cursor-not-allowed"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-hidden">
                    {getCurrentContent() ? (
                      showPreview ? (
                        <div className="h-full overflow-y-auto p-6 bg-white text-gray-900">
                          <div 
                            className="prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ 
                              __html: getCurrentContent()
                                .replace(/\n/g, '<br>')
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                .replace(/`(.*?)`/g, '<code>$1</code>')
                                .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                                .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                                .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                            }}
                          />
                        </div>
                      ) : (
                        <div className="h-full bg-gray-900">
                          <div className="h-8 bg-gray-800 flex items-center px-4 border-b border-gray-700">
                            <div className="flex space-x-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                            <span className="ml-4 text-sm text-gray-400">README.md</span>
                          </div>
                          <textarea
                            value={getCurrentContent()}
                            readOnly
                            className="w-full h-full bg-gray-900 text-gray-300 p-4 font-mono text-sm resize-none border-none outline-none"
                            style={{ height: 'calc(100% - 2rem)' }}
                          />
                        </div>
                      )
                    ) : (
                      <div className="h-full flex items-center justify-center bg-gray-900">
                        <div className="text-center">
                          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-400 mb-2">
                            {!selectedTemplate && !aiGeneratedContent ? 'Choose a Template or Generate with AI' : 'No Content Available'}
                          </h3>
                          <p className="text-gray-500">
                            {!selectedTemplate && !aiGeneratedContent 
                              ? 'Select a template from the sidebar or use AI generation to get started'
                              : 'Select a template to see the README content'
                            }
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReadmeGenerator;