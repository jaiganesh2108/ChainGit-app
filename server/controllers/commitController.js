// File: server/controllers/commitController.js
const githubService = require("../services/githubService");
const ipfsService = require("../services/ipfsService");

exports.getCommits = async (req, res) => {
  try {
    const data = await githubService.fetchCommits();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching commits" });
  }
};