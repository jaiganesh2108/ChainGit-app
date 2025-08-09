import React, { useState, useCallback, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { ethers } from "ethers";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Commits", path: "/commit/abc123" },
  { label: "Docs", path: "/docs" },
];

const Navbar = ({ setRepos }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isGitHubConnected, setIsGitHubConnected] = useState(false);
  const [gitHubUser, setGitHubUser] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Apply theme on load
  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-theme" : "light-theme";
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleWalletConnect = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setWalletAddress(address);
      setIsConnected(true);
    } catch (err) {
      alert("Please install MetaMask");
    }
  };

  // ✅ GitHub connect via backend OAuth
  const handleGitHubConnect = useCallback(() => {
    window.location.href = "http://localhost:5000/auth/github";
  }, []);

  // ✅ Check GitHub auth status on load
  useEffect(() => {
    fetch("http://localhost:5000/auth/status", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.username) {
          setGitHubUser(data.username);
          setIsGitHubConnected(true);
          setRepos(data.repos || []); // Send repos to Dashboard via parent state
        }
      })
      .catch((err) => console.log("GitHub auth check failed", err));
  }, [setRepos]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
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
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? "🔆" : "🌙"}
            </button>

            {/* GitHub Login */}
            <button
              className={`github-btn ${isGitHubConnected ? "connected" : ""}`}
              onClick={handleGitHubConnect}
            >
              <div className="github-icon">🐙</div>
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
        <div className="navbar-border"></div>
      </nav>
    </div>
  );
};

export default Navbar;
