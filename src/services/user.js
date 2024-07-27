const Chat = require("../models/Chat");
const Friendship = require("../models/Friendship");
const User = require("../models/User");

exports.getUsers = async ({ where = {}, skip = 0, limit = 10 }) => {
    const users = await User.find().where(where).skip(skip, skip + limit)

    return users
}

exports.getFriendShips = async ({ where = {}, skip = 0, limit = 10 }) => {
    const users = await Friendship.find().where(where).skip(skip, skip + limit)

    return users
}

exports.getUserById = (id) => User.findById(id)

exports.addFriendship = async (userId, friendId) => {
    const [user, friend] = await getFriendsByIds(userId, friendId)

    const existing = await getFriendshipByIds(userId, friendId)

    if (existing)
        throw new Error('Already friends!')

    await Friendship.create({
        ind: `${userId} ${friendId}`,
        requested: userId,
        accepted: friendId
    })

    await Chat.create({
        users: [userId, friendId],
        admins: [userId, friendId]
    })

    return friend
}

exports.editFriendship = async (userId, friendId) => {
    const [user, friend] = await getFriendsByIds(userId, friendId)

    const existing = await getFriendshipByIds(userId, friendId)

    if (!existing)
        throw new Error('Not yet requested!')

    existing.accepted = true

    return friend
}

exports.removeFriend = async (userId, friendId) => {
    const [user, friend] = await getFriendsByIds(userId, friendId)

    const existing = await getFriendshipByIds(userId, friendId)

    if (!existing)
        throw new Error('Not yet requested!')

    await Friendship.findByIdAndDelete(existing._id)

    return friend
}

async function getFriendsByIds(fr1Id, fr2Id) {
    const [fr1, fr2] = await Promise.all([User.findById(fr1Id), User.findById(fr2Id)])

    if (!fr1 || !fr2)
        throw new Error('No such user!')

    return [fr1, fr2]
}

async function getFriendshipByIds(fr1Id, fr2Id) {
    return await Friendship.findOne().in('ind', [`${fr1Id} ${fr2Id}`, `${fr2Id} ${fr1Id}`])
}