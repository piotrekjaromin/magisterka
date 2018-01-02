var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var GeojsonModel = new Schema({
  type: String,
  features: [
    {
      type: String,
      id: String,
      properties: {
        timestamp: string,
        version: string,
        changeset: string,
        user: string,
        uid: string,
        name: string,
        network: string,
        ref: string,
        route: string,
        type: string,
        website: string
      }
    }
  ]
});

module.exports = mongoose.model("GeojsonModel", GeojsonModel);

