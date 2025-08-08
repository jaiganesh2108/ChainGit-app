// File: client/src/pages/Home.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <motion.div
      className="home"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="home-title">🔗 Welcome to <span className="chaingit">Chaingit</span></h1>
      <p className="home-description">
        Track, verify, and secure your codebase using blockchain technology.
      </p>
      <Link to="/dashboard" className="home-button">
        Get Started →
      </Link>
    </motion.div>
  );
};

export default Home;
