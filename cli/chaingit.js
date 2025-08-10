#!/usr/bin/env node
import { execSync } from "child_process";
import { ethers } from "ethers";

// Replace with your contract's ABI and deployed address
const CONTRACT_ABI = [
  "event CommitPushed(bytes32 commitHash, string authorName, string authorEmail, address walletAddress, string commitMessage, uint256 commitTimestamp)",
  "function pushCommit(bytes32 commitHash, string authorName, string authorEmail, string commitMessage, uint256 commitTimestamp) public"
];

const CONTRACT_ADDRESS = "0xYourContractAddressHere";

async function main() {
  const args = process.argv.slice(2);
  if (!args.includes("--push-to-chain")) {
    console.log("Usage: chaingit --push-to-chain");
    process.exit(0);
  }

  try {
    // Get latest commit info from git
    const commitHashStr = execSync("git rev-parse HEAD").toString().trim();
    const authorName = execSync("git log -1 --pretty=format:'%an'").toString().trim();
    const authorEmail = execSync("git log -1 --pretty=format:'%ae'").toString().trim();
    const commitMessage = execSync("git log -1 --pretty=format:'%s'").toString().trim();
    const commitDateStr = execSync("git log -1 --pretty=format:'%ct'").toString().trim(); // unix timestamp in seconds
    const commitTimestamp = parseInt(commitDateStr);

    // Convert commit hash string (hex) to bytes32
    // Ensure 0x prefix is present
    const commitHash = commitHashStr.startsWith("0x") ? commitHashStr : "0x" + commitHashStr;

    // Load wallet private key and Avalanche RPC from env
    const privateKey = process.env.PRIVATE_KEY;
    const rpcUrl = process.env.AVALANCHE_RPC_URL;

    if (!privateKey) {
      console.error("Error: PRIVATE_KEY env variable is not set.");
      process.exit(1);
    }
    if (!rpcUrl) {
      console.error("Error: AVALANCHE_RPC_URL env variable is not set.");
      process.exit(1);
    }

    // Setup ethers provider and wallet
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    // Setup contract instance
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

    console.log("Sending transaction to Avalanche contract...");

    // Send transaction to push commit metadata
    const tx = await contract.pushCommit(
      commitHash,
      authorName,
      authorEmail,
      commitMessage,
      commitTimestamp
    );

    console.log("Transaction sent. Waiting for confirmation...");
    const receipt = await tx.wait();

    console.log("Transaction confirmed!");
    console.log("Tx Hash:", receipt.transactionHash);

  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

main();
    