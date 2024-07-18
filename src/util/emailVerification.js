const { sendEmail } = require("./email")

const verificationSession = {}

async function sendVerificationEmail(email, user) {
    try {
        const code = generateCode()

        await sendEmail(email, 'Verify Your Email', code + '')
        verificationSession[email] = { code, user }

        setTimeout(() => delete verificationSession[email], 180000)
    } catch (error) {
        console.log(error.message);
        throw new Error('Error sending the validation email!')
    }
}

function validateEmailCode(email, code) {
    if (verificationSession[email].code == code) {
        const { user } = verificationSession[email]
        delete verificationSession[email]

        return user
    } else {
        console.log(code);
        throw new Error('Invalid code!')
    }
}

function generateCode() {
    return Math.trunc(Math.random() * 9999)
}

module.exports = {
    verificationSession,
    sendVerificationEmail,
    validateEmailCode
}