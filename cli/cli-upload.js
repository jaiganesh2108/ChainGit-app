#!/usr/bin/env node

import { Command } from "commander";
import { ethers } from "ethers";
import fs from "fs";
import crypto from "crypto";
import axios from "axios";

const program = new Command();

program
  .name("chaingit")
  .description("CLI tool for pushing commit proofs to blockchain")
  .version("1.0.0");

program
  .command("log")
  .description("Record a commit proof on-chain")
  .requiredOption("-r, --repo <name>", "GitHub repository (owner/name)")
  .requiredOption("-c, --commit <hash>", "Commit hash to log")
  .option("-m, --message <message>", "Commit message")
  .option("-a, --audit <file>", "Optional audit file path")
  .action(async (opts) => {
    try {
      const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

      // Load contract ABI + address
      const abi = JSON.parse(fs.readFileSync("./ChainGit.json"));
      const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

      // Hash commit data
      const commitHash = crypto.createHash("sha256").update(opts.commit).digest("hex");

      // Upload audit file to IPFS if provided
      let auditCID = "";
      if (opts.audit) {
        const fileBuffer = fs.readFileSync(opts.audit);
        const res = await axios.post("https://api.web3.storage/upload", fileBuffer, {
          headers: {
            "Authorization": `Bearer ${process.env.WEB3_STORAGE_TOKEN}`,
            "Content-Type": "application/octet-stream",
          },
        });
        auditCID = res.data.cid;
      }

      // Push to blockchain
      const tx = await contract.recordCommit(commitHash, opts.message || "", auditCID);
      console.log(`Transaction sent: ${tx.hash}`);
      await tx.wait();
      console.log(`Commit proof recorded successfully.`);
    } catch (err) {
      console.error("Error:", err.message);
    }
  });

program.parse();
