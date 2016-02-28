var mongoose = require('mongoose');

console.log('MONGOLAB_URI: %s', process.env.MONGOLAB_URI);

mongoose.connect(process.env.MONGOLAB_URI);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('mongo connected');
});

var Schema = mongoose.Schema;
var searchSchema = new Schema({
  term: String,
  time: Date
});

var Search = mongoose.model('Search', searchSchema);

searchSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.time = currentDate;

  next();
});

module.exports = Search;
