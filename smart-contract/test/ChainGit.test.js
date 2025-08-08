const { expect } = require("chai");

describe("ChainGit", function () {
  let chainGit;

  beforeEach(async function () {
    const ChainGit = await ethers.getContractFactory("ChainGit");
    chainGit = await ChainGit.deploy();
    await chainGit.deployed();
  });

  it("should push and retrieve a commit", async function () {
    await chainGit.pushCommit("QmHash123", "Initial commit");

    const count = await chainGit.getCommitCount();
    expect(count).to.equal(1);

    const [cid, message, , author] = await chainGit.getCommit(0);
    expect(cid).to.equal("QmHash123");
    expect(message).to.equal("Initial commit");
  });
});
