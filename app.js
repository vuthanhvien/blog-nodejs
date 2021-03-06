const express = require('express')
const port = 3000;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var path = require('path');


var bodyParserJSON = bodyParser.json();
var bodyParserURLEncoded = bodyParser.urlencoded({ extended: true });
var route = require('./route');
// const url = 'mongodb://localhost:27017/books';
const url = 'mongodb://localhost:27017/book3';


var router = express.Router();

const app = express()
app.use(bodyParserJSON);
app.use(bodyParserURLEncoded);

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization");
  next();
});

app.use(session({
  secret: "secret",
  saveUninitialized: true,
  resave: true
}))

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(url, {
   useNewUrlParser: true, 
   useUnifiedTopology: true, 
   useCreateIndex: true, 
   useFindAndModify: false });

app.use('/api', router);

route(router);


app.get('**',function(req, res) {
  console.log(req)
  res.sendFile(path.join(__dirname + '/dist/'+req.originalUrl));
 });


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))