const { model, Schema, Types: { ObjectId } } = require('mongoose')

const schema = new Schema({
    ind: { type: String, required: true, unique: true },
    requested: { type: ObjectId, ref: 'User', required: true },
    accepted: { type: ObjectId, ref: 'User', required: true },
    isAccepted: { type: Boolean, default: false },

    requestedFname: { type: String, required: true },
    requestedLname: { type: String, required: true },

    acceptedFname: { type: String, required: true },
    acceptedLname: { type: String, required: true },
})

module.exports = model('Friendship', schema)