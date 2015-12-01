var Router = require("express").Router();

var jade = require("jade");
var pdf = require("html-pdf");
var fs = require("fs");

var request = require("request");

var hackerNewsBaseUrl = "https://hacker-news.firebaseio.com/v0/item/"


Router.get("/:id", function (req, res, next) {
  var id = parseInt(req.params.id);
  var url = hackerNewsBaseUrl + id + ".json"
  request(url, function (error, response, body) {
    var jsonBody = JSON.parse(body);
    if (jsonBody == null || jsonBody.type != "story") {
      res.send("not valid item")
    }
    else {
      return pdfMaker(res, jsonBody);
    }
  })
})

function pdfMaker(res, body) {
  var ycBody = ycStoryBodyFormat(body)
  var jadeFile = fs.readFileSync("./html.jade", "utf-8");
  res.type("pdf");
  pdf.create(jade.render(jadeFile, ycBody), {format: "Letter"}).toStream(function (err, stream) {
    stream.pipe(res);
  })

}

function ycStoryBodyFormat(body) {
  body.time = daysAgo(parseInt(body.time));
  body.filename = "html.jade";
  return body;
}

function daysAgo(duration) {
  var now = Date.now();
  duration = duration * 1000

  return Math.round((now - duration) / (86400 * 1000))
}

module.exports = Router;
