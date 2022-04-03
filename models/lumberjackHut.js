const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    userId: { type: Types.ObjectId, ref: "User" },
    werehouseId: { type: Types.ObjectId, ref: "Werehouse" },
    produceSpeed: {type: Number, default: 1},
    produceName: {type: String, default: 'Дерево'},
    expenses: {type: Number, default: 5},
})

module.exports = model('LumberjackHut', schema)