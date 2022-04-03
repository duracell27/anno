const { Schema, model } = require("mongoose");

const schema = new Schema({
  buildings: [
    {
      name: { type: String },
      resources: [
        {
          name: { type: String },
          amount: { type: Number }
        }
      ],
      expenses: { type: Number }
    }
  ]
});

module.exports = model("BuildingCost", schema);
