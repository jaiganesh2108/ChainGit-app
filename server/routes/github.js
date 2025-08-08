// File: server/routes/github.js
const express = require("express");
const router = express.Router();
const { getCommits } = require("../controllers/commitController");
const { authenticate } = require("../middleware/auth");

router.get("/commits", authenticate, getCommits);

module.exports = router;