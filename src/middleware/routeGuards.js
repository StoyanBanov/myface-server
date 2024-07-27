const { verificationSession } = require("../util/emailVerification")

exports.isGuest = () => (req, res, next) => {
    if (req.user) res.status(403).json('Already logged in!')
    else next()
}

exports.isUser = () => (req, res, next) => {
    if (req.user && !verificationSession[req.user.email]) next()
    else res.status(403).json('No logged in user!')
}

exports.isNotVerified = () => (req, res, next) => {
    if (req.user && verificationSession[req.user.email]) next()
    else res.status(403).json('User already verified!')
}