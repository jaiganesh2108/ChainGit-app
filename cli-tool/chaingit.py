#!/usr/bin/env python3
import os
import sys
import requests
import asyncio
import threading
from git import Repo
from web3 import Web3
from eth_account import Account
from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket
import uvicorn

load_dotenv()

# ---------------- ENVIRONMENT VARIABLES ----------------
PINATA_API_KEY = os.getenv("PINATA_API_KEY")
PINATA_API_SECRET = os.getenv("PINATA_API_SECRET")
AVALANCHE_RPC_URL = os.getenv("AVALANCHE_RPC_URL", "https://api.avax-test.network/ext/bc/C/rpc")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")

# ---------------- SMART CONTRACT ABI ----------------
CONTRACT_ABI = [
	{
		"anonymous": False,
		"inputs": [
			{
				"indexed": True,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": False,
				"internalType": "string",
				"name": "commitHash",
				"type": "string"
			},
			{
				"indexed": False,
				"internalType": "string",
				"name": "authorName",
				"type": "string"
			},
			{
				"indexed": False,
				"internalType": "string",
				"name": "authorEmail",
				"type": "string"
			},
			{
				"indexed": False,
				"internalType": "string",
				"name": "githubId",
				"type": "string"
			},
			{
				"indexed": False,
				"internalType": "address",
				"name": "walletAddress",
				"type": "address"
			},
			{
				"indexed": False,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "CommitLogged",
		"type": "event"
	},
	{
		"inputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "commitHash",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "authorName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "authorEmail",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "githubId",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "walletAddress",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "commitMessage",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"internalType": "struct CommitLogger.Commit",
				"name": "commit",
				"type": "tuple"
			}
		],
		"name": "logCommit",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "commits",
		"outputs": [
			{
				"internalType": "string",
				"name": "commitHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "authorName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "authorEmail",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "githubId",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "walletAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "commitMessage",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getCommit",
		"outputs": [
			{
				"internalType": "string",
				"name": "commitHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "authorName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "authorEmail",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "githubId",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "walletAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "commitMessage",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTotalCommits",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
# ---------------- FASTAPI + WEBSOCKET ----------------
app = FastAPI()
latest_commit = {}

@app.get("/latest-commit")
def get_latest_commit_api():
    return latest_commit

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        await asyncio.sleep(1)
        await websocket.send_json(latest_commit)

def update_commit(commit_data):
    global latest_commit
    latest_commit = commit_data

def run_backend():
    uvicorn.run(app, host="0.0.0.0", port=8000)

# ---------------- GIT + BLOCKCHAIN LOGIC ----------------
def get_latest_commit():
    repo = Repo("D:/ChainGit-app")
    c = repo.head.commit
    return {
        "commit_hash": c.hexsha,
        "author_name": c.author.name,
        "author_email": c.author.email,
        "message": c.message.strip(),
        "timestamp": int(c.committed_datetime.timestamp())
    }

def pin_json_to_ipfs(data):
    url = "https://api.pinata.cloud/pinning/pinJSONToIPFS"
    headers = {
        "pinata_api_key": PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_API_SECRET,
    }
    res = requests.post(url, json={"pinataContent": data}, headers=headers)
    if res.status_code == 200:
        return res.json()["IpfsHash"]
    else:
        print("Pinata error:", res.text)
        sys.exit(1)

def push_commit_to_chain(commit_data, ipfs_hash):
    w3 = Web3(Web3.HTTPProvider(AVALANCHE_RPC_URL))
    account = Account.from_key(PRIVATE_KEY)
    contract = w3.eth.contract(address=Web3.to_checksum_address(CONTRACT_ADDRESS), abi=CONTRACT_ABI)
    nonce = w3.eth.get_transaction_count(account.address)

    commit_struct = (
        ipfs_hash,
        commit_data["author_name"],
        commit_data["author_email"],
        "jaiganesh2108",
        account.address,
        commit_data["message"],
        commit_data["timestamp"]
    )

    txn = contract.functions.logCommit(commit_struct).build_transaction({
        "chainId": 43113,  # Fuji Testnet
        "gas": 500000,
        "gasPrice": w3.eth.gas_price,
        "nonce": nonce,
    })

    signed = account.sign_transaction(txn)
    tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
    print(f"Sent tx: {tx_hash.hex()}, waiting for confirmation...")
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    print(f"Tx mined in block {receipt.blockNumber}")

# ---------------- MAIN SCRIPT ----------------
def main():
    if len(sys.argv) < 2 or sys.argv[1] != "--push-to-chain":
        print("Usage: python chaingit.py --push-to-chain")
        sys.exit(1)

    commit_data = get_latest_commit()
    print("Latest commit data:", commit_data)

    ipfs_hash = pin_json_to_ipfs(commit_data)
    print("Pinned to IPFS:", ipfs_hash)

    push_commit_to_chain(commit_data, ipfs_hash)

    # Update WebSocket API
    commit_data["ipfs_hash"] = ipfs_hash
    update_commit(commit_data)

if __name__ == "__main__":
    # Start backend server in a separate thread
    threading.Thread(target=run_backend, daemon=True).start()
    main()
