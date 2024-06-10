var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
    res.render("second", {title: "Second"});
});

module.exports = router;
