var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}))
app.use(bodyParser.json({limit: '50mb'})); // parse application/
app.use(cors());

mongoose.connect('mongodb://localhost:27017/speedlimit');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'błąd połączenia...'));
db.once('open', function () {
  console.log('Connection to db ok');
});

var Schema = mongoose.Schema;
var GeojsonModel = new Schema({
  type: String,
  features: [
    {
      type: String
    }
  ]
});

mongoose.model("GeojsonModel", GeojsonModel)

app.get('/geojson', function (req, res) {


  var query =
    geojsonModel.find({})

  query
    .exec(function (err, products) {
      res.status(200).send(products).end();
    });

});

app.post('/geojson', function (req, res) {

  var Geojson = mongoose.model('GeojsonModel');
  var geojson = new Geojson();
  geojson.type = req.body.type;
  geojson.features = req.body.features;
   console.log(req.body)
  console.log(req.body.features)
  // console.log(req.body.type);
  // console.log(req.body.properties);
  // console.log(req.body.geometry);
  //geojson = req.body;
  console.log(geojson)
  geojson.save(function (err) {
    if (err) throw err;
    console.log('Added geojson.');
  })
  res.status("Ok").send(200);
  res.end();
});




app.listen(5000);
