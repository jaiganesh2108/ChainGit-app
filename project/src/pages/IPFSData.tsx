import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  Database, Hash, Calendar, User, Search, RefreshCw, ExternalLink
} from "lucide-react";
import contractABI from "./CommitLoggerABI.json";

const CONTRACT_ADDRESS = "0x157E0713375c955988B4500ab8e4d034F83cb7c5";

const LiveCommitFeed = () => {
  const [commits, setCommits] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  // Connect wallet & contract
const initEthers = async () => {
  if (typeof window.ethereum === "undefined") {
    console.error("No wallet found. Please install MetaMask or Avalanche Wallet.");
    return;
  }

  try {
    const newProvider = new ethers.BrowserProvider(window.ethereum);

    // Check if already connected
    const existingAccounts = await newProvider.send("eth_accounts", []);
    if (existingAccounts.length === 0) {
      // Only request if not connected yet
      await newProvider.send("eth_requestAccounts", []);
    }

    const signer = await newProvider.getSigner();
    const newContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
    
    setProvider(newProvider);
    setContract(newContract);

  } catch (error) {
    console.error("Wallet connection failed:", error);
  }
};


  const fetchCommits = async () => {
    if (!contract) return;

    try {
      const total = await contract.getTotalCommits();
      const totalNum = Number(total);

      const fetched: any[] = [];
      for (let i = totalNum - 1; i >= 0 && i > totalNum - 20; i--) {
        const commit = await contract.getCommit(i);

        const ipfsCid = commit[5];
        let ipfsData: any = {};
        try {
          const res = await fetch(`https://ipfs.io/ipfs/${ipfsCid}`);
          ipfsData = await res.json();
        } catch (err) {
          console.error(`Failed to fetch IPFS data for ${ipfsCid}:`, err);
        }

        fetched.push({
          commit_hash: commit[0],
          author_name: commit[1],
          author_email: commit[2],
          github_id: commit[3],
          wallet_address: commit[4],
          ipfs_cid: ipfsCid,
          commit_message: ipfsData.commit_message || "",
          repo_name: ipfsData.repo_name || "",
          files_changed: ipfsData.files_changed || [],
          timestamp: Number(commit[6]),
        });
      }
      setCommits(fetched);
    } catch (err) {
      console.error("Error fetching commits:", err);
    }
  };

  useEffect(() => {
    initEthers();
  }, []);

  useEffect(() => {
    if (!contract) return;
    fetchCommits();
    contract.on("CommitLogged", fetchCommits);
    return () => {
      contract.removeAllListeners("CommitLogged");
    };
  }, [contract]);

  const filteredData = commits.filter((c) =>
    [c.commit_message, c.commit_hash, c.author_name, c.repo_name]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp: number) =>
    new Date(timestamp * 1000).toLocaleString();

  return (
    <div className="min-h-screen pt-8 pb-12 bg-[#0f172a] text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Live Commit Feed</h1>
          <p className="text-gray-400">Fetched from Blockchain & IPFS</p>
        </div>

        {/* Search */}
        <div className="bg-[#1e293b] rounded-xl p-6 shadow-lg border border-gray-700 mb-8">
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <input
                type="text"
                placeholder="Search commits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg bg-[#0f172a] text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={fetchCommits}
              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-[#334155] rounded-lg transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Commit List */}
        <div className="bg-[#1e293b] rounded-xl shadow-lg border border-gray-700 overflow-hidden">
          <div className="divide-y divide-gray-700">
            {filteredData.map((commit, idx) => (
              <div key={idx} className="p-6 hover:bg-[#334155] transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-medium text-white">{commit.commit_message || "(No commit message)"}</h4>
                    <p className="text-sm text-gray-400">{commit.repo_name}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-2">
                      <span className="flex items-center gap-1"><Hash className="h-3 w-3" /> {commit.commit_hash}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(commit.timestamp)}</span>
                      <span className="flex items-center gap-1"><User className="h-3 w-3" /> {commit.author_name}</span>
                    </div>
                    {commit.files_changed.length > 0 && (
                      <ul className="mt-2 text-xs text-gray-400 list-disc ml-4">
                        {commit.files_changed.map((file: string, i: number) => (
                          <li key={i}>{file}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <a
                    href={`https://ipfs.io/ipfs/${commit.ipfs_cid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 text-gray-400 hover:text-blue-400 cursor-pointer" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <Database className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No commits found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveCommitFeed;
