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
  Github,
  GitCommit,
  Clock,
  Code,
  LogOut
} from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [githubData, setGithubData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking');
  const [notifications, setNotifications] = useState({
    commits: true,
    repos: false,
    security: true,
    weekly: true
  });

  const API_BASE = 'http://localhost:5000/api';

  // Check server status
  const checkServerStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/health`);
      if (response.ok) {
        setServerStatus('online');
        setError(null);
        return true;
      }
    } catch (err) {
      setServerStatus('offline');
      setError('Cannot connect to server. Make sure your Express server is running on port 5000.');
      return false;
    }
  };

  // Check for OAuth callback on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const session = urlParams.get('session');
    const success = urlParams.get('success');
    const error = urlParams.get('error');

    if (session && success) {
      setSessionId(session);
      setIsConnected(true);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (error) {
      setError(`Authentication failed: ${error}`);
    }

    // Check server status on mount
    checkServerStatus();
  }, []);

  // Fetch GitHub data when session is available
  useEffect(() => {
    if (sessionId && serverStatus === 'online') {
      fetchGitHubData();
    }
  }, [sessionId, serverStatus]);

  const initiateGitHubAuth = async () => {
    const serverOnline = await checkServerStatus();
    if (!serverOnline) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/github/auth`);
      const data = await response.json();
      
      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        throw new Error('No auth URL received');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('Failed to initiate GitHub authentication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchGitHubData = async () => {
    if (!sessionId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/github/profile/${sessionId}`);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please reconnect your GitHub account.');
        }
        throw new Error(`Failed to fetch GitHub data: ${response.status}`);
      }
      
      const data = await response.json();
      setGithubData(data);
      setIsConnected(true);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const disconnectGitHub = async () => {
    if (!sessionId) return;

    try {
      const response = await fetch(`${API_BASE}/github/disconnect/${sessionId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setGithubData(null);
        setSessionId(null);
        setIsConnected(false);
        setError(null);
      }
    } catch (error) {
      console.error('Disconnect error:', error);
      setError('Failed to disconnect GitHub account');
    }
  };

  const refreshGitHubData = async () => {
    if (!sessionId) return;

    try {
      await fetch(`${API_BASE}/github/refresh/${sessionId}`, {
        method: 'POST'
      });
      
      // Re-fetch the data
      await fetchGitHubData();
    } catch (error) {
      console.error('Refresh error:', error);
      setError('Failed to refresh GitHub data');
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

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
      Rust: '#dea584',
      Java: '#b07219',
      'C++': '#f34b7d',
      HTML: '#e34c26',
      CSS: '#563d7c'
    };
    return colors[language] || '#858585';
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'push': return GitBranch;
      case 'watch': return Star;
      case 'fork': return GitFork;
      case 'issues': return CheckCircle;
      case 'pullrequest': return GitCommit;
      case 'create': return Code;
      default: return GitBranch;
    }
  };

  // Server offline state
  if (serverStatus === 'offline') {
    return (
      <div className="min-h-screen pt-8 pb-12 bg-[#0f172a] text-gray-200 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Server Not Running</h2>
          <p className="text-gray-400 mb-8">
            The Express server is not running. Please start your server by running:
          </p>
          <div className="bg-[#1e293b] p-4 rounded-lg mb-6 text-left">
            <code className="text-green-400">Check your internet!</code>
            <p className="text-gray-400 text-sm mt-2">or</p>
            <code className="text-green-400">Try later!</code>
          </div>
          <button 
            onClick={checkServerStatus}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
          >
            Check Server Status
          </button>
          
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-8 pb-12 bg-[#0f172a] text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-gray-400">
            {sessionId ? 'Fetching GitHub data...' : 'Connecting to GitHub...'}
          </p>
        </div>
      </div>
    );
  }

  // Error state (but server is online)
  if (error && !isConnected && serverStatus === 'online') {
    return (
      <div className="min-h-screen pt-8 pb-12 bg-[#0f172a] text-gray-200 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error}</p>
          <div className="space-x-4">
            <button 
              onClick={initiateGitHubAuth}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Try Again
            </button>
            <button 
              onClick={() => setError(null)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not connected state
  if (!isConnected || !githubData) {
    return (
      <div className="min-h-screen pt-8 pb-12 bg-[#0f172a] text-gray-200 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Github className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your GitHub Account</h2>
          <p className="text-gray-400 mb-8">
            Connect your GitHub account to sync your repositories, commits, and activity data.
          </p>
          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          <button 
            onClick={initiateGitHubAuth}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-lg font-medium hover:from-blue-700 hover:to-green-600 transition-all disabled:opacity-50"
          >
            {loading ? 'Connecting...' : 'Connect GitHub Account'}
          </button>
          <div className="mt-4 text-xs text-gray-500">
            Server Status: <span className="text-green-400">Online</span>
          </div>
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
        
        {/* Error Banner */}
        {error && isConnected && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="text-red-400">{error}</p>
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300"
            >
              ×
            </button>
          </div>
        )}

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
                  onClick={refreshGitHubData}
                  className="p-1 text-gray-400 hover:text-gray-200"
                  title="Refresh GitHub data"
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button 
                  onClick={disconnectGitHub}
                  className="p-1 text-red-400 hover:text-red-300"
                  title="Disconnect GitHub"
                >
                  <LogOut className="h-4 w-4" />
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
            <div className="bg-gradient-to-r from-green-600 to-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
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
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: User },
                { id: 'repositories', label: 'Repositories', icon: BookOpen },
                { id: 'commits', label: 'Recent Commits', icon: GitCommit },
                { id: 'security', label: 'Security', icon: Shield },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${
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
                    {githubData?.recentActivity?.length > 0 ? (
                      githubData.recentActivity.map((activity, index) => {
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
                      })
                    ) : (
                      <p className="text-gray-400 text-center py-4">No recent activity found</p>
                    )}
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
                        disabled={loading}
                      >
                        <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
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
                  {githubData?.repositories?.map((repo, index) => (
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

            {activeTab === 'commits' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Recent Commits (Last 2 Days)</h3>
                  <span className="text-sm text-gray-400">{githubData?.recentCommits?.length || 0} commits</span>
                </div>
                <div className="space-y-3">
                  {githubData?.recentCommits?.length > 0 ? (
                    githubData.recentCommits.map((commit, index) => (
                      <div key={index} className="border border-gray-700 rounded-lg p-4 bg-[#0f172a]">
                        <div className="flex items-start gap-3">
                          <GitCommit className="h-4 w-4 text-blue-400 mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <a 
                                href={commit.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 font-mono text-sm"
                              >
                                {commit.sha}
                              </a>
                              <span className="text-xs text-gray-500">in</span>
                              <span className="text-sm text-gray-300 font-medium">{commit.repo}</span>
                            </div>
                            <p className="text-sm text-gray-200 mb-2 break-words">{commit.message}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{timeAgo(commit.date)}</span>
                              </div>
                              {commit.additions > 0 && (
                                <span className="text-green-400">+{commit.additions}</span>
                              )}
                              {commit.deletions > 0 && (
                                <span className="text-red-400">-{commit.deletions}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <GitCommit className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No commits found in the last 2 days</p>
                    </div>
                  )}
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
                        <button 
                          onClick={() => copyToClipboard('0x742d35Cc6634C0532925a3b8D49d26Ed34155e3a7b2F8E3c4d5A9B1C7E8F0a2b')}
                          className="text-blue-400 hover:text-blue-500 text-sm"
                        >
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
                          <button 
                            onClick={() => copyToClipboard('0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f')}
                            className="text-blue-400 hover:text-blue-500 text-sm"
                          >
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
                    <div className="p-4 border border-gray-700 rounded-lg bg-[#0f172a]">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <span className="font-medium text-gray-200">Session Secured</span>
                      </div>
                      <p className="text-sm text-gray-400">
                        Your session is encrypted and automatically expires after 1 hour of inactivity.
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
                      onClick={refreshGitHubData}
                      disabled={loading}
                      className="w-full p-4 border border-gray-700 rounded-lg text-left hover:bg-[#16213e] disabled:opacity-50"
                    >
                      <div className="flex items-center gap-3">
                        <RefreshCw className={`h-5 w-5 text-blue-400 ${loading ? 'animate-spin' : ''}`} />
                        <div>
                          <p className="font-medium text-gray-200">Refresh GitHub Data</p>
                          <p className="text-sm text-gray-400">Manually sync your GitHub repositories and activity</p>
                        </div>
                      </div>
                    </button>
                    <button 
                      onClick={disconnectGitHub}
                      className="w-full p-4 border border-red-700 rounded-lg text-left hover:bg-[#5b1e1e]"
                    >
                      <div className="flex items-center gap-3">
                        <LogOut className="h-5 w-5 text-red-500" />
                        <div>
                          <p className="font-medium text-red-500">Disconnect GitHub</p>
                          <p className="text-sm text-red-400">Remove GitHub integration from your account</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Session Information</h3>
                  <div className="p-4 border border-gray-700 rounded-lg bg-[#0f172a]">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Session ID:</span>
                        <span className="text-gray-300 font-mono">{sessionId || 'Not available'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Server Status:</span>
                        <span className="text-green-400">Connected</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">API Base:</span>
                        <span className="text-gray-300 font-mono">{API_BASE}</span>
                      </div>
                    </div>
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