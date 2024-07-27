const { getSocket } = require('../config/socket')
const { isUser } = require('../middleware/routeGuards')
const { getChatsByUserId, getChatById, getMessagesByChatId, addMessage } = require('../services/chat')
const { getUserById } = require('../services/user')
const { deleteFIleById } = require('../util/fileManagement')
const router = require('express').Router()

router.get('/', isUser(), async (req, res) => {
    const userId = req.user._id

    const chats = await getChatsByUserId(userId, req.query)
    for (const chat of chats) {
        await setChatTitle(chat, userId)
    }

    res.status(200).json(chats)
})

router.post('/messages', isUser(), async (req, res) => {
    try {
        const userId = req.user._id

        const chat = await validateUserBelongsChat(userId, req.body.chat)
        const message = await addMessage({ ...req.body, user: userId })

        const io = getSocket()
        for (const id of chat.users) {
            if (id.toString() != userId) {
                io.to(id.toString()).emit('message', message)
            }
        }

        res.status(200).json(message)
    } catch (error) {
        console.log(error);

        await Promise.all(req.body.images.map(id => deleteFIleById(id)))

        res.status(400).json(error.message)
    }
})

router.put('/messages/:id', isUser(), (req, res) => {

})

router.delete('/messages/:id', isUser(), (req, res) => {

})

router.get('/messages/:chatId', isUser(), async (req, res) => {
    try {
        const { chatId } = req.params

        await validateUserBelongsChat(req.user._id, chatId)

        res.status(200).json(await getMessagesByChatId(chatId, req.query))
    } catch (error) {
        console.log(error);
        res.status(401).json(error.message)
    }
})

router.get('/:id', isUser(), async (req, res) => {
    try {
        const userId = req.user._id

        const chat = await validateUserBelongsChat(userId, req.params.id)
        setChatTitle(chat, userId)

        const messages = await getMessagesByChatId(chat._id)

        res.status(200).json({ chat, messages })
    } catch (error) {
        console.log(error);
        res.status(401).json(error.message)
    }
})

async function validateUserBelongsChat(userId, chatId) {
    const chat = await getChatById(chatId)
    if (!chat.users.includes(userId))
        throw new Error('User has no access to this chat')

    return chat
}

async function setChatTitle(chat, currentUserId) {
    if (!chat.title) {
        const otherUser = await getUserById(chat.users.find(id => id != currentUserId))

        chat.title = otherUser.status == 'active' ? otherUser.fname + ' ' + otherUser.lname : 'Myface User'
    }
}

module.exports = router