const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Support both Vite and CRA
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Store tokens temporarily (use Redis or database in production)
const tokenStore = new Map();

// GitHub OAuth configuration
const GITHUB_CONFIG = {
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackUrl: process.env.GITHUB_CALLBACK_URL
};

// Helper function to get commits from last 2 days
const getRecentCommits = async (accessToken, username) => {
  try {
    // Get user's repositories
    const reposResponse = await axios.get('https://api.github.com/user/repos', {
      headers: {
        'Authorization': `token ${accessToken}`,
        'User-Agent': 'ChainGit-App'
      },
      params: {
        sort: 'updated',
        per_page: 10
      }
    });

    const repos = reposResponse.data;
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    let allCommits = [];

    // Get commits from each repository
    for (const repo of repos.slice(0, 5)) { // Limit to first 5 repos to avoid rate limiting
      try {
        const commitsResponse = await axios.get(`https://api.github.com/repos/${repo.full_name}/commits`, {
          headers: {
            'Authorization': `token ${accessToken}`,
            'User-Agent': 'ChainGit-App'
          },
          params: {
            author: username,
            since: twoDaysAgo.toISOString(),
            per_page: 10
          }
        });

        const commits = commitsResponse.data.map(commit => ({
          repo: repo.name,
          message: commit.commit.message,
          sha: commit.sha.substring(0, 7),
          date: commit.commit.author.date,
          url: commit.html_url,
          additions: commit.stats?.additions || 0,
          deletions: commit.stats?.deletions || 0
        }));

        allCommits = [...allCommits, ...commits];
      } catch (error) {
        console.log(`Error fetching commits for ${repo.name}:`, error.message);
      }
    }

    // Sort by date (most recent first)
    return allCommits.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error('Error fetching recent commits:', error.message);
    return [];
  }
};

// Helper function to get user's GitHub activity
const getGitHubActivity = async (accessToken, username) => {
  try {
    const response = await axios.get(`https://api.github.com/users/${username}/events/public`, {
      headers: {
        'Authorization': `token ${accessToken}`,
        'User-Agent': 'ChainGit-App'
      },
      params: {
        per_page: 10
      }
    });

    return response.data.map(event => ({
      type: event.type.toLowerCase().replace('event', ''),
      repo: event.repo.name,
      description: getActivityDescription(event),
      timestamp: event.created_at
    }));
  } catch (error) {
    console.error('Error fetching GitHub activity:', error.message);
    return [];
  }
};

// Helper function to format activity descriptions
const getActivityDescription = (event) => {
  switch (event.type) {
    case 'PushEvent':
      const commitCount = event.payload.commits?.length || 1;
      return `Pushed ${commitCount} commit${commitCount > 1 ? 's' : ''} to ${event.payload.ref?.replace('refs/heads/', '') || 'main'}`;
    case 'CreateEvent':
      return `Created ${event.payload.ref_type} ${event.payload.ref || ''}`;
    case 'WatchEvent':
      return `Starred ${event.repo.name}`;
    case 'ForkEvent':
      return `Forked ${event.repo.name}`;
    case 'IssuesEvent':
      return `${event.payload.action} issue #${event.payload.issue.number}: ${event.payload.issue.title}`;
    case 'PullRequestEvent':
      return `${event.payload.action} pull request #${event.payload.pull_request.number}`;
    default:
      return `${event.type} in ${event.repo.name}`;
  }
};

// Routes

// Root API endpoint
app.get('/api', (req, res) => {
  res.json({ 
    message: 'ChainGit GitHub OAuth API',
    version: '1.0.0',
    endpoints: [
      'GET /api/health',
      'GET /api/github/auth',
      'GET /api/github/callback',
      'GET /api/github/profile/:sessionId'
    ]
  });
});

// 1. Initiate GitHub OAuth
app.get('/api/github/auth', (req, res) => {
  const state = Math.random().toString(36).substring(7);
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CONFIG.clientId}&redirect_uri=${GITHUB_CONFIG.callbackUrl}&scope=repo,user,read:user&state=${state}`;
  
  res.json({ authUrl, state });
});

// 2. GitHub OAuth callback
app.get('/api/github/callback', async (req, res) => {
  const { code, state } = req.query;

  if (!code) {
    return res.redirect('http://localhost:3000?error=access_denied');
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: GITHUB_CONFIG.clientId,
      client_secret: GITHUB_CONFIG.clientSecret,
      code,
      redirect_uri: GITHUB_CONFIG.callbackUrl
    }, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'ChainGit-App'
      }
    });

    const { access_token } = tokenResponse.data;

    if (!access_token) {
      return res.redirect('http://localhost:3000?error=token_error');
    }

    // Get user information
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${access_token}`,
        'User-Agent': 'ChainGit-App'
      }
    });

    const user = userResponse.data;
    const sessionId = Math.random().toString(36).substring(7);

    // Store token with session ID
    tokenStore.set(sessionId, {
      accessToken: access_token,
      user: user,
      createdAt: new Date()
    });

    // Redirect to frontend with session ID
    res.redirect(`http://localhost:5173/dashboard?session=${sessionId}&success=true`);
  } catch (error) {
    console.error('OAuth callback error:', error.message);
    res.redirect('http://localhost:3000?error=oauth_error');
  }
});

// 3. Get user profile and data
app.get('/api/github/profile/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  const session = tokenStore.get(sessionId);

  if (!session) {
    return res.status(401).json({ error: 'Invalid session' });
  }

  try {
    const { accessToken, user } = session;

    // Get detailed user info
    const [userResponse, reposResponse] = await Promise.all([
      axios.get('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${accessToken}`,
          'User-Agent': 'ChainGit-App'
        }
      }),
      axios.get('https://api.github.com/user/repos', {
        headers: {
          'Authorization': `token ${accessToken}`,
          'User-Agent': 'ChainGit-App'
        },
        params: {
          sort: 'updated',
          per_page: 10
        }
      })
    ]);

    const userData = userResponse.data;
    const repositories = reposResponse.data;

    // Get recent commits and activity
    const [recentCommits, recentActivity] = await Promise.all([
      getRecentCommits(accessToken, userData.login),
      getGitHubActivity(accessToken, userData.login)
    ]);

    // Calculate stats
    const stats = {
      totalCommits: recentCommits.length,
      totalStars: repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0),
      totalForks: repositories.reduce((sum, repo) => sum + repo.forks_count, 0),
      contributedTo: repositories.length
    };

    const profileData = {
      user: userData,
      repositories: repositories.map(repo => ({
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        updated_at: repo.updated_at,
        html_url: repo.html_url,
        private: repo.private,
        topics: repo.topics || []
      })),
      stats,
      recentActivity: recentActivity.slice(0, 10),
      recentCommits: recentCommits.slice(0, 10)
    };

    res.json(profileData);
  } catch (error) {
    console.error('Error fetching GitHub profile:', error.message);
    res.status(500).json({ error: 'Failed to fetch GitHub data' });
  }
});

// 4. Get recent commits for last 2 days
app.get('/api/github/commits/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  const session = tokenStore.get(sessionId);

  if (!session) {
    return res.status(401).json({ error: 'Invalid session' });
  }

  try {
    const { accessToken, user } = session;
    const commits = await getRecentCommits(accessToken, user.login);
    
    res.json({ commits });
  } catch (error) {
    console.error('Error fetching commits:', error.message);
    res.status(500).json({ error: 'Failed to fetch commits' });
  }
});

// 5. Refresh GitHub data
app.post('/api/github/refresh/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  const session = tokenStore.get(sessionId);

  if (!session) {
    return res.status(401).json({ error: 'Invalid session' });
  }

  // Simply return success - the frontend will re-fetch the data
  res.json({ success: true, message: 'Data refresh triggered' });
});

// 6. Disconnect GitHub
app.delete('/api/github/disconnect/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  if (tokenStore.has(sessionId)) {
    tokenStore.delete(sessionId);
    res.json({ success: true, message: 'GitHub account disconnected' });
  } else {
    res.status(404).json({ error: 'Session not found' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Cleanup old tokens (run every hour)
setInterval(() => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  for (const [sessionId, session] of tokenStore.entries()) {
    if (session.createdAt < oneHourAgo) {
      tokenStore.delete(sessionId);
    }
  }
}, 60 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GitHub OAuth callback: ${GITHUB_CONFIG.callbackUrl}`);
});