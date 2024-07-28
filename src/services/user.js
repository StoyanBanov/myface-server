const Chat = require("../models/Chat");
const Friendship = require("../models/Friendship");
const User = require("../models/User");

exports.getUsers = async ({ where = {}, or, search, skip = 0, limit = 10 }) => {
    let query = User.find().where(where).skip(skip, skip + limit)

    if (or) {
        query = query.or(or)
    }

    if (search) {
        const [fname, lname] = search.split(' ')

        query = query.regex('fname', getSearchRegex(fname))
        if (lname) query = query.regex('lname', getSearchRegex(lname))
    }

    return query.lean()
}

exports.getFriendships = ({ where = {}, skip = 0, limit = 10 }) => {
    let query = Friendship.find().where(where).skip(skip, skip + limit)

    return query
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
        accepted: friendId,

        requestedFname: user.fname,
        requestedLname: user.lname,

        acceptedFname: friend.fname,
        acceptedLname: friend.lname,
    })

    return friend
}

exports.acceptFriendship = async (userId, friendId) => {
    const [user, friend] = await getFriendsByIds(userId, friendId)

    const existing = await getFriendshipByIds(userId, friendId)

    if (!existing)
        throw new Error('Not yet requested!')

    existing.isAccepted = true

    await existing.save()

    const existingChat = await Chat.find({ users: [userId, friendId] })
    if (!existingChat)
        await Chat.create({
            users: [userId, friendId],
            admins: [userId, friendId]
        })

    return friend
}

exports.removeFriendship = async (userId, friendId) => {
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