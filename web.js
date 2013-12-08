var express = require('express');
var fs = require('fs');
var jade = require('jade');
var app = express();
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
var port = process.env.PORT || 8080;
app.use(express.bodyParser());
app.use(express.cookieParser())
var MongoClient = require('mongodb').MongoClient;
app.locals.pretty = true;

app.use("/static",express.static(__dirname+"/static"));

app.listen(port, function() {                           
  console.log("Listening on " + port);
});
String.prototype.hashCode = function(){
				var hash = 0;
				if (this.length == 0) return hash;
				for (i = 0; i < this.length; i++) {
					char = this.charCodeAt(i);
					hash = ((hash<<5)-hash)+char;
					hash = hash & hash; // Convert to 32bit integer
				}
				return hash;
			}
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
MongoClient.connect('mongodb://'+process.env.MONGOHQUSERNAME+':'+process.env.MONGOHQPASSWORD+'@'+process.env.MONGOHQURL, 
	function(err, db) {
		if(err) throw err;

		app.routes.get = []; //Clear routes
		app.get("/:name",function(request,response)	{
			console.log((""+request.cookies.authkey).hashCode());
			if ((""+request.cookies.authkey).hashCode() != 138352797)
			{
				response.redirect("/");
				return;
			}
			else
				db.collection('math',function(err,collection){
					collection.find({"category":request.params.name}).toArray(
					function(err,items)
					{
						if (items != null)
							response.render("app",{indata:items});
					});
				});
		});
		app.get("/edit/:name",function(request,response)	{
			if ((""+request.cookies.authkey).hashCode() != 138352797)
			{
				response.redirect("/")
				return;
			}
			else
				db.collection('math',function(err,collection){
					collection.find({"category":request.params.name}).toArray(
					function(err,items)
					{
						if (items != null)
							response.render("edit",{data:items, category:request.params.name});
					});
				});
		});
		app.post("/admin/update/:category",function(request,response){
			var str = request.body.data;//.replace("\\plus","+");
			console.log(str);
			var data = JSON.parse(str).data; //No plus sign in POST data aka Little Bobby Tables
			db.collection('math',function(err,collection){
				collection.remove({category:request.params.category},function(err,reply){ //A terrible idea
					collection.insert(data,function(err,reply){
						response.send("done");
						console.log("Updated database");
					});
					
				});
			});
		});
		app.get("/",function(request,response) {
			db.collection('math',function(err,collection){
				collection.distinct("category",
					function(err,items)
					{
						if (items != null)
							response.render("index",{categories:items});
					});
			});
		});
		
	});
