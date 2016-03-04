var express = require('express');
var WebSocketServer = require("ws").Server;
var http = require("http")
var fb = require('firebase');
var Search = require('./models/singleSearch');

const helper = require('./modules/helpers');

var foodData = [];
var ref = new Firebase("https://ilenif.firebaseio.com/");

ref.once("value", function(data) {
  data.forEach(function(item) {
    var o = item.val()["item"];
    foodData.push(
      {
        "name": o["Name"],
        "enerc": helper.formatDecimal(helper.joulesToCalories(o["Enerc"]) ),
        "carbs": helper.formatDecimal(o["Choavl"]),
        "prot": helper.formatDecimal(o["Prot"]),
        "fat": helper.formatDecimal(o["Fat"]),
        "fineliid": o["FineliId"]
      }
    );
  });

  console.dir("data ready");
});

var app = express();

var port = process.env.PORT || 8080;
var server = http.createServer(app);
server.listen(port);
console.log("Server listening at port %s", port);

/*  websockets */
var wss = new WebSocketServer({server: server})
console.log("websocket server created")

wss.on("connection", function(ws) {

  // var id = setInterval(function() {
  //   ws.send(JSON.stringify(new Date()), function() {  })
  // }, 3000)

  console.log("websocket connection open")

  ws.on('message', function incoming(searchTerm) {
      console.log('received: %s', searchTerm);

      var singleSearch = new Search({
        term: searchTerm
      });

      singleSearch.save(function (err) {
          if(err) console.log(err);
      });

      var results = [];

      foodData.forEach(function(item) {

        if(item.name.toUpperCase().indexOf(searchTerm.toUpperCase()) > -1)  {
          ws.send(JSON.stringify(item));
        };

      });

      // broadcast used search term to all clients
      wss.broadcast = function broadcast(searchTerm) {
        wss.clients.forEach(function each(client) {
        client.send(searchTerm);
      });
    };
  });


  ws.on("close", function() {
    console.log("websocket connection close");
    // clearInterval(id);
  });

});
/*  websockets */

app.use(express.static(__dirname));
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendfile('index.html', {root: __dirname })
});

/*  RESTful API */
app.get('/api', function (req, res) {
  res.json('API is running');
});

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
/*  RESTful API */
