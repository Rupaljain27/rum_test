import express from "express";
var router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {title: "Boop"});
});

export default router;