const {Schema, model, Types} = require('mongoose')

const schema = new Schema([{
    userId: {type: Types.ObjectId, ref: 'User'},
    tikResources: [
        {
            name: {type: String},
            value: {type: Number}
        }
    ]
}])

module.exports = model('TikResources', schema)