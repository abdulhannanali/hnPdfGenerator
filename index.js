var express = require("express");
var jade = require("jade");
var morgan = require("morgan");

var pdf = require("./pdfRoute");

var app = express();


var PORT = process.env.PORT || 3000;

app.use(morgan("dev"));

app.use(express.static(__dirname + "/public"));
app.use("/pdf", pdf);

app.listen(PORT, function () {
  console.log("server is listening on port " + PORT);
})
