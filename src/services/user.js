const Chat = require("../models/Chat");
const User = require("../models/User");

exports.getUsers = ({ where = {}, skip = 0, limit = 10 }) => User.find().where(where).skip(skip, skip + limit)

exports.getUserById = (id) => User.findById(id)

exports.addFriend = async (userId, friendId) => {
    const [user, friend] = await getFriendsByIds(userId, friendId)

    if (user.friends.includes(friendId))
        throw new Error('Already friends!')

    user.friends.push(friendId)
    friend.friends.push(userId)

    await Promise.all([user.save(), friend.save()])

    await Chat.create({
        users: [userId, friendId],
        admins: [userId, friendId]
    })

    return friend
}

exports.removeFriend = async (userId, friendId) => {
    const [user, friend] = await getFriendsByIds(userId, friendId)

    if (!user.friends.includes(friendId))
        throw new Error('Already friends!')

    removeFromFriendsArray(user, friendId)
    removeFromFriendsArray(friend, userId)

    await Promise.all([user.save(), friend.save()])

    return friend
}

async function getFriendsByIds(fr1Id, fr2Id) {
    const [fr1, fr2] = await Promise.all([User.findById(fr1Id), User.findById(fr2Id)])

    if (!fr1 || !fr2)
        throw new Error('No such user!')

    return [fr1, fr2]
}

function removeFromFriendsArray(user, friendId) {
    const id = user.friends.findIndex(f => f._id == friendId)

    user.friends.splice(id, 1)
}