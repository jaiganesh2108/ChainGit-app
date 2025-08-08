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

  return (
    <nav className="neon-navbar" aria-label="Main navigation">
      <div className="neon-container">
        {/* Brand Logo */}
        <NavLink to="/" className="neon-brand" aria-label="ChainGit Home">
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
              {label}
            </NavLink>
          ))}
        </div>

        {/* Wallet & Network Actions */}
        <div className="neon-actions">
          {/* Network Indicator */}
          <div className="network-dot" aria-label="Testnet Network Status">
            <span className="ping" />
            <span className="text">Testnet</span>
          </div>

          {/* Wallet Button */}
          <button
            className={`neon-wallet-btn ${isConnected ? "connected" : ""}`}
            onClick={handleWalletConnect}
            aria-label={isConnected ? "Disconnect Wallet" : "Connect Wallet"}
          >
            {isConnected ? (
              <div className="wallet-info">
                <div className="wallet-avatar" />
                <span>{walletAddress}</span>
              </div>
            ) : (
              <span>Connect Wallet</span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;