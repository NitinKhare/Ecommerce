var express = require('express');
var path = require('path');
var bodyParser = require("body-parser");
var session = require('express-session');
var mongoose = require('mongoose');
var database = require('./config/database')
var expressValidator = require('express-validator');



//mongo setup
mongoose.connect(database.database, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connection to MongoDB Successful');
});

const PORT = 3000;
var app = express();
app.locals.errors = null;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//public folder
app.use(express.static(path.join(__dirname, 'public')));

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

app.use(expressValidator())
//express-messages middleware
app.use(require('connect-flash')());
    app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
  });



//index route
app.get('/',(req, res)=>{
    res.render('index',{
        header:'index'
    });
});


//Set routes
var pages = require('./routes/pages');
var admin = require('./routes/admin');

app.use('/pages', pages);
app.use('/admin', admin);



//port
app.listen(PORT, ()=>{
    console.log(`Server running on PORT ${PORT}`);
});