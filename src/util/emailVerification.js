const { EMAIL_VERIFICATION_TYPE_REGISTER, EMAIL_VERIFICATION_TYPE_PASSWORD, EMAIL_VERIFICATION_TYPE_DELETE } = require("../../constants")
const { sendEmail } = require("./email")

const verificationSession = {
    [EMAIL_VERIFICATION_TYPE_REGISTER]: {},
    [EMAIL_VERIFICATION_TYPE_PASSWORD]: {},
    [EMAIL_VERIFICATION_TYPE_DELETE]: {}
}

async function sendVerificationEmail(type, email, payload) {
    try {
        const code = generateCode()

        await sendEmail(email, 'Verify Your Email', code + '')
        verificationSession[email] = { type, code, payload }

        setTimeout(() => delete verificationSession[email], 180000)
    } catch (error) {
        console.log(error.message);
        throw new Error('Error sending the validation email!')
    }
}

function validateEmailCode(email, code) {
    if (verificationSession[email].code == code) {
        const { type, payload } = verificationSession[email]
        delete verificationSession[email]

        return { type, payload }
    } else {
        console.log(code);
        throw new Error('Invalid code!')
    }
}

function generateCode() {
    return `${Math.trunc(Math.random() * 9999)}0000`.slice(0, 4)
}

module.exports = {
    verificationSession,
    sendVerificationEmail,
    validateEmailCode
}