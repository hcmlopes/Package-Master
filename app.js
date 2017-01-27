var express     = require("express");
var bodyParser  = require("body-parser");
var app         = express();
var multer      = require("multer");
var fs          = require("fs");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var dir = 'uploads/' + req.body.projectName + Date.now() ;
    fs.mkdir(dir)
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage: storage });

var mongoose    = require('mongoose');

mongoose.connect("mongodb://localhost/package_master");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Database schema
var orderSchema = new mongoose.Schema({
    dateCreated: {type: Date, default: Date.now()},
    projectName: String,
    subjects: Number,
    status: String
});

var Order = mongoose.model("Order", orderSchema);

// Sample data
// var orders =[
//     {created : "10/15/2016", name : "Davie Elementary - Underclass 2016", subjects : "856", status : "Pending"},
//     {created : "09/15/2016", name : "Cardinal Gibbons - Underclass 2016", subjects : "918", status : "Ready"},
//     {created : "10/15/2016", name : "Boca Raton Christian School - Underclass 2016", subjects : "650", status : "Ready"}
// ];

// create item in database
// var newOrder = {projectName : "Davie Elementary - Underclass 2016", subjects : "856", status : "Pending"};
// 	Order.create(newOrder, function(err, newlyCreated){
// 		if(err){
// 			console.log(err);
// 		} 
// 	});
    
// Routes
app.get("/orders", function(req, res){
    Order.find({}, function(err, allOrders){
        if (err) {
            console.log("Error: " + err);
        } else {
            res.render("index", {orders: allOrders});
        }
    });
});

app.post("/orders", upload.array("studentData", 1), function (req, res){
    var projectName = req.body.projectName;
    var newOrder = {projectName : projectName, status : "Pending"};
	Order.create(newOrder, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
		    res.redirect("/orders");
		}
	});
});

app.get("/orders/new", function(req, res) {
    res.render("new");
});



app.listen(process.env.PORT, process.env.IP, function(){
	console.log("Package Master Server has started");
});