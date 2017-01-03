// var express = require('express');
// var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');

// var routes = require('./routes/index');
// var users = require('./routes/users');

// var app = express();

// var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
// var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

// app.listen(server_port, server_ip_address);	

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// // uncomment after placing your favicon in /public
// //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
// app.use('/users', users);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });


// module.exports = app;


var express = require('express');//comment
var app = express();
var fs      = require('fs');
var parser  = require('body-parser');

//Setup ip adress and port
var ipaddress ;

// function initIPAdress() {
//     var adr = process.env.OPENSHIFT_NODEJS_IP;
//     if (typeof adr === "undefined") {
//             //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
//             //  allows us to run/test the app locally.
//             console.warn('No OPENSHIFT_NODEJS_IP var, using localhost');
//             adr = 'localhost';
//     }

//     ipaddress = adr;
// }

var port  = process.env.OPENSHIFT_NODEJS_PORT || 3000;


app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/admin', function (req, res) {
        res.setHeader('Content-Type', 'text/html'); 
        res.send( fs.readFileSync('./index.html') );
})

// initIPAdress(); //Setup IP adress before app.listen()

app.listen(port, ipaddress, function() {
        console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), ipaddress, port);
});



