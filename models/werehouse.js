const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  userId: { type: Types.ObjectId, ref: "User" },
  lvl: { type: Number, default: 1 },
  expenses: { type: Number,default: 10 },
  places: {
    p1: { type: Types.ObjectId, ref: "LumberjackHut" },
    p2: { type: Types.ObjectId, ref: "LumberjackHut" },
    p3: { type: Types.ObjectId, ref: "LumberjackHut" },
  },
});

module.exports = model("Werehouse", schema);
