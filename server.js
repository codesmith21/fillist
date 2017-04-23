
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var chalk = require('chalk');

var app = express();
var port = process.env.PORT || 3000;

// Get all data of the body (POST) parameters
app.use(bodyParser.json());                                         // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));     // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true }));                 // parse application/x-www-form-urlencoded
app.use(cors());

// Interceptor
var counter = 0;
app.use(function (req, res, next) {
    counter++;
    next();
});
setInterval(function () {
    console.log('%s %s %s %s %s %s', "API Hits: ", chalk.yellow(counter), " CPU Utilization: ", chalk.green(JSON.stringify(process.cpuUsage())),
        " Memory Utilization: ", chalk.cyan(JSON.stringify(process.memoryUsage())));
    counter = 0;
}, 1000);

app.use(methodOverride('X-HTTP-Method-Override'));                  // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public'));                     // set the static files location


// Routes
require('./server/server.router')(app);                                    // pass our application into our routes

app.listen(port);	                                                // Start server
console.log('Application started on port: ' + port);

module.exports = app;