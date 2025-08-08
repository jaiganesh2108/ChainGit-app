// File: client/src/pages/CommitDetails.jsx
import React from "react";
import { useParams } from "react-router-dom";

const CommitDetails = () => {
  const { id } = useParams();

  return (
    <div className="page">
      <h1>Commit Details</h1>
      <p>Commit Hash: {id}</p>
      <p>Further commit detail and blockchain/IPFS links could be shown here.</p>
    </div>
  );
};

export default CommitDetails;