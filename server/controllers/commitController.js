const axios = require('axios');
const { uploadToIPFS } = require('../services/ipfsService');

const uploadLatestCommit = async (req, res) => {
    try {
        const { username, token, repo } = req.body;

        // 1. Get latest commit from GitHub API
        const commitsResponse = await axios.get(
            `https://api.github.com/repos/${username}/${repo}/commits`,
            {
                headers: { Authorization: `token ${token}` }
            }
        );

        const latestCommit = commitsResponse.data[0];
        console.log("Latest commit:", latestCommit.sha);

        // 2. Upload commit to IPFS
        const ipfsHash = await uploadToIPFS(latestCommit);

        // 3. Respond
        res.json({
            message: "Commit uploaded to IPFS",
            ipfsHash,
            commitSHA: latestCommit.sha
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = { uploadLatestCommit };
