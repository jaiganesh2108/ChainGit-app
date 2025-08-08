// server/config/passport.js
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL
        },
        (accessToken, refreshToken, profile, done) => {
            const user = {
                username: profile.username,
                accessToken: accessToken
            };
            return done(null, user);
        }
    )
);

module.exports = passport;
