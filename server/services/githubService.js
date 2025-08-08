// server/services/githubService.js
const axios = require("axios");

async function getLatestCommits(owner, repo, token) {
    const res = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/commits`,
        {
            headers: {
                Authorization: `token ${token}`,
                Accept: "application/vnd.github.v3+json"
            }
        }
    );
    return res.data;
}

module.exports = { getLatestCommits };
