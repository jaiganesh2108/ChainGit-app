import React, { useState, useEffect } from 'react';
import { 
  User, 
  Settings, 
  Shield, 
  GitBranch, 
  Bell, 
  Eye, 
  EyeOff,
  Copy,
  RefreshCw,
  Calendar,
  MapPin,
  Link,
  Mail,
  Edit,
  Star,
  GitFork,
  BookOpen,
  Users,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Github
} from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [githubData, setGithubData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState({
    commits: true,
    audits: false,
    security: true,
    weekly: true
  });

  // Mock GitHub API call - replace with actual GitHub API integration
  const fetchGitHubData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data structure similar to GitHub API response
      const mockData = {
        user: {
          login: 'alice-johnson',
          name: 'Alice Johnson',
          avatar_url: 'https://avatars.githubusercontent.com/u/1234567?v=4',
          bio: 'Senior Blockchain Developer passionate about decentralized technologies',
          company: '@TechCorp',
          location: 'San Francisco, CA',
          email: 'alice@techcorp.com',
          blog: 'https://alice-johnson.dev',
          created_at: '2020-01-15T10:30:00Z',
          public_repos: 23,
          public_gists: 12,
          followers: 342,
          following: 89
        },
        stats: {
          totalCommits: 1247,
          totalStars: 156,
          totalForks: 43,
          contributedTo: 8
        },
        repositories: [
          {
            name: 'blockchain-tools',
            description: 'A collection of blockchain development utilities',
            language: 'TypeScript',
            stargazers_count: 45,
            forks_count: 12,
            updated_at: '2024-08-08T14:30:00Z',
            html_url: 'https://github.com/alice-johnson/blockchain-tools',
            private: false
          },
          {
            name: 'ml-models',
            description: 'Machine learning models for crypto price prediction',
            language: 'Python',
            stargazers_count: 78,
            forks_count: 23,
            updated_at: '2024-08-07T09:15:00Z',
            html_url: 'https://github.com/alice-johnson/ml-models',
            private: false
          },
          {
            name: 'payment-system',
            description: 'Decentralized payment processing system',
            language: 'Solidity',
            stargazers_count: 33,
            forks_count: 8,
            updated_at: '2024-08-05T16:45:00Z',
            html_url: 'https://github.com/alice-johnson/payment-system',
            private: true
          }
        ],
        recentActivity: [
          {
            type: 'push',
            repo: 'blockchain-tools',
            description: 'Pushed 3 commits to main branch',
            timestamp: '2024-08-09T10:30:00Z'
          },
          {
            type: 'star',
            repo: 'ethereum/go-ethereum',
            description: 'Starred ethereum/go-ethereum',
            timestamp: '2024-08-08T15:20:00Z'
          },
          {
            type: 'fork',
            repo: 'alice-johnson/ml-models',
            description: 'john-doe forked your repository',
            timestamp: '2024-08-07T12:10:00Z'
          },
          {
            type: 'issue',
            repo: 'payment-system',
            description: 'Closed issue #23: Fix gas optimization',
            timestamp: '2024-08-06T09:45:00Z'
          }
        ]
      };
      
      setGithubData(mockData);
    } catch (err) {
      setError('Failed to fetch GitHub data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGitHubData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const timeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  };

  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: '#f1e05a',
      TypeScript: '#2b7489',
      Python: '#3572A5',
      Solidity: '#AA6746',
      Go: '#00ADD8',
      Rust: '#dea584'
    };
    return colors[language] || '#858585';
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'push': return GitBranch;
      case 'star': return Star;
      case 'fork': return GitFork;
      case 'issue': return CheckCircle;
      default: return GitBranch;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-8 pb-12 bg-[#0f172a] text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-gray-400">Fetching GitHub data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-8 pb-12 bg-[#0f172a] text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={fetchGitHubData}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const userStats = [
    { label: 'Public Repos', value: githubData?.user.public_repos || 0, icon: BookOpen },
    { label: 'Total Stars', value: githubData?.stats.totalStars || 0, icon: Star },
    { label: 'Followers', value: githubData?.user.followers || 0, icon: Users },
    { label: 'Following', value: githubData?.user.following || 0, icon: Users }
  ];

  return (
    <div className="min-h-screen pt-8 pb-12 bg-[#0f172a] text-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* GitHub Profile Header */}
        <div className="bg-[#1e293b] rounded-xl p-8 shadow-lg border border-gray-700 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-600">
              {githubData?.user.avatar_url ? (
                <img 
                  src={githubData.user.avatar_url} 
                  alt="GitHub Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-600 to-green-500 flex items-center justify-center text-white text-2xl font-bold">
                  {githubData?.user.name?.[0] || 'U'}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-white">{githubData?.user.name || 'GitHub User'}</h1>
                <a 
                  href={`https://github.com/${githubData?.user.login}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-gray-400 hover:text-gray-200"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
                <button 
                  onClick={fetchGitHubData}
                  className="p-1 text-gray-400 hover:text-gray-200"
                  title="Refresh GitHub data"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
              <p className="text-blue-400 mb-2">@{githubData?.user.login}</p>
              <p className="text-gray-400 mb-4">{githubData?.user.bio || 'No bio available'}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                {githubData?.user.company && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{githubData.user.company}</span>
                  </div>
                )}
                {githubData?.user.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{githubData.user.location}</span>
                  </div>
                )}
                {githubData?.user.created_at && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {formatDate(githubData.user.created_at)}</span>
                  </div>
                )}
                {githubData?.user.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>{githubData.user.email}</span>
                  </div>
                )}
                {githubData?.user.blog && (
                  <div className="flex items-center gap-1">
                    <Link className="h-4 w-4" />
                    <a href={githubData.user.blog} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                      {githubData.user.blog}
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
              <Github className="h-4 w-4" />
              Connected
            </div>
          </div>
        </div>

        {/* GitHub Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {userStats.map((stat, index) => (
            <div key={index} className="bg-[#1e293b] rounded-xl p-4 shadow-lg border border-gray-700 text-center">
              <stat.icon className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white mb-1">{stat.value.toLocaleString()}</div>
              <div className="text-xs text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-[#1e293b] rounded-xl shadow-lg border border-gray-700 overflow-hidden">
          <div className="border-b border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: User },
                { id: 'repositories', label: 'Repositories', icon: BookOpen },
                { id: 'security', label: 'Security', icon: Shield },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Recent GitHub Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Recent GitHub Activity</h3>
                  <div className="space-y-3">
                    {githubData?.recentActivity.map((activity, index) => {
                      const ActivityIcon = getActivityIcon(activity.type);
                      return (
                        <div key={index} className="flex items-center gap-3 p-3 bg-[#0f172a] rounded-lg">
                          <ActivityIcon className="h-4 w-4 text-blue-400" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-200">{activity.description}</p>
                            <p className="text-xs text-gray-400">{timeAgo(activity.timestamp)} • {activity.repo}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* GitHub Integration Status */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">GitHub Integration</h3>
                  <div className="p-4 border border-gray-700 rounded-lg bg-[#0f172a]">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="font-medium text-gray-200">GitHub Account Connected</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">
                      Your GitHub account is successfully connected to ChainGit. Repository data and commit history are being synchronized.
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-500">Last sync: {timeAgo(new Date().toISOString())}</span>
                      <button 
                        onClick={fetchGitHubData}
                        className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Sync now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'repositories' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Your Repositories</h3>
                  <span className="text-sm text-gray-400">{githubData?.repositories.length} repositories</span>
                </div>
                <div className="space-y-4">
                  {githubData?.repositories.map((repo, index) => (
                    <div key={index} className="border border-gray-700 rounded-lg p-4 bg-[#0f172a]">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <a 
                              href={repo.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                            >
                              {repo.name}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                            {repo.private && (
                              <span className="px-2 py-1 bg-yellow-900 text-yellow-300 text-xs rounded">
                                Private
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mb-3">{repo.description || 'No description'}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            {repo.language && (
                              <div className="flex items-center gap-1">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: getLanguageColor(repo.language) }}
                                ></div>
                                <span>{repo.language}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              <span>{repo.stargazers_count}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <GitFork className="h-3 w-3" />
                              <span>{repo.forks_count}</span>
                            </div>
                            <span>Updated {timeAgo(repo.updated_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Cryptographic Keys</h3>
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-700 rounded-lg bg-[#0f172a]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-200">Public Key</span>
                        <button className="text-blue-400 hover:text-blue-500 text-sm">
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm font-mono text-gray-300 bg-[#1e293b] p-2 rounded break-all">
                        0x742d35Cc6634C0532925a3b8D49d26Ed34155e3a7b2F8E3c4d5A9B1C7E8F0a2b
                      </p>
                    </div>

                    <div className="p-4 border border-gray-700 rounded-lg bg-[#0f172a]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-200">Private Key</span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setShowPrivateKey(!showPrivateKey)}
                            className="text-gray-400 hover:text-gray-300"
                          >
                            {showPrivateKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          <button className="text-blue-400 hover:text-blue-500 text-sm">
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm font-mono text-gray-300 bg-[#1e293b] p-2 rounded break-all">
                        {showPrivateKey 
                          ? '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f'
                          : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">GitHub Integration Security</h3>
                  <div className="space-y-3">
                    <div className="p-4 border border-gray-700 rounded-lg bg-[#0f172a]">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <span className="font-medium text-gray-200">OAuth Connection Secured</span>
                      </div>
                      <p className="text-sm text-gray-400">
                        Your GitHub connection uses OAuth 2.0 with limited repository access permissions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">GitHub Sync Settings</h3>
                  <div className="space-y-4">
                    {Object.entries({
                      commits: { label: 'Commit Notifications', desc: 'Get notified when new commits are detected' },
                      repos: { label: 'Repository Updates', desc: 'Sync new repositories automatically' },
                      security: { label: 'Security Alerts', desc: 'GitHub security alerts and advisories' },
                      weekly: { label: 'Weekly Reports', desc: 'Weekly summary of GitHub activity' }
                    }).map(([key, config]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-200">{config.label}</p>
                          <p className="text-sm text-gray-400">{config.desc}</p>
                        </div>
                        <button
                          onClick={() => setNotifications(prev => ({...prev, [key]: !prev[key]}))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifications[key] ? 'bg-blue-600' : 'bg-gray-600'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications[key] ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">GitHub Integration</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={fetchGitHubData}
                      className="w-full p-4 border border-gray-700 rounded-lg text-left hover:bg-[#16213e]"
                    >
                      <p className="font-medium text-gray-200">Refresh GitHub Data</p>
                      <p className="text-sm text-gray-400">Manually sync your GitHub repositories and activity</p>
                    </button>
                    <button className="w-full p-4 border border-red-700 rounded-lg text-left hover:bg-[#5b1e1e]">
                      <p className="font-medium text-red-500">Disconnect GitHub</p>
                      <p className="text-sm text-red-400">Remove GitHub integration from your account</p>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;