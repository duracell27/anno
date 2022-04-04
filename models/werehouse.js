const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  userId: { type: Types.ObjectId, ref: "User" },
  lvl: { type: Number, default: 1 },
  expenses: { type: Number, default: 10 },
  places: [
    {
      buiId: { type: Types.ObjectId, ref: "LumberjackHut" },
    }
  ],
  size: { type: Number, default: 16 },
  name: { type: String, default: 'Склад' },
});

module.exports = model("Werehouse", schema);
