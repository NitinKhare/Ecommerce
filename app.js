var express = require('express');
var path = require('path');
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var database = require('./config/database')


//mongo setup
mongoose.connect(database.database, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connection to MongoDB Successful');
});

const PORT = 3000;
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//public folder
app.use(express.static(path.join(__dirname, 'public')));

//middleware
app.use(bodyParser.urlencoded({ extended: true }));

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