import express from "express";
import https from "https";

import indexRouter  from "./routes/index.js";
import secondRouter from "./routes/second.js";

var app = express();
app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

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