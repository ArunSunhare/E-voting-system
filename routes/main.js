// var express = require('express');
// var router = express.Router();
// var conn = require('../database');
// var getAge = require('get-age');
// var nodemailer = require('nodemailer');



// // Email configuration
// var rand = Math.floor((Math.random() * 10000) + 54);
// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'election.blockchain@gmail.com',
//       pass: 'ajkprvy7'
//     }
// });

// // Variables to store user data
// var account_address;
// var data;

// // Custom age calculation function as a fallback
// function calculateAge(dob) {
//   const birthDate = new Date(dob);
//   const today = new Date();
  
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const monthDiff = today.getMonth() - birthDate.getMonth();
  
//   // Adjust age if birthday hasn't occurred yet this year
//   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//     age--;
//   }
  
//   return age;
// }


// // Route for the main registration form
// router.get('/form', function(req, res, next) {
//   if(req.session.loggedinUser){
//     res.render('voter-registration.ejs')
//   } else {
//     res.redirect('/login');
//   }
// });

// // Add a route for user signup
// router.get('/register', function(req, res) {
//   res.render('signup-form.ejs');
// });

// // Add a route for user login
// router.get('/login', function(req, res) {
//   res.render('login-form.ejs');
// });

// // Add POST route for login authentication
// router.post('/login', function(req, res) {
//   var emailAddress = req.body.email_address;
//   var password = req.body.password;

//   var sql = 'SELECT * FROM registration WHERE email_address = ? AND password = ?';
//   conn.query(sql, [emailAddress, password], function (err, data, fields) {
//     if (err) throw err;
//     if (data.length > 0) {
//       req.session.loggedinUser = true;
//       req.session.emailAddress = emailAddress;
//       res.redirect('/userInfo'); // Redirect to user dashboard after login
//     } else {
//       res.render('login-form.ejs', {alertMsg: "Your Email Address or password is wrong"});
//     }
//   });
// });

// // Add POST route for signup form submission
// router.post('/register', function(req, res) {
//   var name = req.body.name;
//   var email = req.body.email_address;
//   var password = req.body.password;
  
//   // Check if user already exists
//   var checkUser = 'SELECT * FROM registration WHERE email_address = ?';
//   conn.query(checkUser, [email], function(err, result) {
//     if (err) throw err;
//     if (result.length > 0) {
//       return res.render('signup-form.ejs', {alertMsg: "Email already registered"});
//     }
    
//     // Insert new user
//     var insertUser = 'INSERT INTO registration (name, email_address, password) VALUES (?, ?, ?)';
//     conn.query(insertUser, [name, email, password], function(err, result) {
//       if (err) throw err;
//       return res.render('login-form.ejs', {successMsg: "Registration successful. Please login."});
//     });
//   });
// });

// // Admin login route
// router.get('/adlogin', function(req, res) {
//   res.render('admin-login.ejs');
// });

// // Admin login authentication
// router.post('/adlogin', function(req, res) {
//   var username = req.body.username;
//   var password = req.body.password;
  
//   // Hardcoded admin credentials (consider storing this securely in a database)
//   if (username === 'admin' && password === 'adminpass') {
//     req.session.adminLoggedin = true;
//     res.redirect('/admin/dashboard');
//   } else {
//     res.render('admin-login.ejs', {alertMsg: "Invalid admin credentials"});
//   }
// });

// // // Existing registration data processing route
// // router.post('/registerdata', function(req, res) {
// //   var dob = [];
// //   data = req.body.aadharno;    //data stores aadhar no
// //   console.log(data);
// //   account_address = req.body.account_address;     //stores metamask acc address

// // Existing registration data processing route
// router.post('/registerdata', function(req, res) {
//   data = req.body.aadharno;    //data stores aadhar no
//   console.log("Aadhar number:", data);
//   account_address = req.body.account_address;     //stores metamask acc address
//   console.log("Account address:", account_address);
  
//   let sql = "SELECT * FROM aadhar_info WHERE aadhar_number = ?";   
//   conn.query(sql, data, (error, results, fields) => {
//     if (error) {
//       return console.error(error.message);
//     }
    
//     if (results.length === 0) {
//       return res.render('voter-registration.ejs', {alertMsg: "Invalid Aadhar number"});
//     }
    
//     dob = results[0].Dob;
//     var email = results[0].email;
//     var is_registered = results[0].is_registered || 'NO'; 
//     // age = getAge(dob);
//     // is_registerd = results[0].Is_registered;
    
//     // if (is_registerd != 'YES') {
//     //   if (age >= 18) {
//     //     var mailOptions = {
//     //       from: 'sharayuingale19@gmail.com',
//     //       to: email,
//     //       subject: "Please confirm your Email account",
//     //       text: "Hello, Your otp is " + rand	
//     //     };

//     console.log("DOB from database:", dob);
//     console.log("Email from database:", email);
//     console.log("Registration status:", is_registered);
    
//     // Try the imported getAge function first
//     var age;
//     try {
//       age = getAge(dob);
//       console.log("Age calculated with getAge():", age);
//     } catch (err) {
//       // Fallback to our custom function if getAge fails
//       console.log("getAge() failed, using fallback:", err);
//       age = calculateAge(dob);
//       console.log("Age calculated with fallback:", age);
//     }
    
//     if (is_registered.toUpperCase() !== 'YES') {
//       if (age >= 18) {
//         console.log("Age verification passed, sending OTP");
//         var mailOptions = {
//           from: 'sharayuingale19@gmail.com',
//           to: email,
//           subject: "Please confirm your Email account",
//           text: "Hello, Your otp is " + rand	
//         };

        
//         transporter.sendMail(mailOptions, function(error, info) {
//           if (error) {
//             console.log(error);
//             return res.render('voter-registration.ejs', {alertMsg: "Error sending OTP. Please try again."});
//           } else {
//             console.log('Email sent: ' + info.response);
//             res.render('emailverify.ejs');
//           }
//         });
//       } else {
//         res.render('voter-registration.ejs', {alertMsg: "You cannot vote as your age is less than 18"});
//       }
//     } else {
//       res.render('voter-registration.ejs', {alertMsg: "You are already registered. You cannot register again"});
//     }
//   });
// });

// // OTP verification route
// router.post('/otpverify', (req, res) => {
//   var otp = req.body.otp;
//   if (otp == rand) {
//     var record = { Account_address: account_address, Is_registered: 'Yes' };
//     var sql = "INSERT INTO registered_users SET ?";
//     conn.query(sql, record, function(err2, res2) {
//       if (err2) {
//         throw err2;
//       } else {
//         var sql1 = "Update aadhar_info set Is_registered=? Where aadhar_number=?";
//         var record1 = ['YES', data];
//         console.log(data);
//         conn.query(sql1, record1, function(err1, res1) {
//           if (err1) {
//             res.render('voter-registration.ejs');
//           } else {
//             console.log("1 record updated");
//             var msg = "You are successfully registered";
//             res.render('voter-registration.ejs', {alertMsg: msg});                 
//           }
//         }); 
//       }
//     }); 
//   } else {
//     res.render('voter-registration.ejs', {alertMsg: "Session Expired! , You have entered wrong OTP"});
//   }
// });

// // Route to handle logout
// router.get('/logout', function(req, res) {
//   req.session.destroy();
//   res.redirect('/');
// });

// module.exports = router;


// var express = require('express');
// var router = express.Router();
// var conn = require('../database');
// var getAge = require('get-age');
// var nodemailer = require('nodemailer');

// // Email configuration
// var rand = Math.floor((Math.random() * 10000) + 54);
// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'election.blockchain@gmail.com',
//       pass: 'ajkprvy7'
//     }
// });

// // Variables to store user data
// var account_address;
// var data;

// // Definitely reliable age calculation function
// // function calculateAge(birthDateStr) {
// //   console.log("Calculating age for date:", birthDateStr);
  
// //   // Parse the date string (format: YYYY-MM-DD)
// //   const parts = birthDateStr.split('-');
// //   if (parts.length !== 3) {
// //     console.error("Invalid date format:", birthDateStr);
// //     return 0;
// //   }
  
// //   const birthYear = parseInt(parts[0]);
// //   const birthMonth = parseInt(parts[1]) - 1; // 0-based month
// //   const birthDay = parseInt(parts[2]);
  
// //   const birthDate = new Date(birthYear, birthMonth, birthDay);
// //   const today = new Date();
  
// //   let age = today.getFullYear() - birthDate.getFullYear();
// //   const monthDifference = today.getMonth() - birthDate.getMonth();
  
// //   if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
// //     age--;
// //   }
  
// //   console.log("Birth date:", birthDate);
// //   console.log("Today:", today);
// //   console.log("Calculated age:", age);
  
// //   return age;
// // }

// function calculateAge(birthDate) {
//   console.log("Calculating age for date:", birthDate);
  
//   // Convert to Date object if it's not already one
//   const birthDateObj = birthDate instanceof Date ? birthDate : new Date(birthDate);
  
//   const today = new Date();
  
//   let age = today.getFullYear() - birthDateObj.getFullYear();
//   const monthDifference = today.getMonth() - birthDateObj.getMonth();
  
//   if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
//     age--;
//   }
  
//   console.log("Birth date:", birthDateObj);
//   console.log("Today:", today);
//   console.log("Calculated age:", age);
  
//   return age;
// }

// // Route for the main registration form
// router.get('/form', function(req, res, next) {
//   if(req.session.loggedinUser){
//     res.render('voter-registration.ejs')
//   } else {
//     res.redirect('/login');
//   }
// });

// // Add a route for user signup
// router.get('/register', function(req, res) {
//   res.render('signup-form.ejs');
// });

// // Add a route for user login
// router.get('/login', function(req, res) {
//   res.render('login-form.ejs');
// });

// // Add POST route for login authentication
// router.post('/login', function(req, res) {
//   var emailAddress = req.body.email_address;
//   var password = req.body.password;

//   var sql = 'SELECT * FROM registration WHERE email_address = ? AND password = ?';
//   conn.query(sql, [emailAddress, password], function (err, data, fields) {
//     if (err) throw err;
//     if (data.length > 0) {
//       req.session.loggedinUser = true;
//       req.session.emailAddress = emailAddress;
//       res.redirect('/userInfo'); // Redirect to user dashboard after login
//     } else {
//       res.render('login-form.ejs', {alertMsg: "Your Email Address or password is wrong"});
//     }
//   });
// });

// // Add POST route for signup form submission
// router.post('/register', function(req, res) {
//   var name = req.body.name;
//   var email = req.body.email_address;
//   var password = req.body.password;
  
//   // Check if user already exists
//   var checkUser = 'SELECT * FROM registration WHERE email_address = ?';
//   conn.query(checkUser, [email], function(err, result) {
//     if (err) throw err;
//     if (result.length > 0) {
//       return res.render('signup-form.ejs', {alertMsg: "Email already registered"});
//     }
    
//     // Insert new user
//     var insertUser = 'INSERT INTO registration (name, email_address, password) VALUES (?, ?, ?)';
//     conn.query(insertUser, [name, email, password], function(err, result) {
//       if (err) throw err;
//       return res.render('login-form.ejs', {successMsg: "Registration successful. Please login."});
//     });
//   });
// });

// // Admin login route
// router.get('/adlogin', function(req, res) {
//   res.render('admin-login.ejs');
// });

// // Admin login authentication
// router.post('/adlogin', function(req, res) {
//   var username = req.body.username;
//   var password = req.body.password;
  
//   // Hardcoded admin credentials (consider storing this securely in a database)
//   if (username === 'admin' && password === 'adminpass') {
//     req.session.adminLoggedin = true;
//     res.redirect('/admin/dashboard');
//   } else {
//     res.render('admin-login.ejs', {alertMsg: "Invalid admin credentials"});
//   }
// });

// // Existing registration data processing route
// router.post('/registerdata', function(req, res) {
//   data = req.body.aadharno;    //data stores aadhar no
//   console.log("Aadhar number submitted:", data);
//   account_address = req.body.account_address;     //stores metamask acc address
//   console.log("Account address:", account_address);
  
//   // Important: Log the exact SQL query to verify
//   let sql = "SELECT * FROM aadhar_info WHERE aadhar_number = ?";
//   console.log("Executing SQL:", sql, "with param:", data);
  
//   conn.query(sql, data, (error, results, fields) => {
//     if (error) {
//       console.error("Database error:", error.message);
//       return res.render('voter-registration.ejs', {alertMsg: "Database error occurred. Please try again."});
//     }
    
//     console.log("Raw DB results:", JSON.stringify(results, null, 2));
    
//     if (!results || results.length === 0) {
//       return res.render('voter-registration.ejs', {alertMsg: "Invalid Aadhar number"});
//     }
    
//     // Log all column names to identify exact case
//     console.log("Column names in result:", Object.keys(results[0]));
    
//     // Get the correct column names (case-sensitive) from the first row of results
//     const firstRow = results[0];
    
//     // Find the correct case for DOB column
//     const dobColumnName = Object.keys(firstRow).find(key => 
//       key.toLowerCase() === 'dob');
    
//     // Find the correct case for email column
//     const emailColumnName = Object.keys(firstRow).find(key => 
//       key.toLowerCase() === 'email');
    
//     // Find the correct case for is_registered column
//     const registeredColumnName = Object.keys(firstRow).find(key => 
//       key.toLowerCase() === 'is_registered');
    
//     console.log("DOB column name:", dobColumnName);
//     console.log("Email column name:", emailColumnName);
//     console.log("Is_registered column name:", registeredColumnName);
    
//     // Get values using the correct column names
//     var dobValue = firstRow[dobColumnName];
//     var emailValue = firstRow[emailColumnName];
//     var isRegistered = registeredColumnName ? firstRow[registeredColumnName] : 'NO';
    
//     console.log("DOB value:", dobValue);
//     console.log("Email value:", emailValue);
//     console.log("Is registered value:", isRegistered);
    
//     // Calculate age using our reliable function
//     var age = calculateAge(dobValue);
//     console.log("Final calculated age:", age);
    
//     // Check if registered (case-insensitive)
//     var isAlreadyRegistered = isRegistered && 
//       (isRegistered.toString().toUpperCase() === 'YES');
    
//     console.log("Is already registered?", isAlreadyRegistered);
    
//     if (!isAlreadyRegistered) {
//       if (age >= 18) {
//         console.log("Age verification passed (age is " + age + "), sending OTP");
        
//         // Use the email from the database for OTP
//         var mailOptions = {
//           from: 'sharayuingale19@gmail.com',
//           to: emailValue,
//           subject: "Please confirm your Email account",
//           text: "Hello, Your otp is " + rand	
//         };
        
//         transporter.sendMail(mailOptions, function(error, info) {
//           if (error) {
//             console.log("Email error:", error);
//             return res.render('voter-registration.ejs', {alertMsg: "Error sending OTP. Please try again."});
//           } else {
//             console.log('Email sent: ' + info.response);
//             res.render('emailverify.ejs');
//           }
//         });
//       } else {
//         console.log("Age verification failed: age is " + age + " (less than 18)");
//         res.render('voter-registration.ejs', {alertMsg: "You cannot vote as your age is less than 18"});
//       }
//     } else {
//       console.log("User already registered, cannot register again");
//       res.render('voter-registration.ejs', {alertMsg: "You are already registered. You cannot register again"});
//     }
//   });
// });

// // OTP verification route
// router.post('/otpverify', (req, res) => {
//   var otp = req.body.otp;
//   console.log("OTP received:", otp, "Expected:", rand);
  
//   if (otp == rand) {
//     console.log("OTP verified successfully");
//     var record = { Account_address: account_address, Is_registered: 'Yes' };
//     var sql = "INSERT INTO registered_users SET ?";
//     conn.query(sql, record, function(err2, res2) {
//       if (err2) {
//         console.error("Error inserting into registered_users:", err2);
//         return res.render('voter-registration.ejs', {alertMsg: "Registration failed. Please try again."});
//       } else {
//         console.log("User registered in registered_users");
        
//         // Find the correct column name case for update
//         var sql1 = "SHOW COLUMNS FROM aadhar_info LIKE 'is_registered'";
//         conn.query(sql1, function(err, columns) {
//           if (err) {
//             console.error("Error getting column info:", err);
//             return res.render('voter-registration.ejs', {alertMsg: "Registration process incomplete."});
//           }
          
//           console.log("Column info:", columns);
          
//           // Use the correct column name from the schema
//           var registeredColumn = columns.length > 0 ? columns[0].Field : 'Is_registered';
//           console.log("Using column name for update:", registeredColumn);
          
//           var updateSql = `UPDATE aadhar_info SET ${registeredColumn} = ? WHERE aadhar_number = ?`;
//           var record1 = ['YES', data];
          
//           console.log("Executing update:", updateSql, "with params:", record1);
          
//           conn.query(updateSql, record1, function(err1, res1) {
//             if (err1) {
//               console.error("Error updating aadhar_info:", err1);
//               return res.render('voter-registration.ejs', {alertMsg: "Registration process incomplete. Please contact support."});
//             } else {
//               console.log("1 record updated in aadhar_info");
//               var msg = "You are successfully registered";
//               res.render('voter-registration.ejs', {alertMsg: msg});                 
//             }
//           });
//         });
//       }
//     }); 
//   } else {
//     console.log("OTP verification failed");
//     res.render('voter-registration.ejs', {alertMsg: "Session Expired! , You have entered wrong OTP"});
//   }
// });

// // Route to handle logout
// router.get('/logout', function(req, res) {
//   req.session.destroy();
//   res.redirect('/');
// });

// module.exports = router;

// var express = require('express');
// var router = express.Router();
// var conn = require('../database');
// var getAge = require('get-age');
// var nodemailer = require('nodemailer');

// // Email configuration - Updated with secure configuration
// // Generate a random OTP
// var rand = Math.floor((Math.random() * 10000) + 54);

// // Create a more secure transporter with app password
// // NOTE: You will need to generate an app password from your Google account
// // Go to Google Account > Security > App passwords
// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'election.blockchain@gmail.com',
//       // IMPORTANT: Replace with your app password, not your regular password
//       pass: 'fnvugmclbqskzahj' // This is an example, use your actual app password
//     },
//     tls: {
//       rejectUnauthorized: false // May help in some environments with certificate issues
//     }
// });

// // For testing the email connection at startup
// transporter.verify(function(error, success) {
//     if (error) {
//       console.error('SMTP server connection error:', error);
//     } else {
//       console.log('SMTP server connection successful');
//     }
// });

// // Variables to store user data
// var account_address;
// var data;

// // Robust age calculation function that handles different date formats
// function calculateAge(birthDate) {
//   console.log("Calculating age for date:", birthDate);
  
//   // Handle different date formats
//   let birthDateObj;
//   if (birthDate instanceof Date) {
//     birthDateObj = birthDate;
//   } else if (typeof birthDate === 'string') {
//     // Try different date parsing approaches
//     birthDateObj = new Date(birthDate);
    
//     // If invalid, try to parse manually
//     if (isNaN(birthDateObj.getTime())) {
//       const formats = [
//         // YYYY-MM-DD
//         /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
//         // MM/DD/YYYY
//         /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
//         // DD-MM-YYYY
//         /^(\d{1,2})-(\d{1,2})-(\d{4})$/
//       ];
      
//       for (const format of formats) {
//         const parts = birthDate.match(format);
//         if (parts) {
//           if (format === formats[0]) { // YYYY-MM-DD
//             birthDateObj = new Date(parseInt(parts[1]), parseInt(parts[2])-1, parseInt(parts[3]));
//           } else if (format === formats[1]) { // MM/DD/YYYY
//             birthDateObj = new Date(parseInt(parts[3]), parseInt(parts[1])-1, parseInt(parts[2]));
//           } else if (format === formats[2]) { // DD-MM-YYYY
//             birthDateObj = new Date(parseInt(parts[3]), parseInt(parts[2])-1, parseInt(parts[1]));
//           }
//           break;
//         }
//       }
//     }
//   }
  
//   // Check if we have a valid date object
//   if (!birthDateObj || isNaN(birthDateObj.getTime())) {
//     console.error("Invalid date provided:", birthDate);
//     return 0; // Return 0 or a default age for invalid dates
//   }
  
//   const today = new Date();
  
//   let age = today.getFullYear() - birthDateObj.getFullYear();
//   const monthDifference = today.getMonth() - birthDateObj.getMonth();
  
//   if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
//     age--;
//   }
  
//   console.log("Birth date:", birthDateObj);
//   console.log("Today:", today);
//   console.log("Calculated age:", age);
  
//   return age;
// }

// // Route for the main registration form
// router.get('/form', function(req, res, next) {
//   if(req.session.loggedinUser){
//     res.render('voter-registration.ejs')
//   } else {
//     res.redirect('/login');
//   }
// });

// // Add a route for user signup
// router.get('/register', function(req, res) {
//   res.render('signup-form.ejs');
// });

// // Add a route for user login
// router.get('/login', function(req, res) {
//   res.render('login-form.ejs');
// });

// // Add POST route for login authentication
// router.post('/login', function(req, res) {
//   var emailAddress = req.body.email_address;
//   var password = req.body.password;

//   var sql = 'SELECT * FROM registration WHERE email_address = ? AND password = ?';
//   conn.query(sql, [emailAddress, password], function (err, data, fields) {
//     if (err) throw err;
//     if (data.length > 0) {
//       req.session.loggedinUser = true;
//       req.session.emailAddress = emailAddress;
//       res.redirect('/userInfo'); // Redirect to user dashboard after login
//     } else {
//       res.render('login-form.ejs', {alertMsg: "Your Email Address or password is wrong"});
//     }
//   });
// });

// // Add POST route for signup form submission
// router.post('/register', function(req, res) {
//   var name = req.body.name;
//   var email = req.body.email_address;
//   var password = req.body.password;
  
//   // Check if user already exists
//   var checkUser = 'SELECT * FROM registration WHERE email_address = ?';
//   conn.query(checkUser, [email], function(err, result) {
//     if (err) throw err;
//     if (result.length > 0) {
//       return res.render('signup-form.ejs', {alertMsg: "Email already registered"});
//     }
    
//     // Insert new user
//     var insertUser = 'INSERT INTO registration (name, email_address, password) VALUES (?, ?, ?)';
//     conn.query(insertUser, [name, email, password], function(err, result) {
//       if (err) throw err;
//       return res.render('login-form.ejs', {successMsg: "Registration successful. Please login."});
//     });
//   });
// });

// // Admin login route
// router.get('/adlogin', function(req, res) {
//   res.render('admin-login.ejs');
// });

// // Admin login authentication
// router.post('/adlogin', function(req, res) {
//   var username = req.body.username;
//   var password = req.body.password;
  
//   // Hardcoded admin credentials (consider storing this securely in a database)
//   if (username === 'admin' && password === 'adminpass') {
//     req.session.adminLoggedin = true;
//     res.redirect('/admin/dashboard');
//   } else {
//     res.render('admin-login.ejs', {alertMsg: "Invalid admin credentials"});
//   }
// });

// // Existing registration data processing route - Fixed with better error handling
// router.post('/registerdata', function(req, res) {
//   try {
//     data = req.body.aadharno;    //data stores aadhar no
//     console.log("Aadhar number submitted:", data);
//     account_address = req.body.account_address;     //stores metamask acc address
//     console.log("Account address:", account_address);
    
//     if (!data || data.trim() === '') {
//       return res.render('voter-registration.ejs', {alertMsg: "Please enter a valid Aadhar number"});
//     }
    
//     if (!account_address || account_address.trim() === '') {
//       return res.render('voter-registration.ejs', {alertMsg: "Please provide your account address"});
//     }
    
//     // Important: Log the exact SQL query to verify
//     let sql = "SELECT * FROM aadhar_info WHERE aadhar_number = ?";
//     console.log("Executing SQL:", sql, "with param:", data);
    
//     conn.query(sql, [data], (error, results, fields) => {
//       if (error) {
//         console.error("Database error:", error.message);
//         return res.render('voter-registration.ejs', {alertMsg: "Database error occurred. Please try again."});
//       }
      
//       console.log("Raw DB results:", JSON.stringify(results, null, 2));
      
//       if (!results || results.length === 0) {
//         return res.render('voter-registration.ejs', {alertMsg: "Invalid Aadhar number"});
//       }
      
//       // Log all column names to identify exact case
//       console.log("Column names in result:", Object.keys(results[0]));
      
//       // First row of results
//       const firstRow = results[0];
      
//       // Handle case-insensitive column names by checking multiple possible variations
//       const possibleDobColumns = ['dob', 'Dob', 'DOB', 'date_of_birth', 'Date_of_birth'];
//       const possibleEmailColumns = ['email', 'Email', 'EMAIL', 'email_address', 'Email_address'];
//       const possibleRegisteredColumns = ['is_registered', 'Is_registered', 'IS_REGISTERED', 'registered'];
      
//       // Find the correct column for DOB
//       let dobValue = null;
//       for (const col of possibleDobColumns) {
//         if (firstRow[col] !== undefined) {
//           dobValue = firstRow[col];
//           console.log("Found DOB in column:", col);
//           break;
//         }
//       }
      
//       // Find the correct column for email
//       let emailValue = null;
//       for (const col of possibleEmailColumns) {
//         if (firstRow[col] !== undefined) {
//           emailValue = firstRow[col];
//           console.log("Found email in column:", col);
//           break;
//         }
//       }
      
//       // Find the correct column for is_registered
//       let isRegistered = 'NO';
//       for (const col of possibleRegisteredColumns) {
//         if (firstRow[col] !== undefined) {
//           isRegistered = firstRow[col];
//           console.log("Found registration status in column:", col);
//           break;
//         }
//       }
      
//       if (!dobValue) {
//         console.error("DOB column not found in database result");
//         return res.render('voter-registration.ejs', {alertMsg: "Error: Date of birth information not found"});
//       }
      
//       if (!emailValue) {
//         console.error("Email column not found in database result");
//         return res.render('voter-registration.ejs', {alertMsg: "Error: Email information not found"});
//       }
      
//       console.log("DOB value:", dobValue);
//       console.log("Email value:", emailValue);
//       console.log("Is registered value:", isRegistered);
      
//       // Calculate age using our reliable function
//       var age = calculateAge(dobValue);
//       console.log("Final calculated age:", age);
      
//       // Check if registered (case-insensitive)
//       var isAlreadyRegistered = isRegistered && 
//         (isRegistered.toString().toUpperCase() === 'YES');
      
//       console.log("Is already registered?", isAlreadyRegistered);
      
//       if (!isAlreadyRegistered) {
//         if (age >= 18) {
//           console.log("Age verification passed (age is " + age + "), sending OTP");
          
//           // Generate a fresh OTP for this request
//           rand = Math.floor((Math.random() * 10000) + 54);
//           console.log("Generated OTP:", rand);
          
//           // Use the email from the database for OTP
//           var mailOptions = {
//             from: 'election.blockchain@gmail.com',
//             to: emailValue,
//             subject: "Please confirm your Email account",
//             text: "Hello, Your OTP for voter registration is " + rand,
//             html: `
//             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
//               <h2 style="color: #333;">Voter Registration Verification</h2>
//               <p>Thank you for registering to vote using our blockchain-based system.</p>
//               <p>Your One-Time Password (OTP) is:</p>
//               <h1 style="color: #4682B4; font-size: 32px; text-align: center; padding: 10px; background-color: #f8f8f8; border-radius: 5px;">${rand}</h1>
//               <p>Please enter this OTP in the verification page to complete your registration.</p>
//               <p>If you did not request this OTP, please ignore this email.</p>
//               <p>Thank you,<br>Election Blockchain Team</p>
//             </div>
//             `
//           };
          
//           // Send email with better error handling
//           transporter.sendMail(mailOptions, function(error, info) {
//             if (error) {
//               console.error("Detailed email error:", error);
//               return res.render('voter-registration.ejs', 
//                 {alertMsg: "Error sending OTP. Please check your email address and try again."});
//             } else {
//               console.log('Email sent successfully: ' + info.response);
//               // Store OTP in session for verification (more secure than global variable)
//               if (req.session) {
//                 req.session.otp = rand;
//                 req.session.aadhar = data;
//                 req.session.accountAddress = account_address;
//               }
//               res.render('emailverify.ejs');
//             }
//           });
//         } else {
//           console.log("Age verification failed: age is " + age + " (less than 18)");
//           res.render('voter-registration.ejs', {alertMsg: "You cannot vote as your age is less than 18"});
//         }
//       } else {
//         console.log("User already registered, cannot register again");
//         res.render('voter-registration.ejs', {alertMsg: "You are already registered. You cannot register again"});
//       }
//     });
//   } catch (err) {
//     console.error("Unexpected error in /registerdata:", err);
//     res.render('voter-registration.ejs', {alertMsg: "An unexpected error occurred. Please try again."});
//   }
// });

// // OTP verification route - Updated to use session-stored OTP
// router.post('/otpverify', (req, res) => {
//   try {
//     var otp = req.body.otp;
//     var sessionOtp = req.session.otp || rand; // Fallback to the global rand if not in session
//     var sessionAadhar = req.session.aadhar || data;
//     var sessionAccountAddress = req.session.accountAddress || account_address;
    
//     console.log("OTP received:", otp, "Expected:", sessionOtp);
    
//     if (otp == sessionOtp) {
//       console.log("OTP verified successfully");
//       var record = { Account_address: sessionAccountAddress, Is_registered: 'Yes' };
//       var sql = "INSERT INTO registered_users SET ?";
//       conn.query(sql, record, function(err2, res2) {
//         if (err2) {
//           console.error("Error inserting into registered_users:", err2);
//           return res.render('voter-registration.ejs', {alertMsg: "Registration failed. Please try again."});
//         } else {
//           console.log("User registered in registered_users");
          
//           // Handle possible column name variations
//           const possibleColumns = ['is_registered', 'Is_registered', 'IS_REGISTERED', 'registered'];
//           let updateQueries = possibleColumns.map(col => {
//             return new Promise((resolve, reject) => {
//               var updateSql = `UPDATE aadhar_info SET ${col} = ? WHERE aadhar_number = ?`;
//               var record1 = ['YES', sessionAadhar];
              
//               console.log("Trying update with column:", col);
//               conn.query(updateSql, record1, function(err1, res1) {
//                 if (err1) {
//                   // This might fail for columns that don't exist - that's okay
//                   console.log(`Update with column ${col} failed:`, err1.message);
//                   resolve(false);
//                 } else if (res1.affectedRows > 0) {
//                   console.log(`1 record updated in aadhar_info using column ${col}`);
//                   resolve(true);
//                 } else {
//                   console.log(`No records updated with column ${col}`);
//                   resolve(false);
//                 }
//               });
//             });
//           });
          
//           // Try all possible column names and see if any succeed
//           Promise.all(updateQueries).then(results => {
//             const anyUpdated = results.some(result => result === true);
            
//             if (anyUpdated) {
//               // Clear the session OTP after successful verification
//               if (req.session) {
//                 delete req.session.otp;
//                 delete req.session.aadhar;
//                 delete req.session.accountAddress;
//               }
              
//               var msg = "You are successfully registered";
//               res.render('voter-registration.ejs', {alertMsg: msg});
//             } else {
//               console.log("Failed to update registration status in aadhar_info");
//               var msg = "You are registered as a voter, but there was an issue updating your Aadhar information. Please contact support.";
//               res.render('voter-registration.ejs', {alertMsg: msg});
//             }
//           }).catch(err => {
//             console.error("Error in update process:", err);
//             var msg = "Registration process incomplete. Please contact support.";
//             res.render('voter-registration.ejs', {alertMsg: msg});
//           });
//         }
//       }); 
//     } else {
//       console.log("OTP verification failed");
//       res.render('voter-registration.ejs', {alertMsg: "Invalid OTP! Please try again."});
//     }
//   } catch (err) {
//     console.error("Unexpected error in /otpverify:", err);
//     res.render('voter-registration.ejs', {alertMsg: "An unexpected error occurred during verification. Please try again."});
//   }
// });

// // Route to handle logout
// router.get('/logout', function(req, res) {
//   req.session.destroy();
//   res.redirect('/');
// });

// module.exports = router;

var dotenv = require('dotenv');
// Load environment variables first
dotenv.config();

var express = require('express');
var router = express.Router();
var conn = require('../database');
var getAge = require('get-age');
var nodemailer = require('nodemailer');
var dotenv = require('dotenv');

// Load environment variables if .env file exists
try {
  dotenv.config();
} catch (e) {
  console.log("No .env file found, using default or provided credentials");
}

// Email configuration with security improvements
// Generate a random OTP
function generateOTP() {
  return Math.floor((Math.random() * 10000) + 54);
}

// Create a more secure transporter with environment variables
// Use environment variables if available, otherwise use fallback values
// IMPORTANT: You should create a .env file with these values
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'webmorphtechnology@gmail.com',
      // SECURITY: Store this in environment variables, not in code
      pass: process.env.EMAIL_PASS // Replace with actual app password when testing
    },
    tls: {
      rejectUnauthorized: true // May help in some environments with certificate issues
    }
});

// For testing the email connection at startup
transporter.verify(function(error, success) {
    if (error) {
      console.error('SMTP server connection error:', error);
    } else {
      console.log('SMTP server connection successful');
    }
});

// Variables to store user data in session rather than global variables
// These will be used as fallbacks if session storage fails

// Robust age calculation function that handles different date formats
function calculateAge(birthDate) {
  console.log("Calculating age for date:", birthDate);
  
  // Handle different date formats
  let birthDateObj;
  if (birthDate instanceof Date) {
    birthDateObj = birthDate;
  } else if (typeof birthDate === 'string') {
    // Try different date parsing approaches
    birthDateObj = new Date(birthDate);
    
    // If invalid, try to parse manually
    if (isNaN(birthDateObj.getTime())) {
      const formats = [
        // YYYY-MM-DD
        /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
        // MM/DD/YYYY
        /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
        // DD-MM-YYYY
        /^(\d{1,2})-(\d{1,2})-(\d{4})$/
      ];
      
      for (const format of formats) {
        const parts = birthDate.match(format);
        if (parts) {
          if (format === formats[0]) { // YYYY-MM-DD
            birthDateObj = new Date(parseInt(parts[1]), parseInt(parts[2])-1, parseInt(parts[3]));
          } else if (format === formats[1]) { // MM/DD/YYYY
            birthDateObj = new Date(parseInt(parts[3]), parseInt(parts[1])-1, parseInt(parts[2]));
          } else if (format === formats[2]) { // DD-MM-YYYY
            birthDateObj = new Date(parseInt(parts[3]), parseInt(parts[2])-1, parseInt(parts[1]));
          }
          break;
        }
      }
    }
  }
  
  // Check if we have a valid date object
  if (!birthDateObj || isNaN(birthDateObj.getTime())) {
    console.error("Invalid date provided:", birthDate);
    return 0; // Return 0 or a default age for invalid dates
  }
  
  const today = new Date();
  
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDifference = today.getMonth() - birthDateObj.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }
  
  console.log("Birth date:", birthDateObj);
  console.log("Today:", today);
  console.log("Calculated age:", age);
  
  return age;
}

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

// Existing registration data processing route - Fixed with better error handling
router.post('/registerdata', function(req, res) {
  try {
    // Get data from form submission
    const aadharNo = req.body.aadharno;
    const accountAddress = req.body.account_address;
    
    console.log("Aadhar number submitted:", aadharNo);
    console.log("Account address:", accountAddress);
    
    // Store in session for later use
    if (req.session) {
      req.session.tempAadhar = aadharNo;
      req.session.tempAccountAddress = accountAddress;
    }
    
    // Validate input
    if (!aadharNo || aadharNo.trim() === '') {
      return res.render('voter-registration.ejs', {alertMsg: "Please enter a valid Aadhar number"});
    }
    
    if (!accountAddress || accountAddress.trim() === '') {
      return res.render('voter-registration.ejs', {alertMsg: "Please provide your account address"});
    }
    
    // Query database for aadhar information
    let sql = "SELECT * FROM aadhar_info WHERE aadhar_number = ?";
    console.log("Executing SQL:", sql, "with param:", aadharNo);
    
    conn.query(sql, [aadharNo], (error, results, fields) => {
      if (error) {
        console.error("Database error:", error.message);
        return res.render('voter-registration.ejs', {alertMsg: "Database error occurred. Please try again."});
      }
      
      console.log("Raw DB results:", JSON.stringify(results, null, 2));
      
      if (!results || results.length === 0) {
        return res.render('voter-registration.ejs', {alertMsg: "Invalid Aadhar number"});
      }
      
      // Get the first row of results
      const firstRow = results[0];
      console.log("Full user record:", JSON.stringify(firstRow));
      
      // Log all column names to identify exact case
      const columnNames = Object.keys(firstRow);
      console.log("Column names in result:", columnNames);
      
      // Find the exact column names (case-sensitive) that contain our needed data
      const dobColumn = columnNames.find(col => col.toLowerCase().includes('dob') || col.toLowerCase().includes('date_of_birth'));
      const emailColumn = columnNames.find(col => col.toLowerCase().includes('email'));
      const registeredColumn = columnNames.find(col => col.toLowerCase().includes('registered'));
      
      console.log("Found columns - DOB:", dobColumn, "Email:", emailColumn, "Registered:", registeredColumn);
      
      if (!dobColumn || !firstRow[dobColumn]) {
        console.error("DOB column not found or empty in database result");
        return res.render('voter-registration.ejs', {alertMsg: "Error: Date of birth information not found"});
      }
      
      if (!emailColumn || !firstRow[emailColumn]) {
        console.error("Email column not found or empty in database result");
        return res.render('voter-registration.ejs', {alertMsg: "Error: Email information not found"});
      }
      
      const dobValue = firstRow[dobColumn];
      const emailValue = firstRow[emailColumn];
      const isRegistered = registeredColumn ? firstRow[registeredColumn] : 'NO';
      
      console.log("DOB value:", dobValue);
      console.log("Email value:", emailValue);
      console.log("Is registered value:", isRegistered);
      
      // Calculate age
      const age = calculateAge(dobValue);
      console.log("Final calculated age:", age);
      
      // Check if already registered
      const isAlreadyRegistered = isRegistered && 
        (isRegistered.toString().toUpperCase() === 'YES');
      
      console.log("Is already registered?", isAlreadyRegistered);
      
      if (!isAlreadyRegistered) {
        if (age >= 18) {
          console.log("Age verification passed (age is " + age + "), sending OTP");
          
          // Generate a fresh OTP
          const otp = generateOTP();
          console.log("Generated OTP:", otp);
          
          // Store OTP securely in session
          if (req.session) {
            req.session.otp = otp;
            req.session.aadhar = aadharNo;
            req.session.accountAddress = accountAddress;
            req.session.userEmail = emailValue;
          }
          
          // Prepare email content
          var mailOptions = {
            from: process.env.EMAIL_USER || 'webmorphtechnology@gmail.com',
            to: emailValue,
            subject: "Please confirm your Email account",
            text: "Hello, Your OTP for voter registration is " + otp,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
              <h2 style="color: #333;">Voter Registration Verification</h2>
              <p>Thank you for registering to vote using our blockchain-based system.</p>
              <p>Your One-Time Password (OTP) is:</p>
              <h1 style="color: #4682B4; font-size: 32px; text-align: center; padding: 10px; background-color: #f8f8f8; border-radius: 5px;">${otp}</h1>
              <p>Please enter this OTP in the verification page to complete your registration.</p>
              <p>If you did not request this OTP, please ignore this email.</p>
              <p>Thank you,<br>Election Blockchain Team</p>
            </div>
            `
          };
          
          // Send email with detailed error handling
          // transporter.sendMail(mailOptions, function(error, info) {
          //   if (error) {
          //     console.error("Detailed email error:", error);
              
          //     // Check specific error types for better error messages
          //     if (error.code === 'EAUTH') {
          //       console.error("Authentication failed - check credentials");
          //       return res.render('voter-registration.ejs', 
          //         {alertMsg: "Email server authentication failed. Please contact administrator."});
          //     } else if (error.code === 'ESOCKET') {
          //       console.error("Socket error - check network connection");
          //       return res.render('voter-registration.ejs', 
          //         {alertMsg: "Network error when sending email. Please try again."});
          //     } else {
          //       return res.render('voter-registration.ejs', 
          //         {alertMsg: "Error sending OTP. Please check your email address and try again."});
          //     }
          //   } else {
          //     console.log('Email sent successfully: ' + info.response);
          //     // Redirect to verification page
          //     res.render('emailverify.ejs');
          //   }
          // });

          transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
              console.error("Detailed email error:", error);
              if (error.code === 'EAUTH') {
                console.error("Authentication failed - check credentials");
                return res.render('voter-registration.ejs', 
                  {alertMsg: "Email server authentication failed. Please try with different credentials."});
              } else {
                return res.render('voter-registration.ejs', 
                  {alertMsg: "Error sending OTP. Please try again later."});
              }
            } else {
              console.log('Email sent successfully: ' + info.response);
              res.render('emailverify.ejs');
            }
          });

        } else {
          console.log("Age verification failed: age is " + age + " (less than 18)");
          res.render('voter-registration.ejs', {alertMsg: "You cannot vote as your age is less than 18"});
        }
      } else {
        console.log("User already registered, cannot register again");
        res.render('voter-registration.ejs', {alertMsg: "You are already registered. You cannot register again"});
      }
    });
  } catch (err) {
    console.error("Unexpected error in /registerdata:", err);
    res.render('voter-registration.ejs', {alertMsg: "An unexpected error occurred. Please try again."});
  }
});

// OTP verification route - Updated to use session-stored OTP
router.post('/otpverify', (req, res) => {
  try {
    var otp = req.body.otp;
    var sessionOtp = req.session.otp;
    var sessionAadhar = req.session.aadhar;
    var sessionAccountAddress = req.session.accountAddress;
    
    console.log("OTP received:", otp, "Expected:", sessionOtp);
    
    // Validate we have all required data
    if (!sessionOtp || !sessionAadhar || !sessionAccountAddress) {
      console.error("Missing session data:", { 
        hasOTP: !!sessionOtp, 
        hasAadhar: !!sessionAadhar, 
        hasAddress: !!sessionAccountAddress 
      });
      return res.render('voter-registration.ejs', 
        {alertMsg: "Session data lost. Please start the registration process again."});
    }
    
    if (otp == sessionOtp) {
      console.log("OTP verified successfully");
      var record = { Account_address: sessionAccountAddress, Is_registered: 'Yes' };
      var sql = "INSERT INTO registered_users SET ?";
      conn.query(sql, record, function(err2, res2) {
        if (err2) {
          console.error("Error inserting into registered_users:", err2);
          return res.render('voter-registration.ejs', {alertMsg: "Registration failed. Please try again."});
        } else {
          console.log("User registered in registered_users");
          
          // Find the correct column name for registration status
          conn.query("DESCRIBE aadhar_info", function(err, columns) {
            if (err) {
              console.error("Error getting column details:", err);
              return res.render('voter-registration.ejs', {alertMsg: "Database error occurred. Please try again."});
            }
            
            // Find the registration status column
            const registeredColumn = columns.find(col => 
              col.Field.toLowerCase().includes('register')
            );
            
            if (registeredColumn) {
              const columnName = registeredColumn.Field;
              console.log("Found registration column:", columnName);
              
              // Update the registration status
              var updateSql = `UPDATE aadhar_info SET ${columnName} = ? WHERE aadhar_number = ?`;
              conn.query(updateSql, ['YES', sessionAadhar], function(err1, res1) {
                if (err1) {
                  console.error("Error updating aadhar_info:", err1);
                  
                  // Still consider the registration successful if the user is in registered_users
                  var msg = "You are registered as a voter, but there was an issue updating your Aadhar information.";
                  
                  // Clear session data
                  if (req.session) {
                    delete req.session.otp;
                    delete req.session.aadhar;
                    delete req.session.accountAddress;
                  }
                  
                  res.render('voter-registration.ejs', {alertMsg: msg});
                } else {
                  console.log("Registration status updated in aadhar_info");
                  
                  // Clear session data
                  if (req.session) {
                    delete req.session.otp;
                    delete req.session.aadhar;
                    delete req.session.accountAddress;
                  }
                  
                  var msg = "You are successfully registered";
                  res.render('voter-registration.ejs', {alertMsg: msg});
                }
              });
            } else {
              console.error("Could not find registration status column");
              
              // Still consider the registration successful if the user is in registered_users
              var msg = "You are registered as a voter, but there was an issue updating your Aadhar information.";
              
              // Clear session data
              if (req.session) {
                delete req.session.otp;
                delete req.session.aadhar;
                delete req.session.accountAddress;
              }
              
              res.render('voter-registration.ejs', {alertMsg: msg});
            }
          });
        }
      }); 
    } else {
      console.log("OTP verification failed");
      res.render('voter-registration.ejs', {alertMsg: "Invalid OTP! Please try again."});
    }
  } catch (err) {
    console.error("Unexpected error in /otpverify:", err);
    res.render('voter-registration.ejs', {alertMsg: "An unexpected error occurred during verification. Please try again."});
  }
});

// Route to handle logout
router.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;