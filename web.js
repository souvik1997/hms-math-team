var express = require('express');
var fs = require('fs');
var jade = require('jade');
var app = express.createServer(express.logger());
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
var port = process.env.PORT || 8080;
app.use(express.bodyParser());

app.get('/', function(request, response) {
  response.render("index",{ indata : [{type:"mathjax",data:"\\(\\frac{3}{2}\\)"}] })
});

app.use("/static",express.static(__dirname+"/static"));

app.listen(port, function() {                           
  console.log("Listening on " + port);
});
