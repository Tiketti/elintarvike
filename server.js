var express = require('express');
var app = express();

app.use(express.static(__dirname));
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendfile('index.html', {root: __dirname })
});
var port = process.env.PORT || 8080;
var server = app.listen(port);
console.log("Server listening at port %s", port);
