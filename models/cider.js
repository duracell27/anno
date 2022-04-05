const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    userId: { type: Types.ObjectId, ref: "User" },
    werehouseId: { type: Types.ObjectId, ref: "Werehouse" },
    produceSpeed: {type: Number, default: 1.5},
    produceName: {type: String, default: 'Сидр'},
    name: {type: String, default: 'СидроВарня'},
    expenses: {type: Number, default: 15},
    size: {type: Number, default: 57}
})

module.exports = model('Cider', schema)