import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const features = [
    { icon: "🔐", title: "Blockchain Security", description: "Immutable commit tracking with cryptographic verification" },
    { icon: "⚡", title: "Lightning Fast", description: "Optimized Web3 integration with minimal latency" },
    { icon: "🌐", title: "Decentralized", description: "Distributed version control across the blockchain network" }
  ];

  return (
    <div className="home-container">
      <div className="home-content">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-icon">⧉</div>
          <h1 className="home-title">
            Welcome to <span className="chaingit-brand"><span className="brand-text">ChainGit</span></span>
          </h1>
          <p className="home-subtitle">The Future of Version Control</p>
          <p className="home-description">
            Track, verify, and secure your codebase using cutting-edge blockchain technology.
            Experience decentralized development with cryptographic commit verification.
          </p>
          <div className="cta-section">
            <Link to="/dashboard" className="primary-button">Get Started →</Link>
            <Link to="/docs" className="secondary-button">Documentation</Link>
          </div>
        </div>

        {/* Features */}
        <div className="features-section">
          <h2 className="features-title">Why Choose ChainGit?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-item"><div className="stat-number">10K+</div><div className="stat-label">Commits Verified</div></div>
            <div className="stat-item"><div className="stat-number">500+</div><div className="stat-label">Active Developers</div></div>
            <div className="stat-item"><div className="stat-number">99.9%</div><div className="stat-label">Uptime</div></div>
            <div className="stat-item"><div className="stat-number">24/7</div><div className="stat-label">Network Security</div></div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="tech-section">
          <h3 className="tech-title">Built with Modern Tech</h3>
          <div className="tech-stack">
            <div className="tech-item">Ethereum</div>
            <div className="tech-item">IPFS</div>
            <div className="tech-item">React</div>
            <div className="tech-item">Node.js</div>
            <div className="tech-item">Solidity</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
