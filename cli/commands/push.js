const axios = require('axios');
const { uploadToIPFS } = require('../utils/ipfs');

async function pushCommitToChain(args) {
    const { repo, username, token } = args;

    if (!repo || !username || !token) {
        console.error("❌ Missing arguments. Use: chaingit push --repo <repo> --username <username> --token <token>");
        process.exit(1);
    }

    try {
        console.log(`📡 Fetching latest commit from ${username}/${repo}...`);
        const commitsResponse = await axios.get(
            `https://api.github.com/repos/${username}/${repo}/commits`,
            {
                headers: { Authorization: `token ${token}` }
            }
        );

        const latestCommit = commitsResponse.data[0];
        console.log(`📦 Latest commit SHA: ${latestCommit.sha}`);

        console.log(`🚀 Uploading commit to IPFS...`);
        const ipfsHash = await uploadToIPFS(latestCommit);

        console.log(`✅ Commit stored on IPFS: ${ipfsHash}`);

        // Blockchain integration (next step)
        console.log(`💡 Next: Push IPFS hash to Avalanche blockchain`);
    } catch (err) {
        console.error("❌ Error:", err.message);
    }
}

module.exports = { pushCommitToChain };
