import express from "express";
import https from "https";
import path from "path";
import { fileURLToPath } from 'url';

import indexRouter  from "./routes/index.js";
import secondRouter from "./routes/second.js";

var app = express();
app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(express.static("node_modules"));

// const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
// const __dirname = path.dirname(__filename); // get the name of the directory

// app.use("/aws-rum-web", express.static(path.join(__dirname, "node_modules/aws-rum-web/")));
app.use('/', indexRouter);
app.use('/second', secondRouter);

app.post('/request', (req, res) => {
    console.log("Request Receieved");
    res.send("Click Recorded");
})

app.listen(2024, () => {
    console.log('Running on port 2024')
});

export { app };