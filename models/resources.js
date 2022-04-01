const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    userId: {type: Types.ObjectId, ref: 'User'},
    gold: {type: Number},
    wood: {type: String, required: true},
})

module.exports = model('Resources', schema)