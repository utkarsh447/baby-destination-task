/**
* Module dependencies.
*/
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
//var methodOverride = require('method-override');
var session = require('express-session');
var app = express();
var mysql      = require('mysql');
var bodyParser=require("body-parser");

// var VerifyToken = require("./routes/VerifyToken");

// all environments
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(session({
//               secret: 'baby destination',
//               resave: false,
//               saveUninitialized: true,
//               cookie: { expires: false }
//             }))

// development only

// var rpc = require("./routes/rpc");

app.get("/", function(req, res){
   res.redirect("user/log");
})

app.use("/user", user);

//Middleware
app.listen(3000, function(req, res){
  console.log("Listening at 3000");
})

module.exports = app;
