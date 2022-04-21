const {Schema, model} = require('mongoose')

const schema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    lastSeenBogdan: {type: Date, default: new Date}
})

module.exports = model('User', schema)