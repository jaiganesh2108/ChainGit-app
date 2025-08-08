const { create } = require('ipfs-http-client');
require('dotenv').config();

// Infura credentials
const projectId = process.env.INFURA_PROJECT_ID;
const projectSecret = process.env.INFURA_PROJECT_SECRET;
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

// Connect to Infura IPFS
const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth
    }
});

const uploadToIPFS = async (data) => {
    try {
        const { path } = await client.add(JSON.stringify(data));
        console.log(`✅ Uploaded to IPFS: ${path}`);
        return path;
    } catch (err) {
        console.error('❌ IPFS upload failed:', err);
        throw err;
    }
};

module.exports = { uploadToIPFS };
