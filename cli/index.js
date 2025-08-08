#!/usr/bin/env node
const minimist = require('minimist');
const { pushCommitToChain } = require('./commands/push');

const args = minimist(process.argv.slice(2));
const command = args._[0];

if (!command) {
    console.log(`
ChainGit CLI

Usage:
  chaingit push --repo <repo> --username <github-username> --token <github-token>

Example:
  chaingit push --repo my-repo --username myname --token ghp_123abc
`);
    process.exit(0);
}

switch (command) {
    case 'push':
        pushCommitToChain(args);
        break;
    default:
        console.log(`Unknown command: ${command}`);
}
