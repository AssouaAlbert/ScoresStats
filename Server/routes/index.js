const express = require("express");
const router = express.Router();
const getGamesList = require("../controller/getGamesList");

router.get("/", getGamesList);

module.exports = router;
