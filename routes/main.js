var express = require('express');
var router = express.Router();
var conn = require('../database');
var getAge = require('get-age');
var nodemailer = require('nodemailer');



// Email configuration
var rand = Math.floor((Math.random() * 10000) + 54);
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'election.blockchain@gmail.com',
      pass: 'ajkprvy7'
    }
});

// Variables to store user data
var account_address;
var data;

// Route for the main registration form
router.get('/form', function(req, res, next) {
  if(req.session.loggedinUser){
    res.render('voter-registration.ejs')
  } else {
    res.redirect('/login');
  }
});

// Add a route for user signup
router.get('/register', function(req, res) {
  res.render('signup-form.ejs');
});

// Add a route for user login
router.get('/login', function(req, res) {
  res.render('login-form.ejs');
});

// Add POST route for login authentication
router.post('/login', function(req, res) {
  var emailAddress = req.body.email_address;
  var password = req.body.password;

  var sql = 'SELECT * FROM registration WHERE email_address = ? AND password = ?';
  conn.query(sql, [emailAddress, password], function (err, data, fields) {
    if (err) throw err;
    if (data.length > 0) {
      req.session.loggedinUser = true;
      req.session.emailAddress = emailAddress;
      res.redirect('/userInfo'); // Redirect to user dashboard after login
    } else {
      res.render('login-form.ejs', {alertMsg: "Your Email Address or password is wrong"});
    }
  });
});

// Add POST route for signup form submission
router.post('/register', function(req, res) {
  var name = req.body.name;
  var email = req.body.email_address;
  var password = req.body.password;
  
  // Check if user already exists
  var checkUser = 'SELECT * FROM registration WHERE email_address = ?';
  conn.query(checkUser, [email], function(err, result) {
    if (err) throw err;
    if (result.length > 0) {
      return res.render('signup-form.ejs', {alertMsg: "Email already registered"});
    }
    
    // Insert new user
    var insertUser = 'INSERT INTO registration (name, email_address, password) VALUES (?, ?, ?)';
    conn.query(insertUser, [name, email, password], function(err, result) {
      if (err) throw err;
      return res.render('login-form.ejs', {successMsg: "Registration successful. Please login."});
    });
  });
});

// Admin login route
router.get('/adlogin', function(req, res) {
  res.render('admin-login.ejs');
});

// Admin login authentication
router.post('/adlogin', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  
  // Hardcoded admin credentials (consider storing this securely in a database)
  if (username === 'admin' && password === 'adminpass') {
    req.session.adminLoggedin = true;
    res.redirect('/admin/dashboard');
  } else {
    res.render('admin-login.ejs', {alertMsg: "Invalid admin credentials"});
  }
});

// Existing registration data processing route
router.post('/registerdata', function(req, res) {
  var dob = [];
  data = req.body.aadharno;    //data stores aadhar no
  console.log(data);
  account_address = req.body.account_address;     //stores metamask acc address
  
  let sql = "SELECT * FROM aadhar_info WHERE aadhar_number = ?";   
  conn.query(sql, data, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    
    if (results.length === 0) {
      return res.render('voter-registration.ejs', {alertMsg: "Invalid Aadhar number"});
    }
    
    dob = results[0].Dob;
    var email = results[0].Email;
    age = getAge(dob);
    is_registerd = results[0].Is_registered;
    
    if (is_registerd != 'YES') {
      if (age >= 18) {
        var mailOptions = {
          from: 'sharayuingale19@gmail.com',
          to: email,
          subject: "Please confirm your Email account",
          text: "Hello, Your otp is " + rand	
        };
        
        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            console.log(error);
            return res.render('voter-registration.ejs', {alertMsg: "Error sending OTP. Please try again."});
          } else {
            console.log('Email sent: ' + info.response);
            res.render('emailverify.ejs');
          }
        });
      } else {
        res.render('voter-registration.ejs', {alertMsg: "You cannot vote as your age is less than 18"});
      }
    } else {
      res.render('voter-registration.ejs', {alertMsg: "You are already registered. You cannot register again"});
    }
  });
});

// OTP verification route
router.post('/otpverify', (req, res) => {
  var otp = req.body.otp;
  if (otp == rand) {
    var record = { Account_address: account_address, Is_registered: 'Yes' };
    var sql = "INSERT INTO registered_users SET ?";
    conn.query(sql, record, function(err2, res2) {
      if (err2) {
        throw err2;
      } else {
        var sql1 = "Update aadhar_info set Is_registered=? Where aadhar_number=?";
        var record1 = ['YES', data];
        console.log(data);
        conn.query(sql1, record1, function(err1, res1) {
          if (err1) {
            res.render('voter-registration.ejs');
          } else {
            console.log("1 record updated");
            var msg = "You are successfully registered";
            res.render('voter-registration.ejs', {alertMsg: msg});                 
          }
        }); 
      }
    }); 
  } else {
    res.render('voter-registration.ejs', {alertMsg: "Session Expired! , You have entered wrong OTP"});
  }
});

// Route to handle logout
router.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
