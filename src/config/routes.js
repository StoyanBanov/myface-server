usersController = require('../controllers/users')
authController = require('../controllers/auth')
postsController = require('../controllers/posts')
chatsController = require('../controllers/chats')

module.exports = (app) => {
    app.use('/posts', postsController)
    app.use('/chats', chatsController)
    app.use('/users', usersController)
    app.use('/auth', authController)
}