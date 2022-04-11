const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    userId: { type: Types.ObjectId, ref: "User" },
    marketplaceId: { type: Types.ObjectId, ref: "Marketplace" },
    name: {type: String, default: 'СелянськаХата'},
    expenses: {type: Number, default: 0},
    size: {type: Number, default: 9},
    peasant: {type: Number, default: 1},
    peasantMax: {type: Number, default: 8},
    needs: [
        {
            name: {type: String},
            percent: {type: Number, default: 0}
        }
    ],
    tax: {type: Number, default: 59}


})

module.exports = model('PeasantHut', schema)