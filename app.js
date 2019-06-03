var express = require('express');
var path = require('path');
var bodyParser = require("body-parser");
var session = require('express-session');
var mongoose = require('mongoose');
var database = require('./config/database')
var expressValidator = require('express-validator');
var methodOverride = require('method-override');
var fileUpload = require('express-fileupload');


var Pages = require('./models/page');
var Category = require('./models/category');

Category.find({}).sort({sorting: 1}).exec((err, categories)=>{
   if(err) {console.log(err);}
   else{ app.locals.Categories = categories;}

});

Pages.find({},(err, pages)=>{
    if(err) {console.log(err);}
    else{ app.locals.pages = pages;}
 
 });

//mongo setup
mongoose.connect(database.database, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connection to MongoDB Successful');
});
mongoose.set('useFindAndModify', false);

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
  resave: true,
  saveUninitialized: true,
 // cookie: { secure: true }
}))

app.use(methodOverride('_method'))

app.use(expressValidator({
  customValidators: {
      isImage: function(value, filename) {
  
          var extension = (path.extname(filename)).toLowerCase();
          switch (extension) {
              case '.jpg':
                  return '.jpg';
              case '.jpeg':
                  return '.jpeg';
              case  '.png':
                  return '.png';
              default:
                  return false;
          }
      }
  }}));
//express-messages middleware
app.use(require('connect-flash')());
    app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
  });

app.use(fileUpload());

//Set routes
var pages = require('./routes/pages');
var admin = require('./routes/admin');
var category = require('./routes/categories');
var product = require('./routes/product');
var userPages = require('./routes/userMadePages');

app.use('/admin-products', product);
app.use('/product-categories', category);
app.use('/admin', admin);
app.use('/pages', userPages);
app.use('/', pages);


//port
app.listen(PORT, ()=>{
    console.log(`Server running on PORT ${PORT}`);
});