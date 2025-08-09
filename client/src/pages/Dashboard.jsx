import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import "./Dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = ({ repos }) => {
  const [commits, setCommits] = useState([]);

  const fetchCommits = (repo) => {
    fetch(`http://localhost:5000/api/github/commits?owner=${repo.owner.login}&name=${repo.name}`, { credentials: "include" })
      .then(res => res.json())
      .then(data => setCommits(data))
      .catch(err => console.error("Error fetching commits:", err));
  };

  const totalCommits = commits.length;
  const authors = [...new Set(commits.map(c => c.author))];
  const commitDates = commits.map(c => new Date(c.timestamp).toLocaleDateString());

  const lineData = {
    labels: [...new Set(commitDates)],
    datasets: [{
      label: "Commits",
      data: [...new Set(commitDates)].map(
        date => commits.filter(c => new Date(c.timestamp).toLocaleDateString() === date).length
      ),
      borderColor: "#6366f1",
      backgroundColor: "rgba(99,102,241,0.15)",
      tension: 0.4,
      fill: true,
      pointBackgroundColor: "#ffffff",
      pointBorderColor: "#6366f1",
      pointRadius: 4
    }]
  };

  const doughnutData = {
    labels: authors,
    datasets: [{
      data: authors.map(author => commits.filter(c => c.author === author).length),
      backgroundColor: ["#6366f1", "#22c55e", "#facc15", "#ef4444", "#3b82f6"],
      borderWidth: 2
    }]
  };

  return (
    <div className="dashboard-container">
      <div className="container">

        <div className="header">
          <h1 className="dashboard-title">Developer Dashboard</h1>
        </div>

        {/* Repos List */}
        <h2 className="section-title">Your Repositories</h2>
        <div className="repo-list">
          {repos.map((repo, index) => (
            <div
              key={index}
              className="repo-card"
              onClick={() => fetchCommits(repo)}
            >
              <strong>{repo.name}</strong>
              <p>{repo.description || "No description"}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <h2>{totalCommits}</h2>
            <p>Total Commits</p>
          </div>
          <div className="stat-card">
            <h2>{authors.length}</h2>
            <p>Contributors</p>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-grid">
          <div className="chart-card">
            <h3>📈 Commits Over Time</h3>
            <div className="chart-wrapper">
              <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
          <div className="chart-card">
            <h3>👩‍💻 Commits by Author</h3>
            <div className="chart-wrapper">
              <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

        {/* Recent Commits */}
        <h2 className="section-title">Recent Commits</h2>
        <div className="commit-list">
          {commits.map((commit, index) => (
            <div key={index} className="commit-card">
              <h3>{commit.message}</h3>
              <p>
                <strong>{commit.hash.slice(0, 8)}...</strong> • {commit.author} • {new Date(commit.timestamp).toLocaleString()}
              </p>
              <Link to={`/commit/${commit.hash}`} className="view-link">
                View Details →
              </Link>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
