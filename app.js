var express     = require("express");
var bodyParser  = require("body-parser");
var app         = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
    
// Routes

app.get('/', function(req, res){
    res.render("index");
});


app.listen(process.env.PORT, process.env.IP, function(){
	console.log("Package Master Server has started");
});