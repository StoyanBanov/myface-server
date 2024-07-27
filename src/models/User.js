const { model, Schema, Types: { ObjectId } } = require('mongoose')

const schema = new Schema({
    fname: { type: String, required: true, minLength: 2 },
    lname: { type: String, required: true, minLength: 2 },

    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    dob: {
        type: String, validate: {
            validator: (value) =>
                (Date.parse(value) - Date.now()) / 31536000000 < 12,
            message: () => 'Invalid date of birth!'
        }
    },
    gender: { type: String, enum: ['male', 'female'] },

    profilePic: { type: String, ref: 'Image', default: '' },

    status: { type: String, enum: ['active', 'deleted', 'banned'], default: 'active' }
})

schema.index({ email: 1 }, {
    unique: true,
    collation: {
        locale: 'en',
        strength: 2
    }
})

module.exports = model('User', schema)