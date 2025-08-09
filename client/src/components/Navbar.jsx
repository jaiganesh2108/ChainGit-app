import React, { useState, useCallback, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import { ethers } from 'ethers';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Commits', path: '/commit/abc123' },
  { label: 'Docs', path: '/docs' },
];

const Navbar = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isGitHubConnected, setIsGitHubConnected] = useState(false);
  const [gitHubUser, setGitHubUser] = useState('');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [isConnecting, setIsConnecting] = useState(false);

  // Apply theme on load and when changed
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleWalletConnect = async () => {
    if (isConnecting) return;
    
    try {
      setIsConnecting(true);
      
      if (!window.ethereum) {
        alert('Please install MetaMask to connect your wallet');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const formattedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
      
      setWalletAddress(formattedAddress);
      setIsConnected(true);
    } catch (err) {
      console.log('Wallet connection failed:', err);
      if (err.code === 4001) {
        alert('Connection rejected by user');
      } else {
        alert('Failed to connect wallet. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleGitHubConnect = useCallback(async () => {
    if (!isGitHubConnected) {
      window.location.href = 'http://localhost:5000/auth/github';
    } else {
      setGitHubUser('');
      setIsGitHubConnected(false);
      localStorage.removeItem('github_user');
    }
  }, [isGitHubConnected]);

  useEffect(() => {
    const storedUser = localStorage.getItem('github_user');
    if (storedUser) {
      setGitHubUser(storedUser);
      setIsGitHubConnected(true);
    } else {
      fetch('http://localhost:5000/auth/status', { credentials: 'include' })
        .then((res) => res.json())
        .then((data) => {
          if (data.username) {
            setGitHubUser(data.username);
            setIsGitHubConnected(true);
            localStorage.setItem('github_user', data.username);
          }
        })
        .catch((err) => console.log('GitHub auth check failed', err));
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
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
                  `neon-link ${isActive ? 'active' : ''}`
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
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? '🔆' : '🌙'}
            </button>

            {/* Network Indicator */}
            <div className="network-indicator">
              <div className="network-pulse"></div>
              <span className="network-text">Testnet</span>
            </div>

            {/* GitHub Login Button */}
            <button
              className={`github-btn ${isGitHubConnected ? 'connected' : ''}`}
              onClick={handleGitHubConnect}
              title={isGitHubConnected ? `Connected as @${gitHubUser}` : 'Connect GitHub'}
              aria-label={isGitHubConnected ? `Connected as @${gitHubUser}` : 'Connect GitHub'}
            >
              <div className="github-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.44 9.8 8.2 11.39.6.11.82-.26.82-.58v-2.05c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.35-1.76-1.35-1.76-1.1-.76.08-.75.08-.75 1.21.08 1.85 1.24 1.85 1.24 1.08 1.85 2.84 1.31 3.54 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.97 0-1.32.47-2.39 1.24-3.23-.12-.3-.54-1.51.12-3.14 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.63.24 2.84.12 3.14.77.84 1.24 1.91 1.24 3.23 0 4.64-2.81 5.66-5.49 5.96.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.82.58A12.01 12.01 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </div>
              {isGitHubConnected && <span>@{gitHubUser}</span>}
            </button>

            {/* Wallet Button */}
            <button
              className={`neon-wallet-btn ${isConnected ? 'connected' : ''} ${isConnecting ? 'connecting' : ''}`}
              onClick={isConnected ? disconnectWallet : handleWalletConnect}
              disabled={isConnecting}
              title={isConnected ? `Connected: ${walletAddress}` : 'Connect Wallet'}
              aria-label={isConnected ? `Connected: ${walletAddress}` : 'Connect Wallet'}
            >
              {isConnected ? (
                <div className="wallet-info">
                  <div className="wallet-avatar"></div>
                  <span className="wallet-address">{walletAddress}</span>
                  <div className="connection-dot"></div>
                </div>
              ) : (
                <>
                  <span className="connect-text">
                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                  </span>
                  <div className="connect-icon">
                    {isConnecting ? '⌛' : '⚡'}
                  </div>
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