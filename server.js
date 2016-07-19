
var port = process.env.PORT || 8080; 
var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var port = 'localhost';
var path = require('path');

var smtpTransport = nodemailer.createTransport(smtpTransport({
    service : "Gmail",
    secureConnection : false,
    port: 587,
    auth : {
        user : "srjrivals@gmail.com",
        pass : ""
    }
}));

app.use("/", express.static(path.join(__dirname, 'public')));
app.use('app-content', express.static(__dirname, + '/app-content'));
app.use('app-services', express.static(__dirname, + '/app-services'));
app.use('views', express.static(__dirname, + '/views'));
app.use('', express.static(__dirname, + '/home'));

var mysql = require('mysql');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); 

app.get('/',function(req,res){
	 res.sendFile('index.html',{root: __dirname });
});

/******************************** Login function *****************************************/

app.post('/api/authenticate', function(req, res, next)
{
  var connection = mysql.createConnection
	({
  		host     : 'localhost',
  		user     : 'root',
  		password : '',
  		database : 'registration'
	});
	connection.connect();
	var query = "SELECT * from login where username='" + req.body.username + "' and password='" + req.body.password + "'";
  var response;
	connection.query(query, function(err, rows, fields) {
  	if (!err)
  	{
    	if(rows=='' || rows[0]=='undefined')
    	{
    		response = { success: false, message: 'Username or password is incorrect' };
    	}
    	else
    	{
        response = { success: true };
    	}
  	}
  	else
  	{
    	console.log('Error while performing Query.');
    	response = { success: false, message: 'Username or password is incorrect' };
  	}
    res.send(response);
	});
	connection.end();
});

/****************************************** Add new course ***************************************/

app.post('/api/addcourse',function(req,res)
{
   var connection = mysql.createConnection
  ({
      host     : 'localhost',
      user     : 'root',
      password : '',
      database : 'registration'
  });
  connection.connect();
  /*console.log(req.body.CourseName + ", " + req.body.Duration + ", " + req.body.NoOfInstallmentsAllowed + ", " + req.body.fees + ", " + 
  req.body.BatchSize + ", " + req.body.FacultyName );
  */
  var query = "INSERT INTO course(CourseName, Duration, NoOfInstallmentsAllowed, Fees, BatchSize, FacultyName) VALUES " + 
  "('" + req.body.CourseName + "', " + req.body.Duration + ", " + req.body.NoOfInstallmentsAllowed + ", " + req.body.fees + ", " + 
  req.body.BatchSize + ", '" + req.body.FacultyName + "')";

  /*console.log("sql : " + query);*/
  var response;
  connection.query(query, function(err, rows, fields) 
  {
    if(err)
    {
      /*console.log(err);*/
      response = { success: false, message: 'Due to this error DB operation failed' + err };
    }
    else
    {      
      response = { success: true };
    }
    res.send(response);
  });
  connection.end();
});

/********************************* Add to student table ************************************/

app.post('/api/enrollStudent',function(req,res)
{
  var connection = mysql.createConnection
  ({
      host     : 'localhost',
      user     : 'root',
      password : '',
      database : 'registration'
  });
  connection.connect();
/* console.log(req.body.studentName + ", " + req.body.studentAddress + ", " + req.body.studentEmail + ", " + req.body.studentContact + ", " + 
  req.body.courseSelect + ", " + req.body.courseId  + ", " + req.body.paymentMode + ", " + req.body.installmentPaid + ", " + req.body.joinDate );
 */ 

  var query = "INSERT INTO student (FullName, Address, EmailAddress, ContactNo) VALUES " +"('" + req.body.FullName + " ','"+ req.body.Address + "','"+ req.body.EmailAddress +"',"+req.body.ContactNo+")";

  var response;
  connection.query(query, function(err, rows, fields) 
  {
    if(err)
    {
      console.log(err);
      response = { success: false, message: 'Due to this error DB operation failed' + err };
    }
    else
    {      
      response = { success: true };
    }
    res.send(response);
  });
  connection.end();
});

/************************************* Add to Register table **********************************/

app.post('/api/enterRegister',function(req,res)
{
   var connection = mysql.createConnection
  ({
      host     : 'localhost',
      user     : 'root',
      password : '',
      database : 'registration'
  });
  connection.connect();
 
  var query = "INSERT INTO registration (StudentId, CourseId, ModeOfPayment, InstallmentPaid, JoiningDate)VALUES " +"(" + req.body.StudentId + ","+ req.body.CourseId + ",'"+ req.body.ModeOfPayment +"',"+req.body.InstallmentPaid+",'"+req.body.JoiningDate+"')";

  /*console.log(query);
  */
  var response;
  connection.query(query, function(err, rows, fields) 
  {
    if(err)
    {
     response = { success: false, message: 'Due to this error DB operation failed' + err };
    }
    else
    {      
      response = { success: true };
    }
    res.send(response);
  });
  connection.end();
});

/************************************* Get all Courses for select ***********************************/

app.post('/api/getCourse',function(req,res)
{
   var connection = mysql.createConnection
  ({
      host     : 'localhost',
      user     : 'root',
      password : '',
      database : 'registration'
  });
  connection.connect();
  var query = "SELECT CourseId, CourseName FROM course";
  var response;
  connection.query(query, function(err, rows, fields) 
  {
    if(err)
    {
      console.log(err);
      response = { success: false, message: 'No items or No response from database' + err };
    }
    else
    {
      response = { success: true, value: rows };
    }
    res.send(response);
  });
  connection.end();
});

/************************************** Get Student ID ************************************/

app.post('/api/getStudentId',function(req,res)
{
   var connection = mysql.createConnection
  ({
      host     : 'localhost',
      user     : 'root',
      password : '',
      database : 'registration'
  });
  connection.connect();

  var query = "SELECT `AUTO_INCREMENT` FROM  INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'registration' AND   TABLE_NAME   = 'student';";
  /*console.log(query);
  */
  var response;
  connection.query(query, function(err, rows, fields) 
  {
    if(err)
    {
      console.log(err);
      response = { success: false, message: 'No items or No response from database' + err };
    }
    else
    {
      response = { success: true, value: rows };
    }
    res.send(response);
  });
  connection.end();
});

/********************************* to search Details *************************************/

app.post('/api/searchDetail',function(req,res)
{
   var connection = mysql.createConnection
  ({
      host     : 'localhost',
      user     : 'root',
      password : '',
      database : 'registration'
  });
  connection.connect();
  var query = "SELECT * FROM student INNER JOIN registration ON student.StudentId=registration.StudentId AND student.StudentId ='" + req.body.keyword + "'";
  var response;
  /*console.log(query);
  */
  connection.query(query, function(err, rows, fields) 
  {
    if(err)
    {
      console.log(err);
      response = { success: false, message: 'No items or No response from database' + err };
    }
    else
    {
      response = { success: true, value: rows };
    }
    res.send(response);
  });
  connection.end();
});

/*********************************** to check availability *********************************/

app.post('/api/checkAvailability',function(req,res)
{
   var connection = mysql.createConnection
  ({
      host     : 'localhost',
      user     : 'root',
      password : '',
      database : 'registration'
  });
  connection.connect();
  var query = "SELECT COUNT(*) as count FROM registration as r where r.CourseId  ='" +  req.body.CourseId + "' UNION SELECT BatchSize FROM course as c where c.CourseId  ='" +  req.body.CourseId + "'";
  console.log(query);
  var response;
  connection.query(query, function(err, rows, fields) 
  {
    if(err)
    {
      console.log(err);
      response = { success: false, message: 'No items or No response from database' + err };
    }
    else
    {
      response = { success: true, value: rows };
    }
    res.send(response);
  });
  connection.end();
});

/********************************* To get fee Installment ******************************/

app.post('/api/feeInstall',function(req,res)
{
   var connection = mysql.createConnection
  ({
      host     : 'localhost',
      user     : 'root',
      password : '',
      database : 'registration'
  });
  connection.connect();
  var query = "SELECT * FROM registration r  left OUTER join course c on (r.CourseId = c.CourseId) INNER JOIN student s on (s.StudentId=r.StudentId) WHERE ModeOfPayment ='I'";
  var response;
  connection.query(query, function(err, rows, fields) 
  {
    if(err)
    {
      console.log(err);
      response = { success: false, message: 'No items or No response from database' + err };
    }
    else
    {
      response = { success: true, value: rows};
    }
    connection.end();
    console.log(response);
    res.send(response);
  });
});

app.post('/api/send',function(req,res)
{
  console.log('came here');
  var mailOptions={
      to : req.body.to,
      subject : req.body.subject,
      text : req.body.text
  }
  console.log(mailOptions);
  smtpTransport.sendMail(mailOptions, function(error, response)
  {
    if(error)
    {
      console.log(error);
      res.end("error");
    }
    else
    {
      console.log("Message sent: " + response);
      res.end("sent");
    }
  });
});


app.listen(8080, function () {
  console.log('Example app listening on port !' + '8080');
});


console.log("App listening on port " + port);