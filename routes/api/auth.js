const express = require("express");
const router = express.Router();

// @route       GET api/auth
router.get("/", (req, res) => {
  res.send("This is Auth route ....");
});

module.exports = router;
