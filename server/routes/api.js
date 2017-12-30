var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json()); // parse application/

app.use(cors());

mongoose.connect('mongodb://localhost:27017/speedlimit');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'błąd połączenia...'));
db.once('open', function () {
  console.log('Connection to db ok');
});

var Schema = mongoose.Schema;
var GeojsonModel = new Schema({
  _id: String,
  type: String,
  features: [
    {
      type: String,
      id: String,
      properties: {
        timestamp: String,
        version: String,
        changeset: String,
        user: String,
        uid: String,
        from: String,
        name: String,
        network: String,
        operator: String,
        ref: String,
        route: String,
        state: String,
        to: String,
        type: String,
        website: String,
        id: String
      },
      geometry: {
        type: String,
        coordinates: [
          [
            [
              Number, Number
            ]
          ]
        ]
      }
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
  console.log(req.body.type);
  console.log(req.body.properties);
  console.log(req.body.geometry);
  geojson = req.body;
  console.log(geojson)
  geojson.save(function (err) {
    if (err) throw err;
    console.log('Added geojson.');
  })
  res.send("Ok", 200);
  res.end();
});




app.listen(5000);
