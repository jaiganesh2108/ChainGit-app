// server/app.js
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("./config/passport");
const githubRoutes = require("./routes/github");
const commitController = require("./controllers/commitController");
const ensureAuthenticated = require("./middleware/auth");

const app = express();
app.use(express.json());

app.use(
    session({
        secret: "supersecret",
        resave: false,
        saveUninitialized: false
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth/github", githubRoutes);

app.post("/push-to-ipfs", ensureAuthenticated, commitController.pushCommitToIPFS);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
