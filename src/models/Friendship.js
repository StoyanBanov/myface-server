const { model, Schema, Types: { ObjectId } } = require('mongoose')

const schema = new Schema({
    ind: { type: String, required: true, unique: true },
    requested: { type: ObjectId, required: true },
    accepted: { type: ObjectId, required: true },
    isAccepted: { type: Boolean, default: false }
})

module.exports = model('Friendship', schema)