import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CommitDetails.css";

const CommitDetails = () => {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/github/commits")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch commits");
        return res.json();
      })
      .then((data) => {
        setCommits(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="commit-details-loading">Loading commits...</p>;

  if (error)
    return (
      <section className="commit-details-error">
        <p>Error: {error}</p>
        <Link to="/dashboard" className="commit-details-link">← Back to Dashboard</Link>
      </section>
    );

  return (
    <main className="commit-details-container">
      <header>
        <h1 className="commit-details-title">All Commits</h1>
      </header>

      {commits.length === 0 ? (
        <p className="commit-details-empty">No commits found.</p>
      ) : (
        <section className="commit-list">
          {commits.map(({ hash, message, author, timestamp, walletid }) => (
            <article key={hash} className="commit-details-card">
              <p className="commit-details-info">
                <strong>Commit Hash:</strong> <code>{hash}</code>
              </p>
              <p className="commit-details-info">
                <strong>Message:</strong> {message}
              </p>
              <p className="commit-details-info">
                <strong>Author:</strong> {author}
              </p>
              <p className="commit-details-info">
                <strong>Timestamp:</strong> {new Date(timestamp).toLocaleString()}
              </p>
              <p className="commit-details-info">
                <strong>Wallet ID:</strong> <code>{walletid || "NO WALLET ID"}</code>
              </p>
            </article>
          ))}
        </section>
      )}

      <footer>
        <Link to="/dashboard" className="commit-details-link" aria-label="Back to Dashboard">
          ← Back to Dashboard
        </Link>
      </footer>
    </main>
  );
};

export default CommitDetails;
