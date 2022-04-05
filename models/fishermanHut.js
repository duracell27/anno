const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    userId: { type: Types.ObjectId, ref: "User" },
    werehouseId: { type: Types.ObjectId, ref: "Werehouse" },
    produceSpeed: {type: Number, default: 2},
    produceName: {type: String, default: 'Риба'},
    name: {type: String, default: 'ХижинаРибака'},
    expenses: {type: Number, default: 15},
    size: {type: Number, default: 12}
})

module.exports = model('FishermanHut', schema)