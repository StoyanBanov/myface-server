const { model, Schema, Types: { ObjectId } } = require('mongoose')

module.exports = model(
    'Post',
    new Schema(
        {
            user: { type: ObjectId, ref: 'User', required: true },
            text: { type: String, minLength: 1, maxLength: 2000 },
            images: { type: [ObjectId], ref: 'Image', default: [] },
            visibility: { type: String, enum: ['owner', 'friends', 'all'], default: 'friends', required: true }
        },
        { timestamps: true }
    )
)