// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ChainGit {
    struct Commit {
        string cid; // IPFS CID
        string message;
        uint timestamp;
        address author;
    }

    Commit[] public commits;

    event CommitPushed(uint indexed id, string cid, string message, address indexed author);

    function pushCommit(string calldata cid, string calldata message) public {
        commits.push(Commit(cid, message, block.timestamp, msg.sender));
        emit CommitPushed(commits.length - 1, cid, message, msg.sender);
    }

    function getCommit(uint index) public view returns (string memory, string memory, uint, address) {
        Commit memory c = commits[index];
        return (c.cid, c.message, c.timestamp, c.author);
    }

    function getCommitCount() public view returns (uint) {
        return commits.length;
    }
}
