const { model, Schema, Types: { ObjectId } } = require('mongoose')
const { MAX_IMAGES_COUNT } = require('../../constants')

module.exports = model(
    'Message',
    new Schema(
        {
            user: { type: ObjectId, ref: 'User', required: true },
            chat: { type: ObjectId, ref: 'Chat', required: true },
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