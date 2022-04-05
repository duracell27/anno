const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    userId: { type: Types.ObjectId, ref: "User" },
    werehouseId: { type: Types.ObjectId, ref: "Werehouse" },
    produceSpeed: {type: Number, default: 1.5},
    produceName: {type: String, default: 'Дерево'},
    name: {type: String, default: 'ХижинаЛісниика'},
    expenses: {type: Number, default: 5},
    size: {type: Number, default: 69}
})

module.exports = model('LumberjackHut', schema)