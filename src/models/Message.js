const { model, Schema, Types: { ObjectId } } = require('mongoose')

module.exports = model(
    'Message',
    new Schema(
        {
            user: { type: ObjectId, ref: 'User', required: true },
            chat: { type: ObjectId, ref: 'Chat', required: true },
            text: { type: String, minLength: 1, maxLength: 200, required: true },
            images: { type: [String], ref: 'Image', default: [] },
        },
        { timestamps: true }
    ),
)