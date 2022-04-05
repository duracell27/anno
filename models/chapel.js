const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    userId: { type: Types.ObjectId, ref: "User" },
    marketplaceId: { type: Types.ObjectId, ref: "Marketplace" },
    name: {type: String, default: 'Часовня'},
    expenses: {type: Number, default: 15},
    size: {type: Number, default: 12}
})

module.exports = model('Chapel', schema)