const { model, Schema, Types: { ObjectId } } = require('mongoose')

module.exports = model(
    'Comment',
    new Schema(
        {
            user: { type: ObjectId, ref: 'User', required: true },
            post: { type: ObjectId, ref: 'Post' },
            comment: { type: ObjectId, ref: 'Comment' },
            text: { type: String, maxLength: 500 },
            images: { type: [String], default: [] },
        },
        { timestamps: true }
    ),
)