const jwt = require('jsonwebtoken')

const tokenSession = {}

function auth() {
    return (req, res, next) => {
        const token = req.headers.authorization

        if (token) {
            try {
                req.user = jwt.verify(token, process.env.JWT_SECRET)
                req.token = token

                if (!tokenSession[req.user._id] || !tokenSession[req.user._id][token])
                    throw new Error('Logged out!')
            } catch (error) {
                console.log(error);
                return res.status(400).json(error.message)
            }
        }

        next()
    }
}

function sendUserData() {
    return (req, res) => {
        const { _id, email } = req.userData

        let token = jwt.sign(
            { _id, email },
            process.env.JWT_SECRET
        )

        if (tokenSession.hasOwnProperty(_id)) tokenSession[_id][token] = true
        else tokenSession[_id] = { [token]: true }

        res.status(200).json({ _id, email, token })
    }
}

function clearSession() {
    return (req, res) => {
        delete tokenSession[req.user._id][req.token]

        res.status(204).end()
    }
}

module.exports = {
    auth,
    sendUserData,
    clearSession
}