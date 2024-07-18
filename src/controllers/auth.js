const { login, register, validate, changePassword } = require('../services/auth')
const { validateEmailCode, sendVerificationEmail } = require('../util/emailVerification')
const { sendUserData, clearSession } = require('../middleware/auth')
const { isGuest, isUser, isNotVerified } = require('../middleware/routeGuards')
const router = require('express').Router()

router.post('/login',
    isGuest(),
    async (req, res, next) => {
        try {
            req.userData = await login(req.body)

            next()
        } catch (error) {
            console.log(error);
            res.status(400).json(error.message)
        }
    },
    sendUserData()
)

router.post('/register',
    isGuest(),
    async (req, res, next) => {
        try {
            user = await validate(req.body)

            await sendVerificationEmail(user.email, user)

            req.userData = user

            next()
        } catch (error) {
            console.log(error);
            res.status(400).json(error.message)
        }
    },
    sendUserData()
)

router.get('/logout',
    isUser(),
    clearSession()
)

router.post('/verify-register',
    isNotVerified(),
    async (req, res, next) => {
        try {
            const user = await validateEmailCode(req.user.email, req.body.code)
            req.userData = await register(user)

            next()
        } catch (error) {
            console.log(error);
            res.status(400).json(error.message)
        }
    },
    sendUserData()
)

router.post('/change-password', isUser(), async (req, res) => {
    try {
        await sendVerificationEmail(req.user.email)

        res.status(204).end()
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message)
    }
})

router.post('/verify-change-password', isNotVerified(), async (req, res) => {
    try {
        await validateEmailCode(req.user.email, req.body.code)

        await changePassword(req.user.id)

        res.status(204).end()
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message)
    }
})

module.exports = router