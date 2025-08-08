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

  const handleWalletConnect = useCallback(() => {
    try {
      if (!isConnected) {
        setWalletAddress("0xABCD...1234");
        setIsConnected(true);
      } else {
        setWalletAddress("");
        setIsConnected(false);
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
    }
  }, [isConnected]);

  const handleGitHubConnect = useCallback(() => {
    try {
      if (!isGitHubConnected) {
        // Mock GitHub login
        setGitHubUser("developer");
        setIsGitHubConnected(true);
      } else {
        setGitHubUser("");
        setIsGitHubConnected(false);
      }
    } catch (error) {
      console.error("GitHub connection error:", error);
    }
  }, [isGitHubConnected]);

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
                aria-current={({ isActive }) => (isActive ? "page" : undefined)}
              >
                <span className="link-text">{label}</span>
                <div className="link-glow"></div>
              </NavLink>
            ))}
          </div>

          {/* Actions Section */}
          <div className="neon-actions">
            {/* Network Indicator */}
            <div className="network-indicator" aria-label="Testnet Network Status">
              <div className="network-pulse"></div>
              <span className="network-text">Testnet</span>
            </div>

            {/* GitHub Login Button */}
            <button
              className={`github-btn ${isGitHubConnected ? "connected" : ""}`}
              onClick={handleGitHubConnect}
              aria-label={isGitHubConnected ? "Disconnect GitHub" : "Connect GitHub"}
              title={isGitHubConnected ? "Disconnect GitHub" : "Connect to GitHub"}
            >
              <div className="github-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              {isGitHubConnected && (
                <span className="github-user">@{gitHubUser}</span>
              )}
            </button>

            {/* Wallet Button */}
            <button
              className={`neon-wallet-btn ${isConnected ? "connected" : ""}`}
              onClick={handleWalletConnect}
              aria-label={isConnected ? "Disconnect Wallet" : "Connect Wallet"}
            >
              {isConnected ? (
                <div className="wallet-info">
                  <div className="wallet-avatar"></div>
                  <span className="wallet-address">{walletAddress}</span>
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
        
        {/* Animated border */}
        <div className="navbar-border"></div>
      </nav>
    </div>
  );
};

export default Navbar;