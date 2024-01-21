const router = require("express").Router();
const { Login } = require("./index");

router.post("/login", Login);

module.exports = router