require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const axios = require("axios");
const app = express();
// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/github/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Fetch user's repositories from GitHub API
      const { data: repos } = await axios.get("https://api.github.com/user/repos", {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: "application/vnd.github.v3+json"
        },
        params: {
          visibility: "all" // can be "all", "public", or "private"
        }
      });

      // Attach repos to profile object
      profile.repos = repos;

      return done(null, profile);
    } catch (err) {
      return done(err, profile);
    }
  }
));

// Serialize & deserialize
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Routes
app.get("/auth/github", passport.authenticate("github", { scope: ["user:email", "repo"] }));

app.get("/auth/github/callback", 
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    res.json({
      username: req.user.username,
      repos: req.user.repos
    });
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

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
