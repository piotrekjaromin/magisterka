var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var GeojsonModel = new Schema({
  _id: String,
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
        from: string,
        name: string,
        network: string,
        operator: string,
        ref: string,
        route: string,
        state: string,
        to: string,
        type: string,
        website: string,
        id: string
      },
      geometry: {
        type: string,
        coordinates: [
          [
            [
              number, number
            ]
          ]
        ]
      }
    }
  ]
});

module.exports = mongoose.model("GeojsonModel", GeojsonModel);

