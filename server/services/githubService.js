// File: server/services/githubService.js
exports.fetchCommits = async () => {
  // Mock response, in real usage connect with GitHub API using Octokit
  return [
    {
      hash: "abc123",
      message: "Initial commit",
      author: "Jai",
      timestamp: "2025-08-03 20:00",
      walletid: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    },
    {
      hash: "def456",
      message: "Added ML model",
      author: "Ganesh",
      timestamp: "2025-08-04 10:00",
      walletid: "0x53d284357ec70cE289D6D64134DfAc8E511c8a3D",
    },
  ];
};