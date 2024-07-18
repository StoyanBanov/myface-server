const { model, Schema, Types: { ObjectId } } = require('mongoose')

module.exports = model(
    'Chat',
    new Schema({
        title: { type: String, maxLength: 20 },
        users: { type: [ObjectId], ref: 'User', required: true },
        admins: { type: [ObjectId], ref: 'User', required: true },
        image: { type: ObjectId, ref: 'Image' }
    })
)