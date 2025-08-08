import React, { useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Commits", path: "/commit/abc123" },
  { label: "Docs", path: "/docs" },
];

const Navbar = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isGitHubConnected, setIsGitHubConnected] = useState(false);
  const [gitHubUser, setGitHubUser] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const handleWalletConnect = useCallback(() => {
    if (!isConnected) {
      setWalletAddress("0xABCD...1234");
      setIsConnected(true);
    } else {
      setWalletAddress("");
      setIsConnected(false);
    }
  }, [isConnected]);

  const handleGitHubConnect = useCallback(() => {
    if (!isGitHubConnected) {
      setGitHubUser("developer");
      setIsGitHubConnected(true);
    } else {
      setGitHubUser("");
      setIsGitHubConnected(false);
    }
  }, [isGitHubConnected]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="navbar-container">
      <nav className="neon-navbar" aria-label="Main navigation">
        <div className="neon-container">

          {/* Brand Logo */}
          <NavLink to="/" className="neon-brand" aria-label="ChainGit Home">
            <div className="brand-icon">
              <div className="git-symbol">⧉</div>
            </div>
            <div className="brand-text">
              <h1 className="brand-title">ChainGit</h1>
              <span className="brand-sub">Web3 Protocol</span>
            </div>
          </NavLink>

          {/* Navigation Links */}
          <div className="neon-links">
            {navItems.map(({ label, path }) => (
              <NavLink
                key={label}
                to={path}
                className={({ isActive }) =>
                  `neon-link ${isActive ? "active" : ""}`
                }
              >
                <span className="link-text">{label}</span>
                <div className="link-glow"></div>
              </NavLink>
            ))}
          </div>

          {/* Actions Section */}
          <div className="neon-actions">
            {/* Dark Mode Toggle */}
            <button
              className="dark-mode-toggle"
              onClick={toggleDarkMode}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? "🔆" : "🌙"}
            </button>

            {/* Network Indicator */}
            <div className="network-indicator">
              <div className="network-pulse"></div>
              <span className="network-text">Testnet</span>
            </div>

            {/* GitHub Login Button */}
            <button
              className={`github-btn ${isGitHubConnected ? "connected" : ""}`}
              onClick={handleGitHubConnect}
            >
              <div className="github-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12...z" />
                </svg>
              </div>
              {isGitHubConnected && <span>@{gitHubUser}</span>}
            </button>

            {/* Wallet Button */}
            <button
              className={`neon-wallet-btn ${isConnected ? "connected" : ""}`}
              onClick={handleWalletConnect}
            >
              {isConnected ? (
                <div className="wallet-info">
                  <div className="wallet-avatar"></div>
                  <span>{walletAddress}</span>
                  <div className="connection-dot"></div>
                </div>
              ) : (
                <>
                  <span className="connect-text">Connect Wallet</span>
                  <div className="connect-icon">⚡</div>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Animated Border */}
        <div className="navbar-border"></div>
      </nav>
    </div>
  );
};

export default Navbar;
