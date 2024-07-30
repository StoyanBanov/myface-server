const { login, register, validate, editAuthById, deleteAuthById } = require('../services/auth')
const { validateEmailCode, sendVerificationEmail } = require('../util/emailVerification')
const { sendUserData, clearSession } = require('../middleware/auth')
const { isGuest, isUser, isNotVerified } = require('../middleware/routeGuards')
const { PASSWORD_REGEX } = require('../services/constants')
const { EMAIL_VERIFICATION_TYPE_REGISTER, EMAIL_VERIFICATION_TYPE_PASSWORD, EMAIL_VERIFICATION_TYPE_DELETE } = require('../../constants')
const { deleteFIleById } = require('../util/fileManagement')
const { getUserById } = require('../services/user')
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

router.get('/logout',
    isUser(),
    clearSession()
)

router.put('/',
    isUser(),
    async (req, res, next) => {
        try {
            const user = await getUserById(req.user._id)

            req.userData = await editAuthById(req.user._id, req.body)

            if (req.body.profilePic)
                deleteFIleById(user.profilePic)

            next()
        } catch (error) {
            console.log(error);

            if (req.body.profilePic)
                await deleteFIleById(req.body.profilePic)

            res.status(400).json(error.message)
        }
    },
    sendUserData()
)



router.post('/verify',
    isNotVerified(),
    async (req, res, next) => {
        try {
            const { payload, type } = await validateEmailCode(req.user.email, req.body.code)

            if (type == EMAIL_VERIFICATION_TYPE_REGISTER) {
                req.userData = await register(payload)

                next()
            } else if (type == EMAIL_VERIFICATION_TYPE_PASSWORD) {
                req.userData = await editAuthById(req.user._id, { password: payload })

                next()
            } else if (type == EMAIL_VERIFICATION_TYPE_DELETE) {
                await deleteAuthById(req.user._id)

                res.status(204).end()
            } else throw new Error('Verification type error!')
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

            await sendVerificationEmail(EMAIL_VERIFICATION_TYPE_REGISTER, user.email, user)

            req.userData = user

            next()
        } catch (error) {
            console.log(error);
            res.status(400).json(error.message)
        }
    },
    sendUserData()
)

router.put('/change-password', isUser(), async (req, res) => {
    try {
        const { password } = req.body
        if (!PASSWORD_REGEX.test(password))
            throw new Error('Invalid password!')

        await sendVerificationEmail(EMAIL_VERIFICATION_TYPE_PASSWORD, req.user.email, password)

        res.status(204).end()
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message)
    }
})

router.delete('/delete', isUser(), async (req, res) => {
    try {
        await sendVerificationEmail(EMAIL_VERIFICATION_TYPE_DELETE, req.user.email, req.user._id)

        res.status(204).end()
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message)
    }
})

module.exports = router