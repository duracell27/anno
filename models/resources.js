const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  userId: { type: Types.ObjectId, ref: "User" },
  resources: [
    {
      name: { type: String },
      amount: { type: Number },
    }
  ],
  resourcesCapacity: { type: Number, default: 40 },
  peoples: { type: Number, default: 0 },
});

module.exports = model("Resources", schema);
