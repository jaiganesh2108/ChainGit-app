// File: server/middleware/auth.js
exports.authenticate = (req, res, next) => {
  // Dummy middleware — can validate JWTs or API keys here
  next();
};