const bcrypt = require('bcrypt')
const User = require('../models/User')
const { PASSWORD_REGEX } = require('./constants')

async function validate(data) {
    if (!PASSWORD_REGEX.test(data.password))
        throw new Error('Invalid password!')

    if (data.password != data.rePassword)
        throw new Error('Passwords do\'t match!')

    if (await User.findOne({ email: data.email }))
        throw new Error('Email is taken!')

    await User.validate(data)

    return { ...data }
}

async function changePassword(userId, password) {
    const user = await User.findById(userId)

    if (!user || !PASSWORD_REGEX.test(password))
        throw new Error('Invalid user or password!')

    user.password = await bcrypt.hash(password, 10)

    await user.save()

    return user
}

async function register(data) {
    data.password = await bcrypt.hash(data.password, 10)

    const user = await User.create(data)

    return user
}

async function login({ email, password }) {
    const user = await User.findOne({ email }).lean()

    if (!user || !(await bcrypt.compare(password, user.password)))
        throw new Error('Wrong email or password!')

    return user
}

async function editAuthById(id, data) {
    const user = await User.findById(id)

    for (const key in data) {
        if (key == 'password') {
            if (!PASSWORD_REGEX.test(data.password))
                throw new Error('Invalid password!')

            data.password = await bcrypt.hash(data.password, 10)
        }

        if (key == 'email' && await User.find({ email: data.email }))
            throw new Error('Email is taken!')

        user[key] = data[key]
    }

    await user.save()

    return user
}

async function deleteAuthById(id) {
    return User.findByIdAndDelete(id)
}

module.exports = {
    validate,
    changePassword,
    register,
    login,
    editAuthById,
    deleteAuthById
}