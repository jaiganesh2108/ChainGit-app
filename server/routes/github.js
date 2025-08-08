// server/routes/github.js
const express = require("express");
const router = express.Router();
const passport = require("../config/passport");

router.get("/login", passport.authenticate("github", { scope: ["repo"] }));

router.get(
    "/callback",
    passport.authenticate("github", { failureRedirect: "/" }),
    (req, res) => {
        res.json({
            username: req.user.username,
            token: req.user.accessToken
        });
    }
);

router.get("/logout", (req, res) => {
    req.logout(() => {
        res.send("Logged out");
    });
});

module.exports = router;
