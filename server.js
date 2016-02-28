var express = require('express');
var fb = require('firebase');
var Search = require('./models/singleSearch');

var app = express();
var ref = new Firebase("https://ilenif.firebaseio.com/");

var foodData = [];

function joulesToCalories(val) {
  if(val === null || val.length < 1) return "";

  var dec = parseFloat(val.replace(',', '.'));
  return (dec / 4.184).toFixed(0);
}

function formatDecimal(val) {
  if(val === null || val.length < 1) return "";

  return parseFloat(val.replace(',', '.')).toFixed(1);
}

ref.once("value", function(data) {
  data.forEach(function(item) {
    var o = item.val()["item"];
    foodData.push(
      {
        "name": o["Name"],
        "enerc": formatDecimal(joulesToCalories(o["Enerc"])),
        "carbs": formatDecimal(o["Choavl"]),
        "prot": formatDecimal(o["Prot"]),
        "fat": formatDecimal(o["Fat"]),
        "fineliid": o["FineliId"]
      }
    );
  });

  console.dir("data ready");
});

app.use(express.static(__dirname));
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendfile('index.html', {root: __dirname })
});

app.get('/api', function (req, res) {
  res.json('API is running');
});

// GET food items by search term
app.get('/api/search/:searchterm?', function (req, res){
  var searchTerm = req.params.searchterm;
  console.dir('searched: ' + searchTerm);

  var singleSearch = new Search({
    term: searchTerm
  });

  singleSearch.save(function (err) {
      if(err) console.log(err);
  });

  var results = [];

  foodData.forEach(function(item) {
    if(item.name.toUpperCase().indexOf(searchTerm.toUpperCase()) > -1) results.push(item);
  });

  res.json(results);

});

var port = process.env.PORT || 8080;
var server = app.listen(port);

console.log("Server listening at port %s", port);
