// var express = require('express');
// var router = express.Router();
// var db=require('../database');
// var app = express();
// app.use(express.urlencoded());
// app.set('view engine', 'ejs');
// app.use(express.static('public'))
// app.use('/css',express.static(__dirname + 'public/css'))

// // to display registration form 
// router.get('/register', function(req, res, next) {
//   res.render('registration-form.ejs');
// });


// // to store user input detail on post request
// router.post('/register', function(req, res, next) {
    
//     // inputData ={
//     //     first_name: req.body.first_name,
//     //     last_name: req.body.last_name,
//     //     email_address: req.body.email_address,
//     //     gender: req.body.gender,
//     //     password: req.body.password,
//     //     confirm_password:req.body.confirm_password
//     // }

//     // Modify your inputData object to include only fields that exist in your database
//     inputData = {
//         first_name: req.body.first_name,
//         last_name: req.body.last_name || null,
//         email_address: req.body.email_address,
//         gender: req.body.gender || null,
//         password: req.body.password
//         // Remove confirm_password from here
//     }
    
// // check unique email address

// var sql='SELECT * FROM registration WHERE email_address =?';
// db.query(sql, [inputData.email_address] ,function (err, data, fields) {
//  if(err) throw err
//  if(data.length>1){
//      var msg = inputData.email_address+ "was already exist";
 
//  }else if(inputData.confirm_password != inputData.password){
//     var msg ="Password & Confirm Password is not Matched";
//  }else{
     
//     // save users data into database
//     var sql = 'INSERT INTO registration SET ?';
//     console.log(sql);
//    db.query(sql, inputData, function (err, data) {
//       if (err) throw err;
//            });
//   var msg ="Your are successfully registered";
//  }
//  res.render('registration-form.ejs',{alertMsg:msg});
// })
     
// });
// module.exports = router;

var express = require('express');
var router = express.Router();
var db = require('../database');
var app = express();
app.use(express.urlencoded());
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))

// to display registration form 
router.get('/register', function(req, res, next) {
  res.render('registration-form.ejs');
});

// to store user input detail on post request
router.post('/register', function(req, res, next) {
    
    // Create inputData without confirm_password field
    inputData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name || '', // Use empty string instead of null
        email_address: req.body.email_address,
        gender: req.body.gender || null,
        password: req.body.password
    }
    
    // check unique email address
    var sql = 'SELECT * FROM registration WHERE email_address = ?';
    db.query(sql, [inputData.email_address], function (err, data, fields) {
        if(err) throw err;
        
        if(data.length > 0) {
            var msg = inputData.email_address + " was already exist";
            res.render('registration-form.ejs', {alertMsg: msg});
        } else if(req.body.confirm_password != req.body.password) {
            var msg = "Password & Confirm Password is not Matched";
            res.render('registration-form.ejs', {alertMsg: msg});
        } else {
            // save users data into database
            var sql = 'INSERT INTO registration SET ?';
            db.query(sql, inputData, function (err, data) {
                if (err) throw err;
                var msg = "You are successfully registered";
                res.render('registration-form.ejs', {alertMsg: msg});
            });
        }
    });
});

module.exports = router;