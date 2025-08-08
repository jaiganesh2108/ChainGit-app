// File: client/src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [commits, setCommits] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/github/commits")
      .then((res) => res.json())
      .then((data) => setCommits(data));
  }, []);

  return (
    <div className="page">
      <h1>Dashboard</h1>
      <div className="commit-list">
        {commits.map((commit, index) => (
          <div className="commit-card" key={index}>
            <h3>{commit.message}</h3>
            <p>{commit.hash} • commit {commit.author} • {commit.timestamp}</p>
            <Link to={`/commit/${commit.hash}`}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;