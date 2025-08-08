const { create } = require('ipfs-http-client');
require('dotenv').config();

const projectId = process.env.INFURA_PROJECT_ID;
const projectSecret = process.env.INFURA_PROJECT_SECRET;
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth
    }
});

async function uploadToIPFS(data) {
    const { path } = await client.add(JSON.stringify(data));
    return path;
}

module.exports = { uploadToIPFS };
