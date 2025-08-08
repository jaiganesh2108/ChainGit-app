const { ethers } = require("hardhat");

async function main() {
  const ChainGit = await ethers.getContractFactory("ChainGit");
  const chainGit = await ChainGit.deploy();
  await chainGit.deployed();

  console.log("ChainGit deployed to:", chainGit.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
