const { model, Schema, Types: { ObjectId } } = require('mongoose')
const { MAX_IMAGES_COUNT } = require('../../constants')

module.exports = model(
    'Comment',
    new Schema(
        {
            user: { type: ObjectId, ref: 'User', required: true },
            post: { type: ObjectId, ref: 'Post' },
            comment: { type: ObjectId, ref: 'Comment' },
            text: { type: String, maxLength: 500 },
            images: {
                type: [String],
                default: [],
                validate: {
                    validator: (value) => value.length <= MAX_IMAGES_COUNT,
                    message: () => `Max images count is ${MAX_IMAGES_COUNT}!`
                }
            },
        },
        { timestamps: true }
    ),
)