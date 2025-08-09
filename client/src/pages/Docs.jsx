import React from "react";
import "./Docs.css";

export default function Docs() {
  return (
    <div className="docs-container p-8 max-w-4xl mx-auto text-gray-800">
      
      {/* Main Heading */}
      <h1 className="text-4xl font-bold mb-6">
        What is ChainGit?
      </h1>

      {/* Main Paragraph */}
      <p className="mb-10 leading-relaxed">
        ChainGit is an innovative platform designed to enhance trust and
        transparency in software and AI development by bridging GitHub,
        blockchain and decentralized storage. It allows developers and
        organizations to create cryptographic, immutable proofs of selected
        or model versions and optionally attach audit document. These proofs are
        stored on the blockchain providing an unchangeable public ledger of development
        history without exposing the source code or proprietary models.
      </p>

      {/* Section 1 */}
      <h2 className="text-2xl font-semibold mb-3">Purpose</h2>
      <p className="mb-8 leading-relaxed">
        Traditional version control systems like GitHub are excellent for collaboration but lack cryptographic immutability.
        Anyone can rewrite history using force pushes or delete repositories entirely. This becomes a challenge in
        high-stakes domains like AI, healthcare, finance, and defense, where proving authorship, reproducibility, or audit compliance is essential.
        ChainGit introduces a trust layer that records what was developed, when,
        and by whom — all verifiable on-chain, without exposing sensitive files.
      </p>

      {/* Section 2 */}
      <h2 className="text-2xl font-semibold mb-3">Workflow</h2>
      <pre className="mb-8 leading-relaxed whitespace-pre-wrap">
      1. Login with GitHub and connect wallet
      2. Select repository and choose commit(s)
      3. Optionally attach audit files (e.g., fairness report, model summary)
      4. Push metadata to blockchain
      5. Hash + audit file CID are permanently recorded in smart contract
      6. Dashboard allows public or internal users to verify commit authenticity
      </pre>

      {/* Section 3 */}
      <h2 className="text-2xl font-semibold mb-3">Benefits</h2>
      <pre className="mb-8 leading-relaxed whitespace-pre-wrap">
{`For Developers:
- Provides verifiable proof of work and authorship
- Enables cryptographic commitment to ethical model development

For Organizations:
- Ensures compliance with security and audit regulations
- Logs critical project checkpoints immutably without revealing IP

For Governments and Reviewers:
- Offers a reliable way to trace how models were developed and by whom
- Useful in assessing model transparency, fairness, or reproducibility`}
      </pre>

      {/* Section 4 */}
      <h2 className="text-2xl font-semibold mb-3">Privacy and Control</h2>
      <pre className="mb-8 leading-relaxed whitespace-pre-wrap">
{`ChainGit is designed with full respect for developer and organizational privacy along with the following postulates:
- No source code or model files are pushed to the chain
- Only the cryptographic hash of selected commits and metadata are stored
- Audit files are optional and can be uploaded to public or private IPFS gateways
- Fully compatible with private GitHub repositories and can be deployed on private blockchains`}
      </pre>

      {/* Section 5 */}
      <h2 className="text-2xl font-semibold mb-3">Innovation</h2>
      <p className="mb-8 leading-relaxed">
        Unlike previous attempts such as Gitchain or blockchain loggers, ChainGit focuses on selective commit proofing,
        wallet-based authorship, and optional audit linking, all while working in parallel with existing GitHub workflows.
        No current live project offers this level of integration and user control, making ChainGit a novel and practical
        tool for building trustworthy AI and software systems.
      </p>

      {/* Key Features */}
      <h2 className="text-2xl font-semibold mb-3">Key Features</h2>
      <pre className="mb-8 leading-relaxed whitespace-pre-wrap">
{`1. GitHub Integration
2. Selective Commit Logging
3. Blockchain Proofs
4. Optional Audit Uploads
5. CLI and UI Options
6. Privacy-Aware Architecture`}
      </pre>
    </div>
  );
}
