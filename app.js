var express = require("express");
var indexRouter = require("./routes/index.js");
var secondRouter = require("./routes/second.js");

var app = express();
app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.use('/', indexRouter);
app.use('/second', secondRouter);

app.listen(2024, () => {
    console.log('Running on port 2024')
});

