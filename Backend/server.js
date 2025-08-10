
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const axios = require("axios");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

app.use(cors({
  origin: "http://localhost:5173", // your frontend URL
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/github/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Get repos
      const { data: repos } = await axios.get("https://api.github.com/user/repos", {
        headers: { Authorization: `token ${accessToken}` }
      });

      // Attach repos to profile
      profile.accessToken = accessToken;
      profile.repos = repos;

      return done(null, profile);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// --- Routes ---
app.get("/auth/github", passport.authenticate("github", { scope: ["user:email", "repo"] }));

app.get("/auth/github/callback", 
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("http://localhost:5173/dashboard"); // redirect to frontend dashboard
  }
);

app.get("/auth/status", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      username: req.user.username,
      repos: req.user.repos || []
    });
  } else {
    res.json({ username: null, repos: [] });
  }
});

// Get commits for a repo
app.get("/api/github/commits", async (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ error: "Not authenticated" });

  try {
    const { owner, name } = req.query;
    const commitsUrl = `https://api.github.com/repos/${owner}/${name}/commits`;

    const { data } = await axios.get(commitsUrl, {
      headers: { Authorization: `token ${req.user.accessToken}` }
    });

    const commits = data.map(c => ({
      hash: c.sha,
      message: c.commit.message,
      author: c.commit.author.name,
      timestamp: c.commit.author.date
    }));

    res.json(commits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
