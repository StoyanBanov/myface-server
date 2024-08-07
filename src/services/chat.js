const Chat = require("../models/Chat")
const Message = require("../models/Message")

exports.getChatsByUserId = async (id, { where = {}, skip = 0, limit = 10 } = {}) => Chat.find({ users: id }).where(where).skip(skip).limit(limit)

exports.getChatById = async id => Chat.findById(id)

exports.getMessagesByChatId = async (chatId, {
    skip = 0,
    limit = 10,
    orderBy = { createdAt: -1 }
} = {}) => {
    return Message
        .find({ chat: chatId })
        .sort(orderBy)
        .skip(skip)
        .limit(limit)
        .populate('user')
}

exports.addMessage = async (data) => {
    const chat = await Chat.findById(data.chat)

    if (!chat)
        throw new Error('No such chat!')

    delete data.createdAt

    if (!data.text && !data.images?.length)
        throw new Error('Empty message!')

    const message = await Message.create(data)

    return Message.findById(message._id).populate('user')
}