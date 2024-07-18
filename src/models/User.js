const { model, Schema, Types: { ObjectId } } = require('mongoose')

const schema = new Schema({
    fname: { type: String, required: true, minLength: 1 },
    lname: { type: String, required: true, minLength: 1 },
    password: { type: String, required: true },
    email: { type: String, required: true, minLength: 5, unique: true },
    dob: {
        type: Date, validate: {
            validator: (value) =>
                value.getTime() < value.getFullYear() < Date.now().getFullYear() - 100 || value > currentDate,
            message: () => 'Invalid date of birth!'
        }
    },
    profilePic: { type: ObjectId, ref: 'Image' },
    friends: { type: [ObjectId], ref: 'User', default: [] },
    status: { type: String, enum: ['active', 'deleted', 'banned'], default: 'active' }
})

module.exports = model('User', schema)

schema.index({ email: 1 }, {
    unique: true,
    collation: {
        locale: 'en',
        strength: 2
    }
})