const { model, Schema, Types: { ObjectId } } = require('mongoose')

module.exports = model(
    'Comment',
    new Schema(
        {
            user: { type: ObjectId, ref: 'User', required: true },
            post: { type: ObjectId, ref: 'Post' },
            comment: { type: ObjectId, ref: 'Comment' },
            text: { type: String, minLength: 1, maxLength: 200, required: true },
            images: { type: [ObjectId], ref: 'Image', default: [] },
        },
        { timestamps: true }
    ),
)