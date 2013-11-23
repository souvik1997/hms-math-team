var express = require('express');
var fs = require('fs');
var jade = require('jade');
var app = express();
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
var port = process.env.PORT || 8080;
app.use(express.bodyParser());

app.get('/', function(request, response) {
  response.render("index",getData())
});

app.use("/static",express.static(__dirname+"/static"));

app.listen(port, function() {                           
  console.log("Listening on " + port);
});

function getData()
{
	data = [{type:"mathjax",data:"\\(\\frac{\\mathrm{d} y} {\\mathrm{d} x}\\int_{0}^{\\pi } x^{\\sqrt{x^{\\frac{2}{3}}{}}}\\)"}, /* \frac{3}{2} */
			{type:"image", data:"http://placehold.it/850x150"}];
	num = data.length;
	return { indata : data, numSlides:num };
}
