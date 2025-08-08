import React from "react";
import { useParams, Link } from "react-router-dom";
import "./CommitDetails.css";

const CommitDetails = () => {
  const { id } = useParams();

  return (
    <div className="commit-details-container">
      <div className="commit-details-card">
        <h1 className="commit-details-title">Commit Details</h1>
        <p className="commit-details-info">
          <strong>Commit Hash:</strong> {id}
        </p>
        <p className="commit-details-info">
          Further commit details and blockchain/IPFS links could be shown here.
        </p>
        <Link to="/" className="commit-details-link">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default CommitDetails;
