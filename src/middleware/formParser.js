const busboy = require('busboy');
const { ALLOWED_FILE_TYPES } = require('./constants');
const { uploadFile } = require('./google');

module.exports = () => (req, res, next) => {
    if (req.method === 'POST') {
        const body = {}
        const files = []

        const bb = busboy({ headers: req.headers })

        bb.on('file', async (name, file, info) => {
            const type = info.mimeType

            if (!ALLOWED_FILE_TYPES.includes(type)) {
                bb.destroy()

                return res.status(400).json(`File ${name} of type "${type}" isn\'t supported`)
            }

            files.push(uploadFile(file, type))
        })

        bb.on('error', (error) => {
            console.log(error);
        })

        bb.on('field', (name, value) => {
            body[name] = value
        })

        bb.on('close', () => {
            req.body = body
            req.files = files
            next()
        })

        req.pipe(bb)
    } else next()
}