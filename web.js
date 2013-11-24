var express = require('express');
var fs = require('fs');
var jade = require('jade');
var app = express();
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
var port = process.env.PORT || 8080;
app.use(express.bodyParser());
var MongoClient = require('mongodb').MongoClient;


app.use("/static",express.static(__dirname+"/static"));

app.listen(port, function() {                           
  console.log("Listening on " + port);
});

function getData()
{
	data = [{
				type:"mathjax",
				data:"\\[\\sqrt{36}\\]",
				time:10,
				answer:"\\(\\frac{3}{2}\\)"
			}, 
			{
				type:"image", 
				data:"http://placehold.it/650x100",
				time:30,
				answer:"A"
			}];
	return { indata : data};
}
app.get("/*",function(request,response) //Fallback if the database is down or if a connection has not been established
{
	response.send("Cannot connect to database. Try again later.");
});
MongoClient.connect('mongodb://user123:secret@widmore.mongohq.com:10000/problems', 
	function(err, db) {
		if(err) throw err;

		db.collection('math',function(err,collection)
			{
				app.routes.get = []; //Clear routes
				app.get("/*",function(request,response)
				{
					console.log(request.params[0]);
					console.log(request.query.answer);
					/* A URL can be something like this:
					http://www.example.com/ProblemSetName?answer=true*/
					collection.find().toArray(
						function(err,items)
						{
							if (items != null)
								response.render("index",{indata:items});
						});
				});
			});
		
	});
