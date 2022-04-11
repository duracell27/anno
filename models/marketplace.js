const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  userId: { type: Types.ObjectId, ref: "User" },
  expenses: { type: Number, default: 10 },
  places: [
    {
      name: { type: String },
      expenses: { type: Number },
      size: { type: Number },
    },
  ],
  residentPlaces: [
    {
      name: { type: String, default: 'СелянськаХата' },
      peasant: { type: Number, default: 1 },
      needs: [
        {
          name: { type: String },
          percent: { type: Number, default: 0 }
        }
      ],
      tax: { type: Number, default: 59 }
    },
  ],
  size: { type: Number, default: 30 },
  name: { type: String, default: "РинковаПлоща" },
});

module.exports = model("Marketplace", schema);
