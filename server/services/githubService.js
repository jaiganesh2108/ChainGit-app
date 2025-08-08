// File: server/services/githubService.js
exports.fetchCommits = async () => {
  // Mock response, in real usage connect with GitHub API using Octokit
  return [
    {
      hash: "abc123",
      message: "Initial commit",
      author: "Jai",
      timestamp: "2025-08-03 20:00",
    },
    {
      hash: "def456",
      message: "Added ML model",
      author: "Ganesh",
      timestamp: "2025-08-04 10:00",
    },
  ];
};