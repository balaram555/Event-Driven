const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activityController");
const rateLimiter = require("../middlewares/rateLimiter");

router.post("/", rateLimiter, activityController.ingestActivity);

module.exports = router;