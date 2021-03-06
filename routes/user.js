var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var validator = require("email-validator");
var app = express.Router();

var User = require("../models/users").users_model;
// var VerifyToken = require("./VerifyToken");

var secret = "Baby Destination";

function getEncrypt(password) {
  var hash = crypto.createHmac("sha512", secret)
    .update(password)
    .digest("base64");

  var hashedData = sha512(hash);
  return hashedData.toString("hex");
}

app.post("/register", function(req, res){
   message = '';
   var name= req.body.user_name;
   var email= req.body.email;
   if(validator.validate(email)==false){
     res.send({
       Email: "Invalid Emailid"
     })
   }
   // var pass = bcrypt.hashSync(req.body.password, 8);
   var pass = req.body.password;

   User.forge({
        fullname: name,
        password: pass,
        email: email
    }, {method: "insert"})
      .save()
      .then(function(response){
        var response1 = response.toJSON();
        console.log(response1.id);
        res.send({
          "Created UserID": response1.id
        })
      }).catch(function(reason){
         console.error(reason);

      })
});

app.post("/log", function(req, res){
   var message = '';
   // var sess = req.session;
   var email= req.body.email;
   // var pass= bcrypt.compareSync(req.body.password, 8);
   var pass = req.body.password;

   User.where({
      email: email,
      password: pass
   })
      .fetch()
      .then(function(user){
         if(user===null){
            message = 'Wrong Credentials.';
            console.log(message);
            res.send({message: message});
         }
         else{
            user1 = user.toJSON();
            var user = {
              id: user1.id,
              email: user1.email,
              fullname: user1.fullname
            }
            console.log("userid: " + user1.id);

            jwt.sign({user}, secret, { expiresIn: '24h' }, (err, token) => {
              console.log(token);
              res.json({
                token
              });
            });
         }
      })
      .catch(function (error) {
        console.error(error);
      })
});


function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if(typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;

    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }

}

app.get("/profile",verifyToken, function(req, res){
   // var userId = req.session.userId;
   jwt.verify(req.token, secret, (err, authData) => {
       if(err) {
         res.sendStatus(403);
       } else {
         User.where({
           id: authData.user.id
         })
         .fetch()
         .then(function(data){
           console.log(data.toJSON())
           var data1 = data.toJSON();
           res.json({
             message: 'Token Data',
             data1
           });
         })


       }
     });
})

app.post("/profile/edit",verifyToken, function(req, res){
   var fullname = req.body.fullname;
   jwt.verify(req.token, secret, (err, authData) => {
       if(err) {
         res.sendStatus(403);
       }
       else {
         User.forge({
           id: authData.user.id,
           fullname: fullname
         })
         .save()
         .then(function(data){
           //data.fullname = fullname;
           res.send({
             Edit: "Successful"
           })
         })

       //});
      }
    });



 })


module.exports = app;
