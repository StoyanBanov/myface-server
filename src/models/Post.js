const { model, Schema, Types: { ObjectId } } = require('mongoose')

module.exports = model(
    'Post',
    new Schema(
        {
            user: { type: ObjectId, ref: 'User', required: true },
            text: { type: String, maxLength: 2000 },
            images: { type: [String], default: [] },
            visibility: { type: String, enum: ['owner', 'friends', 'all'], default: 'friends', required: true }
        },
        { timestamps: true }
    )
)