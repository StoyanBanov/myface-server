const { model, Schema, Types: { ObjectId } } = require('mongoose')

module.exports = model(
    'Like',
    new Schema(
        {
            user: { type: ObjectId, ref: 'User', required: true },
            post: { type: ObjectId, ref: 'Post' },
            comment: { type: ObjectId, ref: 'Comment' }
        }
    ),
)