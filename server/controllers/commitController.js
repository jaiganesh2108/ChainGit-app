// File: server/controllers/commitController.js
const githubService = require("../services/githubService");
const ipfsService = require("../services/ipfsService");

exports.getCommits = async (req, res) => {
  try {
    const data = await githubService.fetchCommits();
    console.log("Sending commits:", data);  // Add this line
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching commits" });
  }
};

exports.getCommitById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Looking for commit with id:", id);
    const commits = await githubService.fetchCommits();
    const commit = commits.find((c) => c.hash === id);
    console.log("Found commit:", commit);
    if (!commit) return res.status(404).json({ error: "Commit not found" });
    res.json(commit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching commit" });
  }
};

