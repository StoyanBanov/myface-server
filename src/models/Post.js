const { model, Schema, Types: { ObjectId } } = require('mongoose')
const { MAX_IMAGES_COUNT } = require('../../constants')

module.exports = model(
    'Post',
    new Schema(
        {
            user: { type: ObjectId, ref: 'User', required: true },
            text: { type: String, maxLength: 2000 },
            images: {
                type: [String],
                default: [],
                validate: {
                    validator: (value) => value.length <= MAX_IMAGES_COUNT,
                    message: () => `Max images count is ${MAX_IMAGES_COUNT}!`
                }
            },
            visibility: { type: String, enum: ['owner', 'friends', 'all'], default: 'friends', required: true }
        },
        { timestamps: true }
    )
)