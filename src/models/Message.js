const { model, Schema, Types: { ObjectId } } = require('mongoose')

module.exports = model(
    'Message',
    new Schema(
        {
            user: { type: ObjectId, ref: 'User', required: true },
            chat: { type: ObjectId, ref: 'Chat', required: true },
            text: { type: String, maxLength: 500 },
            images: { type: [String], default: [] },
        },
        { timestamps: true }
    ),
)